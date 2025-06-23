package org.scray.logbookappApi.Operations;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
public class S3Service {

    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    // ALTE IONOS Konfiguration (auskommentiert)
    // private static final String BUCKET_NAME = "logichain-docs";
    // private static final String ENDPOINT_URL = "https://s3.eu-central-3.ionoscloud.com";
    // private static final String ACCESS_KEY = "EEAAAAT7hMVqlLZLapl0ThRI5K3otCk_ljLMUPCl1M0gB1XtRAAAAAEB7H2IAAAAAAHsfYjzjo2KoPCYSMw96M5SLGAS";

    // NEUE Minio Konfiguration
    private static final String BUCKET_NAME = "logichain-docs"; // Bucket Name - evtl. anpassen!
    private static final String ENDPOINT_URL = "https://de-fra.i3storage.com"; // Falls HTTPS nicht geht, "http://" probieren
    private static final String ACCESS_KEY = "9aypxwt7ifvel18e";

    // Secret Key - entweder aus application.properties oder direkt hier
    @Value("${s3.secret-key:DtFImSGHUVQaNBf6GRdhRNIHL19Hs5dxqbi4sc0yivfBbnRy}")
    private String secretKey;

    // Erlaubte Dateitypen
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/csv"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    private AmazonS3 s3Client;

    @PostConstruct
    public void init() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(ACCESS_KEY, secretKey);

        s3Client = AmazonS3ClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(
                        ENDPOINT_URL, "us-east-1")) // Minio erwartet oft us-east-1
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .withPathStyleAccessEnabled(true) // Wichtig für Minio!
                .build();

        // Test ob Bucket existiert, sonst erstellen
        try {
            if (!s3Client.doesBucketExistV2(BUCKET_NAME)) {
                logger.info("Creating bucket: " + BUCKET_NAME);
                s3Client.createBucket(BUCKET_NAME);
            } else {
                logger.info("Bucket already exists: " + BUCKET_NAME);
            }
        } catch (Exception e) {
            logger.warn("Could not check/create bucket: " + e.getMessage());
            // Nicht kritisch - vielleicht existiert der Bucket schon
        }

        logger.info("Minio Client initialized for bucket: " + BUCKET_NAME);

        // Optional: Connection Test beim Start
        // testConnection();
    }

    /**
     * Test-Methode für die Minio-Verbindung
     */
    public void testConnection() {
        try {
            logger.info("Testing Minio connection...");

            // Liste alle Buckets
            List<Bucket> buckets = s3Client.listBuckets();
            logger.info("Available buckets: " + buckets.size());
            for (Bucket bucket : buckets) {
                logger.info(" - " + bucket.getName());
            }

            // Test Upload
            String testKey = "test/connection-test.txt";
            String content = "Minio connection test at " + new Date();

            ObjectMetadata metadata = new ObjectMetadata();
            byte[] contentBytes = content.getBytes();
            metadata.setContentLength(contentBytes.length);

            s3Client.putObject(new PutObjectRequest(
                    BUCKET_NAME,
                    testKey,
                    new ByteArrayInputStream(contentBytes),
                    metadata
            ));

            logger.info("Test upload successful!");

            // Cleanup
            s3Client.deleteObject(BUCKET_NAME, testKey);
            logger.info("Test file deleted successfully!");

        } catch (Exception e) {
            logger.error("Minio connection test failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Lädt eine Datei zu S3 hoch
     */
    public String uploadFile(MultipartFile file, String userId, String tourId) throws IOException {
        // Validierung
        validateFile(file);

        // S3 Key generieren: userId/tourId/timestamp_filename
        String fileName = System.currentTimeMillis() + "_" + sanitizeFileName(file.getOriginalFilename());
        String s3Key = userId + "/" + tourId + "/" + fileName;

        // Metadata setzen
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        // Hash berechnen
        String hash = calculateSHA256(file.getBytes());
        metadata.addUserMetadata("sha256", hash);

        // Upload zu S3
        try {
            PutObjectRequest putRequest = new PutObjectRequest(
                    BUCKET_NAME,
                    s3Key,
                    new ByteArrayInputStream(file.getBytes()),
                    metadata
            );

            s3Client.putObject(putRequest);
            logger.info("File uploaded successfully to Minio: " + s3Key);

            return s3Key;

        } catch (Exception e) {
            logger.error("Error uploading file to Minio: " + e.getMessage());
            throw new IOException("Failed to upload file to Minio", e);
        }
    }

    /**
     * Lädt eine Datei von S3 herunter
     */
    public byte[] downloadFile(String s3Key) throws IOException {
        try {
            S3Object s3Object = s3Client.getObject(BUCKET_NAME, s3Key);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();

            byte[] content = IOUtils.toByteArray(inputStream);
            inputStream.close();

            logger.info("File downloaded successfully from Minio: " + s3Key);
            return content;

        } catch (Exception e) {
            logger.error("Error downloading file from Minio: " + e.getMessage());
            throw new IOException("Failed to download file from Minio", e);
        }
    }

    /**
     * Löscht eine Datei aus S3
     */
    public void deleteFile(String s3Key) {
        try {
            s3Client.deleteObject(BUCKET_NAME, s3Key);
            logger.info("File deleted successfully from Minio: " + s3Key);
        } catch (Exception e) {
            logger.error("Error deleting file from Minio: " + e.getMessage());
            throw new RuntimeException("Failed to delete file from Minio", e);
        }
    }

    /**
     * Validiert die hochgeladene Datei
     */
    private void validateFile(MultipartFile file) {
        // Größe prüfen
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Datei ist zu groß. Maximum: 10MB");
        }

        // Dateityp prüfen
        String contentType = file.getContentType();
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Dateityp nicht erlaubt. Erlaubt sind: PDF, Excel, CSV");
        }

        // Dateiname prüfen
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("Dateiname darf nicht leer sein");
        }

        // Extension prüfen
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        if (!Arrays.asList("pdf", "xls", "xlsx", "csv").contains(extension)) {
            throw new IllegalArgumentException("Ungültige Dateierweiterung. Erlaubt: .pdf, .xls, .xlsx, .csv");
        }
    }

    /**
     * Berechnet SHA256 Hash einer Datei
     */
    public String calculateSHA256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    /**
     * Bereinigt Dateinamen für S3
     */
    private String sanitizeFileName(String fileName) {
        // Entferne unsichere Zeichen
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}