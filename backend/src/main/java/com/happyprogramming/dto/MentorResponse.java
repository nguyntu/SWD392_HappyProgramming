package com.happyprogramming.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MentorResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String skills;
    private String cv;
    private Boolean visible;
}
