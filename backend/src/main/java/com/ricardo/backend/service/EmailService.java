package com.ricardo.backend.service;

import com.ricardo.backend.exception.EmailSendNotFoundException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender javaMailSender;

    public void sendEmail(String to,String subject,String body) {

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body,true);
            javaMailSender.send(message);
            log.info("Email enviado a: {}", to + body);
        } catch (MessagingException e) {
            log.error("Error enviando email a: {}. Error: {}", to, e.getMessage());
            throw new EmailSendNotFoundException("Error enviando email a: " + to + ". Error: " + e);
        }
    }
}
