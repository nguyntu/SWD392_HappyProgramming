package com.happyprogramming.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiChatResponse {
    private String reply;
    private boolean success;
    private String error;

    public static AiChatResponse ok(String reply) {
        return new AiChatResponse(reply, true, null);
    }

    public static AiChatResponse fail(String error) {
        return new AiChatResponse(null, false, error);
    }
}
