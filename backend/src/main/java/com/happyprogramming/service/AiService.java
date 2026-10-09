package com.happyprogramming.service;

import com.happyprogramming.dto.AiChatRequest;
import com.happyprogramming.dto.AiChatResponse;

public interface AiService {
    AiChatResponse chat(AiChatRequest request);
}
