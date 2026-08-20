package com.bookify.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {
    @Value("${bookify.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String jwtSecret;

    @Value("${bookify.jwt.access-token-expiration-ms:900000}")
    private long jwtExpirationInMs;

    private SecretKey getSigningKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            if (keyBytes.length >= 32) {
                return Keys.hmacShaKeyFor(keyBytes);
            }
        } catch (Exception ignored) {
            // Fallback for non-base64 secrets
        }
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(digest);
        } catch (Exception e) {
            byte[] fallback = Decoders.BASE64.decode("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
            return Keys.hmacShaKeyFor(fallback);
        }
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal up = (UserPrincipal) authentication.getPrincipal();
        return generateTokenFromUserId(up.getId(), up.getEmail());
    }

    public String generateAccessToken(UserPrincipal principal) {
        return generateTokenFromUserId(principal.getId(), principal.getEmail());
    }

    public String generateTokenFromUserId(Long userId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        }
        return false;
    }

    public long getExpirationInMs() { return jwtExpirationInMs; }
    public long getJwtExpirationInMs() { return jwtExpirationInMs; }
}
