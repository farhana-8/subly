package com.subly.billing.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Production implementation of EmailService using SMTP.
 */
@Service
public class SmtpEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(SmtpEmailService.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;
    private final String appBaseUrl;
    
    @Value("${spring.mail.host:unknown}")
    private String smtpHost;
    
    @Value("${spring.mail.port:unknown}")
    private String smtpPort;

    public SmtpEmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String fromEmail,
            @Value("${subly.app.base-url:http://localhost:5173}") String appBaseUrl) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
        this.appBaseUrl = appBaseUrl;
    }

    @Override
    public void sendVerificationEmail(String email, String token) {
        String verificationUrl = String.format("%s/verify-email?token=%s", appBaseUrl, token);
        String subject = "Verify your Subly account";
        String content = String.format(
                "Hello,<br><br>Please click the link below to verify your account:<br>" +
                "<a href=\"%s\">Verify Account</a><br><br>" +
                "If you did not request this, please ignore this email.",
                verificationUrl
        );
        sendHtmlEmail(email, subject, content);
    }

    @Override
    public void sendPasswordResetEmail(String email, String token) {
        String resetUrl = String.format("%s/reset-password?token=%s", appBaseUrl, token);
        String subject = "Reset your Subly password";
        String content = String.format(
                "Hello,<br><br>Please click the link below to reset your password:<br>" +
                "<a href=\"%s\">Reset Password</a><br><br>" +
                "If you did not request this, please ignore this email.",
                resetUrl
        );
        sendHtmlEmail(email, subject, content);
    }

    @Override
    public void sendUpcomingRenewalEmail(String email, String message) {
        sendHtmlEmail(email, "Upcoming Subscription Renewal", message);
    }

    @Override
    public void sendSubscriptionExpiredEmail(String email, String message) {
        sendHtmlEmail(email, "Subscription Expired", message);
    }

    @Override
    public void sendRenewalSuccessEmail(String email, String message) {
        sendHtmlEmail(email, "Subscription Renewed Successfully", message);
    }

    @Override
    public void sendRenewalFailedEmail(String email, String message) {
        sendHtmlEmail(email, "Subscription Renewal Failed", message);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        logger.info("EMAIL_SEND_ATTEMPT to={} host={} port={}", to, smtpHost, smtpPort);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("EMAIL_SEND_SUCCESS to={}", to);
        } catch (Exception e) {
            logger.error("EMAIL_SEND_FAILURE to={} host={} port={} exception={} message={}", 
                to, smtpHost, smtpPort, e.getClass().getSimpleName(), e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
