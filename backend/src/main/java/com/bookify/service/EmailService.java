package com.bookify.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${bookify.app.mail-from:noreply@bookify.com}")
    private String mailFrom;

    @Value("${bookify.app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String userName, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        
        log.info("==========================================================================");
        log.info("📧 [LOCAL DEV EMAIL] Verification email for: {}", toEmail);
        log.info("👉 Click link to verify: {}", verificationUrl);
        log.info("==========================================================================");

        try {
            Context context = new Context();
            context.setVariable("name", userName);
            context.setVariable("verificationUrl", verificationUrl);
            String htmlContent = templateEngine.process("email/verification-email", context);
            sendHtmlEmail(toEmail, "Verify your Bookify account", htmlContent);
        } catch (Exception e) {
            log.warn("SMTP email dispatch failed: {}", e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetOtpEmail(String toEmail, String userName, String otp) {
        log.info("==========================================================================");
        log.info("🔑 [PASSWORD RESET OTP] For email: {}", toEmail);
        log.info("👉 6-Digit OTP Code: {} (Valid for 10 minutes)", otp);
        log.info("==========================================================================");

        try {
            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>" +
                    "<body style='margin:0; padding:30px 10px; background-color:#FAF6F0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color:#1C1917;'>" +
                    "  <div style='max-width:540px; margin:0 auto; background:#ffffff; border-radius:24px; border:1px solid #EDE5D8; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.04);'>" +
                    "    <div style='background:linear-gradient(135deg, #1C1917 0%, #2A2620 100%); padding:32px 24px; text-align:center; border-bottom:2px solid #C59B27;'>" +
                    "      <h1 style='margin:0; font-size:26px; font-family:Georgia, serif; font-weight:bold; color:#ffffff; letter-spacing:1px;'>" +
                    "        Book<span style='color:#C59B27;'>ify</span>" +
                    "      </h1>" +
                    "      <p style='margin:6px 0 0 0; font-size:11px; color:#A6811E; letter-spacing:2px; text-transform:uppercase; font-weight:bold;'>Curated Literary Stacks</p>" +
                    "    </div>" +
                    "    <div style='padding:36px 32px;'>" +
                    "      <span style='display:inline-block; padding:4px 12px; background:#FAF6F0; border:1px solid #EDE5D8; border-radius:100px; font-size:11px; font-weight:bold; color:#A6811E; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;'>Security Verification</span>" +
                    "      <h2 style='margin:0 0 12px 0; font-size:22px; font-family:Georgia, serif; color:#1C1917; font-weight:bold;'>Password Reset Verification</h2>" +
                    "      <p style='margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#57534E;'>Hello <strong>" + userName + "</strong>, we received a request to securely reset your password. Use the 6-digit verification code below to proceed:</p>" +
                    "      <div style='background:linear-gradient(135deg, #FAF6F0 0%, #F5EFE6 100%); border:2px dashed #C59B27; border-radius:18px; padding:24px; text-align:center; margin:24px 0;'>" +
                    "        <span style='font-size:11px; font-weight:bold; color:#78716C; text-transform:uppercase; letter-spacing:2px; display:block; margin-bottom:8px;'>Your 6-Digit OTP Code</span>" +
                    "        <span style='font-family:\"Courier New\", Courier, monospace; font-size:36px; font-weight:900; color:#1C1917; letter-spacing:10px; display:inline-block;'>" + otp + "</span>" +
                    "      </div>" +
                    "      <p style='margin:0 0 16px 0; font-size:12px; line-height:1.5; color:#78716C; text-align:center;'>⏳ This code will expire in <strong>10 minutes</strong>. Never share this code with anyone.</p>" +
                    "      <div style='margin-top:28px; padding-top:20px; border-top:1px solid #F5EFE6; font-size:12px; color:#A8A29E; line-height:1.5;'>" +
                    "        <p style='margin:0;'>If you did not request a password reset, you can safely ignore this email. Your Bookify account remains completely secure.</p>" +
                    "      </div>" +
                    "    </div>" +
                    "    <div style='background:#FAF6F0; padding:20px; text-align:center; border-top:1px solid #EDE5D8; font-size:11px; color:#A8A29E;'>" +
                    "      <p style='margin:0 0 4px 0; font-weight:bold; color:#78716C;'>Bookify • Personal Product by Aditya Sharma</p>" +
                    "      <p style='margin:0;'>&copy; " + java.time.Year.now().getValue() + " Bookify. All rights reserved.</p>" +
                    "    </div>" +
                    "  </div>" +
                    "</body>" +
                    "</html>";
            sendHtmlEmail(toEmail, "🔑 Your Bookify Password Reset OTP: " + otp, htmlContent);
        } catch (Exception e) {
            log.warn("SMTP dispatch failed: {}", e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        log.info("==========================================================================");
        log.info("✨ [WELCOME EMAIL] Dispatching welcome email for: {}", toEmail);
        log.info("==========================================================================");

        try {
            String exploreUrl = frontendUrl + "/books";
            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>" +
                    "<body style='margin:0; padding:30px 10px; background-color:#FAF6F0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color:#1C1917;'>" +
                    "  <div style='max-width:540px; margin:0 auto; background:#ffffff; border-radius:24px; border:1px solid #EDE5D8; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.04);'>" +
                    "    <div style='background:linear-gradient(135deg, #1C1917 0%, #2A2620 100%); padding:36px 24px; text-align:center; border-bottom:2px solid #C59B27;'>" +
                    "      <h1 style='margin:0; font-size:28px; font-family:Georgia, serif; font-weight:bold; color:#ffffff; letter-spacing:1px;'>" +
                    "        Book<span style='color:#C59B27;'>ify</span>" +
                    "      </h1>" +
                    "      <p style='margin:6px 0 0 0; font-size:11px; color:#A6811E; letter-spacing:2px; text-transform:uppercase; font-weight:bold;'>Curated Literary Stacks</p>" +
                    "    </div>" +
                    "    <div style='padding:36px 32px;'>" +
                    "      <span style='display:inline-block; padding:4px 12px; background:#FAF6F0; border:1px solid #EDE5D8; border-radius:100px; font-size:11px; font-weight:bold; color:#A6811E; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;'>Welcome to Bookify</span>" +
                    "      <h2 style='margin:0 0 12px 0; font-size:22px; font-family:Georgia, serif; color:#1C1917; font-weight:bold;'>Your Reading Journey Begins Here</h2>" +
                    "      <p style='margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#57534E;'>Hello <strong>" + userName + "</strong>, welcome to Bookify! Your reader account is now active and ready. Here is what you can do right now:</p>" +
                    "      <div style='background:#FAF6F0; border-radius:18px; padding:20px; border:1px solid #EDE5D8; margin-bottom:24px;'>" +
                    "        <div style='margin-bottom:16px;'>" +
                    "          <h4 style='margin:0 0 4px 0; font-size:14px; font-weight:bold; color:#1C1917;'>📚 Explore Curated Stacks</h4>" +
                    "          <p style='margin:0; font-size:12px; color:#78716C;'>Browse thousands of handpicked titles across fiction, tech, business, and philosophy.</p>" +
                    "        </div>" +
                    "        <div style='margin-bottom:16px;'>" +
                    "          <h4 style='margin:0 0 4px 0; font-size:14px; font-weight:bold; color:#1C1917;'>🛍️ Pre-Loved Marketplace</h4>" +
                    "          <p style='margin:0; font-size:12px; color:#78716C;'>Buy used books from fellow readers at up to 70% off with 100% escrow protection, or sell your own.</p>" +
                    "        </div>" +
                    "        <div>" +
                    "          <h4 style='margin:0 0 4px 0; font-size:14px; font-weight:bold; color:#1C1917;'>📊 Track Reading Goals</h4>" +
                    "          <p style='margin:0; font-size:12px; color:#78716C;'>Log pages read daily, track annual milestones, and curate custom wishlist collections.</p>" +
                    "        </div>" +
                    "      </div>" +
                    "      <div style='text-align:center; margin:28px 0;'>" +
                    "        <a href='" + exploreUrl + "' style='display:inline-block; background:linear-gradient(135deg, #C59B27 0%, #A6811E 100%); color:#ffffff; font-weight:bold; font-size:14px; text-decoration:none; padding:14px 36px; border-radius:14px; box-shadow:0 4px 12px rgba(197, 155, 39, 0.3);'>" +
                    "          Explore Bookify Catalog →" +
                    "        </a>" +
                    "      </div>" +
                    "      <div style='margin-top:28px; padding-top:20px; border-top:1px solid #F5EFE6; font-size:12px; color:#A8A29E; line-height:1.5;'>" +
                    "        <p style='margin:0;'>Happy reading &amp; collecting,<br><strong style='color:#78716C;'>Aditya Sharma</strong> &amp; the Bookify Team</p>" +
                    "      </div>" +
                    "    </div>" +
                    "    <div style='background:#FAF6F0; padding:20px; text-align:center; border-top:1px solid #EDE5D8; font-size:11px; color:#A8A29E;'>" +
                    "      <p style='margin:0 0 4px 0; font-weight:bold; color:#78716C;'>Bookify • Personal Product by Aditya Sharma</p>" +
                    "      <p style='margin:0;'>&copy; " + java.time.Year.now().getValue() + " Bookify. All rights reserved.</p>" +
                    "    </div>" +
                    "  </div>" +
                    "</body>" +
                    "</html>";
            sendHtmlEmail(toEmail, "✨ Welcome to Bookify, " + userName + "! Your Reading Journey Begins", htmlContent);
        } catch (Exception e) {
            log.warn("Welcome email dispatch failed: {}", e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        helper.setTo(to);
        helper.setFrom(mailFrom);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }
}
