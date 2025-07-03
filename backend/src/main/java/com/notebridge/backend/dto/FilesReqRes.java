package com.notebridge.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON
@JsonIgnoreProperties(ignoreUnknown = true) // Ignore the "not defined" fields in my JSON file
public class FilesReqRes {
    // Response fields
    private int statusCode;
    private String error;
    private String message;

    // File info
    private String fileUrl;
    private byte[] fileContent;
}
