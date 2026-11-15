package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.config.AppProps;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final AppProps appProps;

    private static final String SUBJECT_VERIFY = "Verify your MMM account";

    private static final String HTML_VERIFY = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;">
        <table align="center" width="100%%%%" style="max-width: 480px; margin: 40px auto; background: linear-gradient(135deg, #0f0f0f 0%%, #1a1a1a 100%%); border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 255, 128, 0.1); overflow: hidden; border: 1px solid #262626;">
            <!-- Header with Tech Elements -->
            <tr>
                <td style="padding: 48px 40px 32px; text-align: center; background: linear-gradient(135deg, #000000 0%%, #059669 100%%); position: relative;">
                    <h1 style="margin: 0 0 12px; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.025em;">
                        MMM
                    </h1>
                    <p style="margin: 0; font-size: 18px; color: #d1fae5; font-weight: 600; letter-spacing: 0.5px;">
                        EMAIL VERIFICATION REQUIRED
                    </p>
                </td>
            </tr>
            <!-- Content -->
            <tr>
                <td style="padding: 40px;">
                    <p style="font-size: 20px; line-height: 1.6; margin: 0 0 16px; color: #f8fafc; font-weight: 700; text-align: center;">
                        Verify Your Account Access
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px; color: #cbd5e1; text-align: center;">
                        Join the forefront of decentralized finance. Your ML-driven trading terminal is waiting.
                    </p>
                    <!-- Stats Grid -->
                    <table width="100%%%%" style="margin: 32px 0; background: rgba(255, 255, 255, 0.02); border-radius: 12px; border: 1px solid #334155; padding: 20px;">
                        <tr>
                            <td style="text-align: center; padding: 0 16px;">
                                <div style="font-size: 24px; font-weight: 800; color: #10b981;">AI</div>
                                <div style="font-size: 12px; color: #94a3b8;">ML MODELS</div>
                            </td>
                            <td style="text-align: center; padding: 0 16px;">
                                <div style="font-size: 24px; font-weight: 800; color: #10b981;">L2</div>
                                <div style="font-size: 12px; color: #94a3b8;">NETWORKS</div>
                            </td>
                            <td style="text-align: center; padding: 0 16px;">
                                <div style="font-size: 24px; font-weight: 800; color: #10b981;">DeFi</div>
                                <div style="font-size: 12px; color: #94a3b8;">EXECUTION</div>
                            </td>
                        </tr>
                    </table>
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="%1$s"
                           style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #059669 0%%, #047857 100%%); color: white; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 8px; border: 1px solid #10b981; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); letter-spacing: 0.5px;">
                           VERIFY EMAIL ADDRESS
                        </a>
                    </div>
                    <!-- Inspirational Quote -->
                    <div style="background: linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%%, transparent 100%%); padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 32px 0;">
                        <p style="font-size: 15px; line-height: 1.6; margin: 0; color: #d1fae5; font-style: italic; text-align: center;">
                            "Price is what you pay, value is what you get" - Warren Buffett
                        </p>
                    </div>
                    <!-- Fallback Link -->
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 8px; border: 1px solid #374151;">
                        <p style="font-size: 14px; color: #9ca3af; margin: 0 0 12px; font-weight: 600; text-align: center;">
                            VERIFICATION URL
                        </p>
                        <code style="font-size: 13px; color: #10b981; word-break: break-all; background: rgba(16, 185, 129, 0.1); padding: 12px 16px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.2); display: block; font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;">
                            %1$s
                        </code>
                    </div>
                </td>
            </tr>
            <!-- Security Notice -->
            <tr>
                <td style="padding: 0 40px 32px;">
                    <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #d97706; padding: 16px; border-radius: 8px;">
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <svg style="width: 18px; height: 18px; color: #f59e0b; flex-shrink: 0; margin-top: 1px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m8-6V6a3 3 0 00-3-3H8a3 3 0 00-3 3v2m11 0H4m11 0a3 3 0 013 3v5a3 3 0 01-3 3H8a3 3 0 01-3-3v-5a3 3 0 013-3h7z"></path>
                            </svg>
                            <div>
                                <p style="font-size: 14px; color: #fbbf24; margin: 0 0 4px; font-weight: 700;">
                                    SECURITY VERIFICATION
                                </p>
                                <p style="font-size: 14px; color: #fbbf24; margin: 0;">
                                    This verification link expires in <strong style="color: white;">15 minutes</strong>.
                                    Generated by MMM Security Engine v2.1
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <!-- Tech Stack Footer -->
            <tr>
                <td style="padding: 32px 40px; background: rgba(0, 0, 0, 0.3); text-align: center; border-top: 1px solid #262626;">
                    <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px; letter-spacing: 1px; font-weight: 600;">
                        MASSIVE MARKET MANAGER • AI-DRIVEN DEFI TRADING
                    </p>
                    <p style="font-size: 14px; color: #9ca3af; margin: 0 0 12px;">
                        <a href="https://mmm.example.com/help" style="color: #10b981; text-decoration: none; font-weight: 500;">Help Center</a> •
                        <a href="mailto:support@mmm.com" style="color: #10b981; text-decoration: none; font-weight: 500;">Support</a>
                    </p>
                    <p style="font-size: 12px; color: #6b7280; margin: 0;">
                        © 2025 Massive Market Manager • Secure Email Verification
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """;

    private static final String TEXT_VERIFY = """
        Confirm your email:

        %1$s

        Or paste this link in your browser:
        %1$s
        """;

    public void sendEmailVerification(String to, String token) throws MessagingException {
        final String link = UriComponentsBuilder
                .fromUriString(appProps.frontendBaseUrl())
                .path("/auth/verify")
                .queryParam("token", token)
                .build()
                .toUriString();

        var msg = mailSender.createMimeMessage();
        var helper = new MimeMessageHelper(msg, true,"UTF-8");
        helper.setFrom(appProps.mail().from());
        helper.setTo(to);
        helper.setSubject(SUBJECT_VERIFY);
        helper.setText(TEXT_VERIFY.formatted(link), HTML_VERIFY.formatted(link));
        mailSender.send(msg);
    }
}