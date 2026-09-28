import { useState } from 'react'
import { Modal, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap'
import { login, register } from '../services/authService'

export default function AuthModal({ show, onHide, onSuccess, initialTab = 'login', customNotice = '' }) {
  const [activeTab, setActiveTab] = useState(initialTab) // 'login' | 'register'
  
  // Login state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Register state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_USER'
  })
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')

  function handleQuickFill(username, password) {
    setLoginForm({ username, password })
    setLoginError('')
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setLoginError('')
    if (!loginForm.username.trim() || !loginForm.password) {
      setLoginError('Vui lòng nhập tên đăng nhập/email và mật khẩu.')
      return
    }

    setLoginLoading(true)
    try {
      const data = await login(loginForm.username.trim(), loginForm.password)
      if (onSuccess) onSuccess(data.user)
      onHide()
    } catch (err) {
      setLoginError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()
    setRegisterError('')
    setRegisterSuccess('')

    if (!registerForm.fullName.trim()) {
      setRegisterError('Vui lòng nhập họ và tên.')
      return
    }
    if (!registerForm.username.trim() || registerForm.username.length < 3) {
      setRegisterError('Tên đăng nhập phải có ít nhất 3 ký tự.')
      return
    }
    if (!registerForm.email.trim() || !registerForm.email.includes('@')) {
      setRegisterError('Vui lòng nhập địa chỉ email hợp lệ.')
      return
    }
    if (!registerForm.password || registerForm.password.length < 6) {
      setRegisterError('Mật khẩu phải có độ dài từ 6 ký tự trở lên.')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Mật khẩu xác nhận không khớp.')
      return
    }

    setRegisterLoading(true)
    try {
      const payload = {
        username: registerForm.username.trim(),
        email: registerForm.email.trim(),
        fullName: registerForm.fullName.trim(),
        phone: registerForm.phone.trim(),
        password: registerForm.password,
        role: registerForm.role
      }
      const data = await register(payload)
      setRegisterSuccess('Đăng ký thành công! Đang đăng nhập vào hệ thống...')
      setTimeout(() => {
        if (onSuccess) onSuccess(data.user)
        onHide()
      }, 1200)
    } catch (err) {
      setRegisterError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="auth-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="d-flex align-items-center gap-2">
          <div className="auth-brand-badge">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <div>
            <h5 className="modal-title fw-bold text-dark mb-0">
              {activeTab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
            </h5>
            <small className="text-muted">Cổng học tập &amp; cố vấn Happy Programming</small>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="pt-3 px-4 pb-4">
        {customNotice && (
          <Alert variant="warning" className="d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-3 rounded-3">
            <i className="bi bi-exclamation-triangle-fill fs-6 text-warning"></i>
            <div>{customNotice}</div>
          </Alert>
        )}

        {/* Tab switch buttons */}
        <div className="auth-tab-switch d-flex p-1 bg-light rounded-pill mb-4 border">
          <button
            type="button"
            className={`btn btn-sm rounded-pill flex-grow-1 fw-bold transition-all ${
              activeTab === 'login' ? 'btn-white shadow-sm text-primary' : 'text-muted'
            }`}
            onClick={() => {
              setActiveTab('login')
              setLoginError('')
            }}
          >
            <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill flex-grow-1 fw-bold transition-all ${
              activeTab === 'register' ? 'btn-white shadow-sm text-primary' : 'text-muted'
            }`}
            onClick={() => {
              setActiveTab('register')
              setRegisterError('')
            }}
          >
            <i className="bi bi-person-plus me-1"></i> Đăng ký
          </button>
        </div>

        {/* Tab: LOGIN */}
        {activeTab === 'login' && (
          <Form onSubmit={handleLoginSubmit}>
            {loginError && (
              <Alert variant="danger" className="py-2 px-3 small border-0 rounded-3 mb-3">
                <i className="bi bi-exclamation-circle-fill me-1"></i> {loginError}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">
                Tên đăng nhập hoặc Email <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-person"></i>
                </span>
                <Form.Control
                  type="text"
                  placeholder="admin, student1 hoặc email..."
                  className="border-start-0 ps-1"
                  value={loginForm.username}
                  onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                  autoFocus
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Form.Label className="small fw-bold text-secondary mb-0">
                  Mật khẩu <span className="text-danger">*</span>
                </Form.Label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-key"></i>
                </span>
                <Form.Control
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu..."
                  className="border-start-0 border-end-0 ps-1"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                <Button
                  variant="outline-secondary"
                  className="border-start-0 bg-white text-muted"
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  <i className={`bi ${showLoginPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </Button>
              </div>
            </Form.Group>

            {/* Quick Login test accounts */}
            <div className="quick-login-section p-2 rounded-3 bg-light border mb-3">
              <div className="small text-muted fw-semibold mb-1 d-flex align-items-center gap-1">
                <i className="bi bi-lightning-charge-fill text-warning"></i>
                <span>Tài khoản thử nghiệm sẵn có:</span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="btn-xs rounded-pill py-1 px-2"
                  onClick={() => handleQuickFill('admin', 'admin123')}
                >
                  <span className="badge bg-danger me-1">Admin</span> admin
                </Button>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="btn-xs rounded-pill py-1 px-2"
                  onClick={() => handleQuickFill('mentor1', '123456')}
                >
                  <span className="badge bg-info text-dark me-1">Mentor</span> mentor1
                </Button>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="btn-xs rounded-pill py-1 px-2"
                  onClick={() => handleQuickFill('student1', '123456')}
                >
                  <span className="badge bg-success me-1">Học viên</span> student1
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-100 btn-gradient-primary py-2 rounded-pill shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <Spinner size="sm" animation="border" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Đăng Nhập</span>
                </>
              )}
            </Button>
          </Form>
        )}

        {/* Tab: REGISTER */}
        {activeTab === 'register' && (
          <Form onSubmit={handleRegisterSubmit}>
            {registerError && (
              <Alert variant="danger" className="py-2 px-3 small border-0 rounded-3 mb-3">
                <i className="bi bi-exclamation-circle-fill me-1"></i> {registerError}
              </Alert>
            )}
            {registerSuccess && (
              <Alert variant="success" className="py-2 px-3 small border-0 rounded-3 mb-3">
                <i className="bi bi-check-circle-fill me-1"></i> {registerSuccess}
              </Alert>
            )}

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold text-secondary mb-1">
                Họ và tên <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={registerForm.fullName}
                onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
              />
            </Form.Group>

            <div className="row g-2 mb-2">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary mb-1">
                    Tên đăng nhập <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="nguyenvanan"
                    value={registerForm.username}
                    onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary mb-1">
                    Số điện thoại
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="0912345678"
                    value={registerForm.phone}
                    onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold text-secondary mb-1">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="an.nguyen@example.com"
                value={registerForm.email}
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold text-secondary mb-1">
                Vai trò mong muốn
              </Form.Label>
              <div className="d-flex gap-2">
                <div
                  className={`flex-grow-1 p-2 rounded-3 border text-center cursor-pointer transition-all ${
                    registerForm.role === 'ROLE_USER'
                      ? 'border-primary bg-primary-subtle text-primary fw-bold'
                      : 'border-light-subtle text-muted'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setRegisterForm({ ...registerForm, role: 'ROLE_USER' })}
                >
                  <i className="bi bi-mortarboard me-1"></i> Học viên
                </div>
                <div
                  className={`flex-grow-1 p-2 rounded-3 border text-center cursor-pointer transition-all ${
                    registerForm.role === 'ROLE_MENTOR'
                      ? 'border-primary bg-primary-subtle text-primary fw-bold'
                      : 'border-light-subtle text-muted'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setRegisterForm({ ...registerForm, role: 'ROLE_MENTOR' })}
                >
                  <i className="bi bi-person-workspace me-1"></i> Mentor
                </div>
              </div>
            </Form.Group>

            <div className="row g-2 mb-3">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary mb-1">
                    Mật khẩu <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showRegisterPassword ? 'text' : 'password'}
                      placeholder="Ít nhất 6 ký tự"
                      value={registerForm.password}
                      onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                    />
                    <Button
                      variant="outline-secondary"
                      className="border-start-0 bg-white text-muted px-2"
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      <i className={`bi ${showRegisterPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </div>
                </Form.Group>
              </div>
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary mb-1">
                    Xác nhận mật khẩu <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={registerForm.confirmPassword}
                    onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Button
              type="submit"
              className="w-100 btn-gradient-primary py-2 rounded-pill shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={registerLoading}
            >
              {registerLoading ? (
                <>
                  <Spinner size="sm" animation="border" />
                  <span>Đang xử lý đăng ký...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-person-check-fill"></i>
                  <span>Tạo Tài Khoản</span>
                </>
              )}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}
