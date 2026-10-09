package com.happyprogramming.controller;

import com.happyprogramming.dto.AiChatRequest;
import com.happyprogramming.dto.AiChatResponse;
import com.happyprogramming.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    /**
     * POST /api/ai/chat
     * Endpoint nhận tin nhắn từ người dùng và trả về phản hồi từ Gemini AI.
     * Không yêu cầu xác thực (cho phép guest dùng chatbot).
     */
    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiService.chat(request);
        return ResponseEntity.ok(response);
    }
}
