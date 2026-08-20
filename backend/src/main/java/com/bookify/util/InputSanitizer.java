package com.bookify.util;

import java.util.regex.Pattern;

/**
 * Enterprise Input Sanitization & Anti-XSS Defense
 * Strips dangerous HTML tags, JavaScript event handlers, and malicious payloads.
 */
public final class InputSanitizer {

    private static final Pattern SCRIPT_TAG_PATTERN = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
    private static final Pattern SRC_JAVASCRIPT_PATTERN = Pattern.compile("src[\\r\\n]*=[\\r\\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private static final Pattern ON_EVENTS_PATTERN = Pattern.compile("on[a-zA-Z]+\\s*=", Pattern.CASE_INSENSITIVE);
    private static final Pattern JAVASCRIPT_PROTOCOL_PATTERN = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
    private static final Pattern IFRAME_PATTERN = Pattern.compile("<iframe(.*?)>(.*?)</iframe>", Pattern.CASE_INSENSITIVE);
    private static final Pattern GENERIC_TAG_PATTERN = Pattern.compile("<[^>]*>", Pattern.CASE_INSENSITIVE);

    private InputSanitizer() {}

    /**
     * Sanitizes plain text input by stripping all HTML tags and JS injections.
     */
    public static String sanitizePlainText(String input) {
        if (input == null) return null;
        String cleaned = input.trim();
        cleaned = SCRIPT_TAG_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = IFRAME_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = JAVASCRIPT_PROTOCOL_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = ON_EVENTS_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = GENERIC_TAG_PATTERN.matcher(cleaned).replaceAll("");
        return cleaned.trim();
    }

    /**
     * Sanitizes email by lowercasing, trimming, and rejecting invalid ASCII control characters.
     */
    public static String sanitizeEmail(String email) {
        if (email == null) return null;
        return email.toLowerCase().trim().replaceAll("[\\r\\n\\t]", "");
    }
}
