package com.massivemarketmanager.backend.auth;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;
    @Value("${app.mail.from:no-reply@mmm.local}")
    private String from;

    public void sendEmailVerification(String to, String token) throws MessagingException {
        String link = frontendBaseUrl + "/auth/verify?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        var msg = mailSender.createMimeMessage();
        var helper = new MimeMessageHelper(msg, "UTF-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("Verify your MMM account");
        helper.setText(
                "<p>Confirm your email:</p>" +
                        "<p><a href=\"" + link + "\">Verify email</a></p>" +
                        "<p>Or paste this link in browser:<br/>" + link + "</p>", true
        );
        mailSender.send(msg);
    }
}

