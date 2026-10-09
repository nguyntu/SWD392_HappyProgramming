package com.happyprogramming.service.impl;

import com.happyprogramming.dto.AiChatRequest;
import com.happyprogramming.dto.AiChatResponse;
import com.happyprogramming.service.AiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AiServiceImpl implements AiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private static final String SYSTEM_PROMPT = """
            Bạn là trợ lý AI thông minh của nền tảng Happy Programming - nơi kết nối học viên với mentor lập trình.
            
            Vai trò của bạn:
            - Hỗ trợ học viên tìm hiểu về các kỹ năng lập trình (Java, Spring Boot, React, Node.js, Python, SQL, Docker, DevOps, v.v.)
            - Tư vấn học viên chọn mentor phù hợp với nhu cầu học tập
            - Trả lời câu hỏi về lập trình, công nghệ phần mềm
            - Hướng dẫn về quy trình đặt lịch học với mentor
            - Cung cấp lời khuyên về lộ trình học lập trình
            
            Nguyên tắc:
            - Luôn trả lời bằng tiếng Việt (trừ khi người dùng hỏi bằng tiếng Anh)
            - Thân thiện, nhiệt tình, chuyên nghiệp
            - Câu trả lời ngắn gọn, dễ hiểu, có thể dùng emoji để sinh động
            - Nếu câu hỏi không liên quan đến lập trình hoặc nền tảng, hãy khéo léo hướng về chủ đề chuyên môn
            - Không bịa đặt thông tin về mentor cụ thể mà hãy khuyến khích người dùng xem danh sách mentor trên trang
            """;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public AiChatResponse chat(AiChatRequest request) {
        try {
            String url = geminiApiUrl + "?key=" + geminiApiKey;

            // Build contents array with history + system context
            List<Map<String, Object>> contents = new ArrayList<>();

            // Add system instruction as first user message
            Map<String, Object> systemMsg = buildMessage("user", SYSTEM_PROMPT);
            Map<String, Object> systemAck = buildMessage("model", "Tôi hiểu. Tôi là trợ lý AI của Happy Programming, sẵn sàng hỗ trợ bạn! 🚀");
            contents.add(systemMsg);
            contents.add(systemAck);

            // Add conversation history
            if (request.getHistory() != null) {
                for (AiChatRequest.ChatHistory h : request.getHistory()) {
                    contents.add(buildMessage(h.getRole(), h.getContent()));
                }
            }

            // Add current user message
            contents.add(buildMessage("user", request.getMessage()));

            // Build request body
            Map<String, Object> body = new HashMap<>();
            body.put("contents", contents);

            // Generation config
            Map<String, Object> genConfig = new HashMap<>();
            genConfig.put("temperature", 0.8);
            genConfig.put("maxOutputTokens", 1024);
            genConfig.put("topP", 0.9);
            body.put("generationConfig", genConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String text = extractText(response.getBody());
                return AiChatResponse.ok(text);
            }

            return AiChatResponse.fail("Không nhận được phản hồi từ AI.");
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            return AiChatResponse.fail("Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.");
        }
    }

    private Map<String, Object> buildMessage(String role, String text) {
        Map<String, Object> part = new HashMap<>();
        part.put("text", text);

        Map<String, Object> message = new HashMap<>();
        message.put("role", role);
        message.put("parts", List.of(part));
        return message;
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> responseBody) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "Không có phản hồi.";

            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) return "Không có phản hồi.";

            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            log.warn("Could not extract text from Gemini response: {}", e.getMessage());
            return "Không thể đọc phản hồi từ AI.";
        }
    }
}
