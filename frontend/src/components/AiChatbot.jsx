import { useState, useRef, useEffect } from 'react'
import { sendMessageToAI } from '../services/aiService'

// Tin nhắn gợi ý nhanh
const QUICK_SUGGESTIONS = [
  '🚀 Lộ trình học lập trình cho người mới?',
  '🔍 Tìm mentor Java phù hợp với tôi',
  '💡 Sự khác biệt giữa React và Vue?',
  '📚 Làm thế nào để học Spring Boot hiệu quả?'
]

const BOT_AVATAR = (
  <div style={{
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0
  }}>🤖</div>
)

const USER_AVATAR = (
  <div style={{
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, color: '#fff', fontWeight: 700, flexShrink: 0
  }}>U</div>
)

function TypingDots() {
  return (
    <div className="ai-typing-dots">
      <span /><span /><span />
    </div>
  )
}

function ChatMessage({ msg }) {
  const isBot = msg.role === 'model'
  return (
    <div className={`ai-chat-message ${isBot ? 'ai-bot' : 'ai-user'}`}>
      {isBot && BOT_AVATAR}
      <div className={`ai-bubble ${isBot ? 'ai-bubble-bot' : 'ai-bubble-user'}`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
      {!isBot && USER_AVATAR}
    </div>
  )
}

export default function AiChatbot({ currentUser }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: '👋 Xin chào! Tôi là trợ lý AI của **Happy Programming**.\n\nTôi có thể giúp bạn:\n• 🎯 Tìm mentor phù hợp\n• 💻 Tư vấn lộ trình học lập trình\n• ❓ Giải đáp câu hỏi về công nghệ\n\nBạn muốn hỏi gì không? 😊'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [hasNewMsg, setHasNewMsg] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatBodyRef = useRef(null)

  // Scroll to bottom when messages update
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [messages, loading, open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200)
      setHasNewMsg(false)
    }
  }, [open])

  // Build history for API (exclude the initial greeting)
  function buildHistory() {
    return messages.slice(1).map(m => ({ role: m.role, content: m.content }))
  }

  async function sendMessage(text) {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setShowSuggestions(false)

    const userMsg = { role: 'user', content: userText }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = buildHistory()
      const result = await sendMessageToAI(userText, history)

      const botMsg = {
        role: 'model',
        content: result.success
          ? result.reply
          : `⚠️ ${result.error || 'Có lỗi xảy ra. Vui lòng thử lại.'}`
      }
      setMessages(prev => [...prev, botMsg])

      if (!open) setHasNewMsg(true)
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'model', content: `⚠️ Không thể kết nối với AI. Vui lòng kiểm tra lại kết nối.\n\n_(${err.message})_` }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([{
      role: 'model',
      content: '👋 Xin chào! Tôi là trợ lý AI của **Happy Programming**.\n\nTôi có thể giúp bạn:\n• 🎯 Tìm mentor phù hợp\n• 💻 Tư vấn lộ trình học lập trình\n• ❓ Giải đáp câu hỏi về công nghệ\n\nBạn muốn hỏi gì không? 😊'
    }])
    setShowSuggestions(true)
    setInput('')
  }

  return (
    <>
      {/* Floating Button */}
      <button
        id="ai-chatbot-toggle"
        className={`ai-fab ${open ? 'ai-fab-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Trợ lý AI Happy Programming"
        aria-label="Mở chatbot AI"
      >
        <span className="ai-fab-icon">{open ? '✕' : '🤖'}</span>
        {!open && hasNewMsg && <span className="ai-fab-badge" />}
        {!open && (
          <span className="ai-fab-pulse" />
        )}
      </button>

      {/* Chat Window */}
      <div className={`ai-chat-window ${open ? 'ai-chat-window-open' : ''}`} role="dialog" aria-label="AI Chatbot">
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <div className="ai-header-avatar">🤖</div>
            <div>
              <div className="ai-header-title">AI Assistant</div>
              <div className="ai-header-subtitle">
                <span className="ai-online-dot" />
                Happy Programming Bot
              </div>
            </div>
          </div>
          <div className="ai-chat-header-actions">
            <button
              className="ai-icon-btn"
              onClick={clearChat}
              title="Làm mới cuộc trò chuyện"
              aria-label="Làm mới"
            >
              🔄
            </button>
            <button
              className="ai-icon-btn"
              onClick={() => setOpen(false)}
              title="Đóng"
              aria-label="Đóng chatbot"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-chat-body" ref={chatBodyRef}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="ai-chat-message ai-bot">
              {BOT_AVATAR}
              <div className="ai-bubble ai-bubble-bot">
                <TypingDots />
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          {showSuggestions && messages.length === 1 && !loading && (
            <div className="ai-suggestions">
              <p className="ai-suggestions-label">💡 Gợi ý câu hỏi:</p>
              {QUICK_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="ai-suggestion-btn"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="ai-chat-footer">
          <div className="ai-input-row">
            <textarea
              ref={inputRef}
              id="ai-chat-input"
              className="ai-input"
              placeholder="Nhập câu hỏi của bạn... (Enter để gửi)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
              aria-label="Nhập tin nhắn"
            />
            <button
              id="ai-send-btn"
              className={`ai-send-btn ${input.trim() && !loading ? 'ai-send-active' : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Gửi tin nhắn"
            >
              {loading ? (
                <span className="ai-send-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
          <p className="ai-footer-note">⚡ Powered by Google Gemini AI</p>
        </div>
      </div>
    </>
  )
}
