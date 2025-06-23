package org.scray.logbookappApi.Objects;

public class Document {
    private String fileName;
    private String hash;
    private long uploadDate;
    private String s3Key;
    private long fileSize;
    private String contentType;

    private String status = "ACTIVE";
    private long lastModified;
    private int version = 1;
    private String modifiedBy;
    private long preparedAt;
    private long expiresAt;
    private long committedAt;
    private long abortedAt;

    public Document() {
        super();
        this.status = "ACTIVE";
        this.version = 1;
        this.lastModified = System.currentTimeMillis() / 1000;
    }

    public Document(String fileName, String hash, long uploadDate, String s3Key, long fileSize, String contentType) {
        this.fileName = fileName;
        this.hash = hash;
        this.uploadDate = uploadDate;
        this.s3Key = s3Key;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.status = "ACTIVE";
        this.version = 1;
        this.lastModified = uploadDate;
    }

    // Getters and Setters
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public long getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(long uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getLastModified() {
        return lastModified;
    }

    public void setLastModified(long lastModified) {
        this.lastModified = lastModified;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public long getPreparedAt() {
        return preparedAt;
    }

    public void setPreparedAt(long preparedAt) {
        this.preparedAt = preparedAt;
    }

    public long getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(long expiresAt) {
        this.expiresAt = expiresAt;
    }

    public long getCommittedAt() {
        return committedAt;
    }

    public void setCommittedAt(long committedAt) {
        this.committedAt = committedAt;
    }

    public long getAbortedAt() {
        return abortedAt;
    }

    public void setAbortedAt(long abortedAt) {
        this.abortedAt = abortedAt;
    }

    // Hilfsmethoden
    public boolean isActive() {
        return "ACTIVE".equals(this.status);
    }

    public boolean isPending() {
        return "PENDING".equals(this.status);
    }

    public boolean isDeleted() {
        return "DELETED".equals(this.status);
    }

    public boolean isExpired() {
        return "EXPIRED".equals(this.status);
    }

    public boolean isAborted() {
        return "ABORTED".equals(this.status);
    }

    public void markAsDeleted(String deletedBy) {
        this.status = "DELETED";
        this.lastModified = System.currentTimeMillis() / 1000;
        this.modifiedBy = deletedBy;
    }

    public void markAsPending() {
        this.status = "PENDING";
        this.preparedAt = System.currentTimeMillis() / 1000;
        this.expiresAt = this.preparedAt + 300; // 5 Minuten
    }

    public void markAsActive(String s3Key) {
        this.status = "ACTIVE";
        this.s3Key = s3Key;
        this.committedAt = System.currentTimeMillis() / 1000;
        this.lastModified = this.committedAt;
    }

    public void markAsAborted() {
        this.status = "ABORTED";
        this.abortedAt = System.currentTimeMillis() / 1000;
        this.lastModified = this.abortedAt;
    }

    public void incrementVersion() {
        this.version++;
        this.lastModified = System.currentTimeMillis() / 1000;
    }

    @Override
    public String toString() {
        return "Document [fileName=" + fileName + ", hash=" + hash + ", uploadDate=" + uploadDate
                + ", s3Key=" + s3Key + ", fileSize=" + fileSize + ", contentType=" + contentType
                + ", status=" + status + ", version=" + version + ", lastModified=" + lastModified
                + ", modifiedBy=" + modifiedBy + "]";
    }
}