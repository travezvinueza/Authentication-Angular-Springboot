package com.ricardo.backend.service.impl;

import com.ricardo.backend.service.FileUploadService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@Slf4j
@Service
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${file.upload-dir}")
    private String UPLOAD_FOLDER;

    @Value("${base-url}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        Path uploadPath = Paths.get(UPLOAD_FOLDER);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                throw new RuntimeException("No se pudo crear el directorio de carga", e);
            }
        }
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        if (!file.isEmpty()){
            byte [] bytes = file.getBytes();
            String originalFileName = Objects.requireNonNull(file.getOriginalFilename()); // Obtener el nombre original del archivo
            String sanitizedFileName = originalFileName.replaceAll("[^a-zA-Z0-9.]", "_");
            // Codificar el nombre del archivo
            String encodedFileName = URLEncoder.encode(sanitizedFileName, StandardCharsets.UTF_8);
            Path path = Paths.get(UPLOAD_FOLDER).resolve(encodedFileName);
            Files.write(path, bytes);
            return baseUrl + encodedFileName;
        }
        return null;
    }

    @Override
    public void deleteUpload(String fileName) throws IOException {
        Path path = Paths.get(UPLOAD_FOLDER, fileName);
        Files.deleteIfExists(path);
    }

}