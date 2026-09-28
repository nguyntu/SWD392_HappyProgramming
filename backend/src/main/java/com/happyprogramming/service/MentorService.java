package com.happyprogramming.service;

import com.happyprogramming.dto.*;
import java.util.List;

public interface MentorService {
    List<MentorResponse> getAll(String keyword, Boolean visible);
    MentorResponse getById(Long id);
    MentorResponse create(MentorRequest request);
    MentorResponse update(Long id, MentorRequest request);
    void delete(Long id);
    MentorResponse setVisible(Long id, boolean visible);
}
