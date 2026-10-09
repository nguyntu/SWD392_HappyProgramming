package com.happyprogramming.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class AiChatRequest {

    @NotBlank(message = "Tin nhắn không được để trống")
    @Size(max = 2000, message = "Tin nhắn không quá 2000 ký tự")
    private String message;

    /** Lịch sử hội thoại (tùy chọn) - mỗi phần tử có role & content */
    private List<ChatHistory> history;

    @Data
    public static class ChatHistory {
        private String role;    // "user" hoặc "model"
        private String content;
    }
}
