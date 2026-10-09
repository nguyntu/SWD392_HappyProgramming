const AI_BASE_URL = 'http://localhost:8081/api/ai'

/**
 * Gửi tin nhắn đến AI agent và nhận phản hồi
 * @param {string} message - Tin nhắn của người dùng
 * @param {Array} history - Lịch sử hội thoại [{role, content}]
 * @returns {Promise<{reply: string, success: boolean, error: string}>}
 */
export async function sendMessageToAI(message, history = []) {
  const response = await fetch(`${AI_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || `Lỗi ${response.status}`)
  }

  return response.json()
}
