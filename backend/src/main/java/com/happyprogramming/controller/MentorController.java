package com.happyprogramming.controller;

import com.happyprogramming.dto.*;
import com.happyprogramming.service.MentorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MentorController {
    private final MentorService service;

    @GetMapping
    public List<MentorResponse> getAll(
        @RequestParam(required=false) String keyword,
        @RequestParam(required=false) Boolean visible) {
        return service.getAll(keyword, visible);
    }

    @GetMapping("/{id}")
    public MentorResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<MentorResponse> create(@Valid @RequestBody MentorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public MentorResponse update(@PathVariable Long id, @Valid @RequestBody MentorRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/visibility")
    public MentorResponse setVisibility(@PathVariable Long id, @RequestParam boolean visible) {
        return service.setVisible(id, visible);
    }
}
