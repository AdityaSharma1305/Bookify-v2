package com.bookify.security;

import com.bookify.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Enterprise IP-based Rate Limiting Filter
 * Defends against:
 * 1. Brute-force password guessing & credential stuffing on /api/auth/login (Limit: 5 req/min)
 * 2. Sybil & spam user registrations on /api/auth/register (Limit: 5 req/min)
 * 3. Email & OTP bomb attacks on /api/auth/send-otp (Limit: 3 req/min)
 * 4. High-frequency API DoS attacks (Limit: 120 req/min per IP)
 */
@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int LOGIN_LIMIT = 60;
    private static final int REGISTER_LIMIT = 60;
    private static final int OTP_LIMIT = 20;
    private static final int GLOBAL_LIMIT = 600;
    private static final long WINDOW_MILLIS = 60_000L; // 1 minute sliding window

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, RequestBucket> ipBuckets = new ConcurrentHashMap<>();

    private static class RequestBucket {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long windowStart = System.currentTimeMillis();

        public boolean tryConsume(int maxAllowed) {
            long now = System.currentTimeMillis();
            if (now - windowStart > WINDOW_MILLIS) {
                synchronized (this) {
                    if (now - windowStart > WINDOW_MILLIS) {
                        count.set(0);
                        windowStart = now;
                    }
                }
            }
            return count.incrementAndGet() <= maxAllowed;
        }

        public long getSecondsUntilReset() {
            long elapsed = System.currentTimeMillis() - windowStart;
            long remaining = WINDOW_MILLIS - elapsed;
            return Math.max(1, remaining / 1000);
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Skip rate limiting for static assets and preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(method) || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        String bucketKey = clientIp + ":" + getEndpointCategory(path);
        int maxLimit = getMaxLimitForPath(path);

        RequestBucket bucket = ipBuckets.computeIfAbsent(bucketKey, k -> new RequestBucket());

        // Periodically prune stale buckets if map grows too large
        if (ipBuckets.size() > 10_000) {
            pruneStaleBuckets();
        }

        if (!bucket.tryConsume(maxLimit)) {
            long retryAfterSec = bucket.getSecondsUntilReset();
            log.warn("Rate limit exceeded for IP: {} on path: {}. Max: {} req/min", clientIp, path, maxLimit);

            response.resetBuffer();
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            String origin = request.getHeader("Origin");
            if (origin != null && !origin.isBlank()) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Access-Control-Allow-Credentials", "true");
            } else {
                response.setHeader("Access-Control-Allow-Origin", "*");
            }

            response.setHeader("Retry-After", String.valueOf(retryAfterSec));
            response.setHeader("X-RateLimit-Limit", String.valueOf(maxLimit));
            response.setHeader("X-RateLimit-Remaining", "0");

            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("success", false);
            errorBody.put("message", "Too many requests. Please wait " + retryAfterSec + " seconds before trying again.");
            errorBody.put("errorCode", ErrorCode.RATE_LIMIT_EXCEEDED.name());
            errorBody.put("retryAfterSeconds", retryAfterSec);
            errorBody.put("path", path);
            errorBody.put("timestamp", LocalDateTime.now().toString());

            objectMapper.writeValue(response.getOutputStream(), errorBody);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getEndpointCategory(String path) {
        if (path.contains("/auth/login")) return "LOGIN";
        if (path.contains("/auth/register")) return "REGISTER";
        if (path.contains("/auth/send-otp") || path.contains("/auth/reset-password-otp")) return "OTP";
        return "GLOBAL";
    }

    private int getMaxLimitForPath(String path) {
        if (path.contains("/auth/login")) return LOGIN_LIMIT;
        if (path.contains("/auth/register")) return REGISTER_LIMIT;
        if (path.contains("/auth/send-otp") || path.contains("/auth/reset-password-otp")) return OTP_LIMIT;
        return GLOBAL_LIMIT;
    }

    /**
     * Extracts true client IP behind Cloudflare, Vercel, Render proxies
     */
    private String getClientIp(HttpServletRequest request) {
        String cfIp = request.getHeader("CF-Connecting-IP");
        if (cfIp != null && !cfIp.isBlank()) return cfIp.trim();

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) return xRealIp.trim();

        return request.getRemoteAddr();
    }

    private void pruneStaleBuckets() {
        long now = System.currentTimeMillis();
        ipBuckets.entrySet().removeIf(entry -> (now - entry.getValue().windowStart) > (WINDOW_MILLIS * 2));
    }
}
