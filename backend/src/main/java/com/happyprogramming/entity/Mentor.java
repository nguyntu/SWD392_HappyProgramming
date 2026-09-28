package com.happyprogramming.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mentors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Mentor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 255)
    private String phone;

    @Column(length = 255)
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String cv;

    @Column(nullable = false)
    private Boolean visible = true;
}
