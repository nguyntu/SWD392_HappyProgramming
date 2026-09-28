package com.happyprogramming.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MentorRequest {
    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be <= 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    @Size(max = 150, message = "Email must be <= 150 characters")
    private String email;

    @Size(max = 255, message = "Phone must be <= 255 characters")
    private String phone;

    @Size(max = 255, message = "Skills must be <= 255 characters")
    private String skills;

    private String cv;
    private Boolean visible;
}
