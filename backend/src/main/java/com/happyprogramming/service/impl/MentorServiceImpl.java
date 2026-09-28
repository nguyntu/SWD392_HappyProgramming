package com.happyprogramming.service.impl;

import com.happyprogramming.dto.*;
import com.happyprogramming.entity.Mentor;
import com.happyprogramming.exception.*;
import com.happyprogramming.repository.MentorRepository;
import com.happyprogramming.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorServiceImpl implements MentorService {
    private final MentorRepository repository;

    public List<MentorResponse> getAll(String keyword, Boolean visible) {
        Specification<Mentor> spec = Specification.where(null);
        if (keyword != null && !keyword.isBlank()) {
            String k = "%" + keyword.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                cb.like(cb.lower(root.get("fullName")), k),
                cb.like(cb.lower(root.get("email")), k),
                cb.like(cb.lower(root.get("skills")), k)
            ));
        }
        if (visible != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("visible"), visible));
        }
        return repository.findAll(spec).stream().map(this::toResponse).toList();
    }

    public MentorResponse getById(Long id) {
        return toResponse(find(id));
    }

    public MentorResponse create(MentorRequest r) {
        if (repository.existsByEmail(r.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        Mentor m = new Mentor();
        apply(m, r);
        if (r.getVisible() == null) m.setVisible(true);
        return toResponse(repository.save(m));
    }

    public MentorResponse update(Long id, MentorRequest r) {
        Mentor m = find(id);
        if (repository.existsByEmailAndIdNot(r.getEmail(), id)) {
            throw new DuplicateResourceException("Email already exists");
        }
        apply(m, r);
        if (r.getVisible() != null) m.setVisible(r.getVisible());
        return toResponse(repository.save(m));
    }

    public void delete(Long id) {
        repository.delete(find(id));
    }

    public MentorResponse setVisible(Long id, boolean visible) {
        Mentor m = find(id);
        m.setVisible(visible);
        return toResponse(repository.save(m));
    }

    private Mentor find(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Mentor not found: " + id));
    }

    private void apply(Mentor m, MentorRequest r) {
        m.setFullName(r.getFullName());
        m.setEmail(r.getEmail());
        m.setPhone(r.getPhone());
        m.setSkills(r.getSkills());
        m.setCv(r.getCv());
    }

    private MentorResponse toResponse(Mentor m) {
        return MentorResponse.builder()
            .id(m.getId()).fullName(m.getFullName()).email(m.getEmail())
            .phone(m.getPhone()).skills(m.getSkills()).cv(m.getCv())
            .visible(m.getVisible()).build();
    }
}
