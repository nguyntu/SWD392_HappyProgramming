import { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Badge,
  Modal,
  Spinner,
  Alert,
  Dropdown
} from 'react-bootstrap'
import { getMentors } from '../services/mentorService'
import UserProfileModal from '../components/UserProfileModal'

function getAvatarGradient(name = '') {
  const gradients = [
    'linear-gradient(135deg, #4f46e5, #7c3aed)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

function getInitials(name = '') {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const POPULAR_SKILLS = [
  'Tất cả',
  'Java',
  'Spring Boot',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'Docker',
  'DevOps'
]

export default function HomePage({ currentUser, onNavigateToAdmin, onOpenAuth, onLogout }) {
  const [mentors, setMentors] = useState([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('Tất cả')
  const [viewingMentor, setViewingMentor] = useState(null)
  const [contactMentor, setContactMentor] = useState(null)
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', skills: '', cv: '' })
  const [applySuccess, setApplySuccess] = useState(false)

  async function loadMentors() {
    setLoading(true)
    try {
      // In the public homepage, load only visible mentors
      const data = await getMentors(keyword, 'true')
      setMentors(data)
    } catch (err) {
      console.error('Failed to load mentors:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMentors()
  }, [])

  function handleSearchSubmit(e) {
    e?.preventDefault()
    loadMentors()
  }

  function handleSkillClick(skill) {
    setSelectedSkill(skill)
    if (skill === 'Tất cả') {
      setKeyword('')
      getMentors('', 'true').then(data => setMentors(data)).catch(() => {})
    } else {
      setKeyword(skill)
      getMentors(skill, 'true').then(data => setMentors(data)).catch(() => {})
    }
  }

  function handleBookingSubmit(e) {
    e.preventDefault()
    setBookingSuccess(`Cảm ơn bạn ${bookingForm.name}! Đã gửi yêu cầu kết nối tới Mentor ${contactMentor?.fullName}. Mentor sẽ phản hồi bạn qua email ${bookingForm.email} sớm nhất.`)
    setTimeout(() => {
      setBookingSuccess('')
      setContactMentor(null)
      setBookingForm({ name: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  function handleApplySubmit(e) {
    e.preventDefault()
    setApplySuccess(true)
    setTimeout(() => {
      setApplySuccess(false)
      setShowApplyModal(false)
      setApplyForm({ name: '', email: '', phone: '', skills: '', cv: '' })
    }, 3000)
  }

  // Filter in-memory if user chose a skill chip on existing list
  const displayedMentors = mentors.filter(m => {
    if (selectedSkill === 'Tất cả') return true
    if (!m.skills) return false
    return m.skills.toLowerCase().includes(selectedSkill.toLowerCase())
  })

  return (
    <div className="homepage-wrapper">
      {/* Navbar */}
      <nav className="app-navbar py-3 sticky-top">
        <Container>
          <div className="d-flex align-items-center justify-content-between">
            <a href="#hero" className="d-flex align-items-center gap-3 text-decoration-none">
              <div className="brand-icon-wrapper">
                <i className="bi bi-mortarboard-fill"></i>
              </div>
              <div>
                <h1 className="brand-title mb-0">Happy Programming</h1>
                <small className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>
                  Nền Tảng Cố Vấn Lập Trình 1-on-1
                </small>
              </div>
            </a>

            <div className="d-none d-lg-flex align-items-center gap-4">
              <a href="#hero" className="nav-link-custom active">Trang chủ</a>
              <a href="#mentors" className="nav-link-custom">Đội ngũ Mentor</a>
              <a href="#why-us" className="nav-link-custom">Lợi ích</a>
              <a href="#become-mentor" className="nav-link-custom">Trở thành Mentor</a>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                className="d-none d-xl-inline-flex align-items-center gap-2 rounded-pill px-3 shadow-sm border-2 fw-semibold"
                onClick={() => setShowApplyModal(true)}
              >
                <i className="bi bi-person-plus-fill"></i>
                <span>Gia nhập Mentor</span>
              </Button>

              {currentUser ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="button"
                    className="btn btn-light rounded-pill px-3 py-1 d-flex align-items-center gap-2 border shadow-sm"
                    id="dropdown-user-menu"
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: '28px',
                        height: '28px',
                        fontSize: '0.85rem',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                      }}
                    >
                      {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="fw-semibold text-dark small d-none d-sm-inline">{currentUser.fullName}</span>
                    <Badge
                      bg={currentUser.role === 'ROLE_ADMIN' ? 'danger' : currentUser.role === 'ROLE_MENTOR' ? 'info' : 'success'}
                      className="rounded-pill text-uppercase"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {currentUser.role === 'ROLE_ADMIN' ? 'Admin' : currentUser.role === 'ROLE_MENTOR' ? 'Mentor' : 'Học Viên'}
                    </Badge>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-lg border-0 rounded-3 mt-2 py-2">
                    <div className="px-3 py-2 border-bottom">
                      <div className="fw-bold text-dark small">{currentUser.fullName}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{currentUser.email}</div>
                    </div>
                    <Dropdown.Item onClick={() => setShowProfileModal(true)} className="d-flex align-items-center gap-2 py-2 small">
                      <i className="bi bi-person-circle text-primary"></i>
                      <span>Thông tin tài khoản</span>
                    </Dropdown.Item>
                    {currentUser.role === 'ROLE_ADMIN' && (
                      <Dropdown.Item onClick={onNavigateToAdmin} className="d-flex align-items-center gap-2 py-2 small text-danger fw-semibold">
                        <i className="bi bi-shield-lock-fill"></i>
                        <span>Quản trị hệ thống (Admin)</span>
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={onLogout} className="d-flex align-items-center gap-2 py-2 small text-danger">
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Đăng xuất</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    className="rounded-pill px-3 py-1 fw-semibold small shadow-sm d-flex align-items-center gap-1 border bg-white text-dark"
                    onClick={() => onOpenAuth('login')}
                    id="btn-login-header"
                  >
                    <i className="bi bi-box-arrow-in-right text-primary"></i>
                    <span>Đăng nhập</span>
                  </Button>
                  <Button
                    variant="primary"
                    className="rounded-pill px-3 py-1 fw-semibold small shadow-sm d-flex align-items-center gap-1"
                    onClick={() => onOpenAuth('register')}
                    id="btn-register-header"
                  >
                    <i className="bi bi-person-plus-fill"></i>
                    <span>Đăng ký</span>
                  </Button>
                </div>
              )}

              <Button
                className="btn-gradient-primary rounded-pill px-3 shadow-sm d-flex align-items-center gap-2"
                onClick={onNavigateToAdmin}
                id="btn-nav-admin"
              >
                <i className="bi bi-shield-lock-fill"></i>
                <span className="fw-semibold">Quản Lý Mentor (Admin)</span>
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section text-center position-relative py-5">
        <Container className="py-4">
          <div className="d-inline-flex align-items-center gap-2 badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill mb-3">
            <i className="bi bi-stars"></i>
            <span>Nền tảng kết nối Mentor & Lập trình viên hàng đầu</span>
          </div>

          <h1 className="hero-headline fw-bolder mb-3">
            Học Lập Trình Thảnh Thơi & Đột Phá <br className="d-none d-md-block" />
            Cùng <span className="gradient-text">Mentor Chuyên Nghiệp</span>
          </h1>

          <p className="hero-subheading text-muted mx-auto mb-4" style={{ maxWidth: '680px' }}>
            Kết nối trực tiếp 1-on-1 với các kỹ sư dày dặn kinh nghiệm trong ngành.
            Định hướng lộ trình học tập, giải đáp khúc mắc mã nguồn và nâng cao năng lực phỏng vấn tuyển dụng.
          </p>

          {/* Hero Search Box */}
          <div className="hero-search-container mx-auto mb-4">
            <Form onSubmit={handleSearchSubmit} className="d-flex align-items-center gap-2">
              <div className="position-relative flex-grow-1">
                <i className="bi bi-search hero-search-icon"></i>
                <Form.Control
                  id="hero-mentor-search"
                  type="text"
                  placeholder="Tìm mentor theo tên, kỹ năng (ví dụ: React, Java, Spring Boot, Python...)"
                  className="hero-search-input ps-5 py-3"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>
              <Button type="submit" className="btn-gradient-primary px-4 py-3 hero-search-btn">
                <span>Tìm kiếm</span>
              </Button>
            </Form>
          </div>

          {/* Quick Skill Tags */}
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-5">
            <small className="text-muted fw-bold me-1">Chủ đề phổ biến:</small>
            {POPULAR_SKILLS.map(skill => (
              <button
                key={skill}
                type="button"
                className={`skill-chip-btn ${selectedSkill === skill ? 'active' : ''}`}
                onClick={() => handleSkillClick(skill)}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <Row className="g-3 justify-content-center mt-2">
            <Col xs={6} md={3}>
              <div className="hero-stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Mentor Thực Chiến</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="hero-stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Hồ Sơ & CV Minh Bạch</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="hero-stat-card">
                <div className="stat-number">1-on-1</div>
                <div className="stat-label">Hỗ Trợ Tận Tâm</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="hero-stat-card">
                <div className="stat-number">4.9 / 5</div>
                <div className="stat-label">Độ Hài Lòng Học Viên</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-5 bg-white border-top border-bottom">
        <Container className="py-3">
          <div className="text-center mb-5">
            <span className="badge bg-indigo-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
              GIÁ TRỊ CỐT LÕI
            </span>
            <h2 className="section-title fw-bold">Tại Sao Nên Học Cùng Mentor Happy Programming?</h2>
            <p className="text-muted">Trải nghiệm phương pháp học tập lập trình thế hệ mới, tối ưu hóa thời gian và hiệu quả.</p>
          </div>

          <Row className="g-4">
            <Col xs={12} md={6} lg={3}>
              <div className="feature-card h-100">
                <div className="feature-icon bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-person-check-fill"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Mentor Tuyển Chọn</h5>
                <p className="text-muted small mb-0">
                  Đội ngũ chuyên gia có nhiều năm kinh nghiệm tại các công ty công nghệ lớn, sẵn sàng truyền đạt kiến thức thực tiễn.
                </p>
              </div>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <div className="feature-card h-100">
                <div className="feature-icon bg-success bg-opacity-10 text-success">
                  <i className="bi bi-file-earmark-person-fill"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Xem CV Công Khai</h5>
                <p className="text-muted small mb-0">
                  Học viên thoải mái tra cứu hồ sơ năng lực, bằng cấp, chứng chỉ và các dự án mentor từng thực hiện trước khi kết nối.
                </p>
              </div>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <div className="feature-card h-100">
                <div className="feature-icon bg-warning bg-opacity-10 text-warning">
                  <i className="bi bi-code-slash"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Code Review Chuẩn Mực</h5>
                <p className="text-muted small mb-0">
                  Mentor hướng dẫn viết code sạch, kiến trúc chuẩn, tối ưu thuật toán và giải thích cặn kẽ từng dòng lệnh.
                </p>
              </div>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <div className="feature-card h-100">
                <div className="feature-icon bg-danger bg-opacity-10 text-danger">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Đột Phá Nhanh Chóng</h5>
                <p className="text-muted small mb-0">
                  Tiết kiệm hàng trăm giờ tự mày mò bế tắc nhờ có người chỉ đường đúng đắn và định hướng lộ trình phù hợp với năng lực.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mentors Catalog Section */}
      <section id="mentors" className="py-5">
        <Container className="py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
                ĐỘI NGŨ CHUYÊN GIA
              </span>
              <h2 className="section-title fw-bold mb-1">Gặp Gỡ Đội Ngũ Mentor Của Chúng Tôi</h2>
              <p className="text-muted mb-0">
                Chọn người thầy đồng hành phù hợp với mục tiêu công nghệ của bạn.
              </p>
            </div>
            <div className="mt-3 mt-md-0 d-flex align-items-center gap-2">
              <span className="text-muted small fw-semibold">
                Hiển thị <strong>{displayedMentors.length}</strong> mentor
              </span>
              <Button
                variant="light"
                size="sm"
                className="border rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                onClick={loadMentors}
                disabled={loading}
              >
                <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
                <span>Làm mới</span>
              </Button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status" className="mb-3" />
              <p className="text-muted small">Đang tải danh sách Mentor chất lượng...</p>
            </div>
          ) : displayedMentors.length === 0 ? (
            <div className="empty-state bg-white rounded-4 border p-5 shadow-sm text-center">
              <div className="empty-icon">
                <i className="bi bi-search"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">Không tìm thấy Mentor phù hợp</h5>
              <p className="text-muted small mb-3">
                Thử tìm với từ khóa khác hoặc xóa bộ lọc kỹ năng để xem toàn bộ danh sách.
              </p>
              <Button
                variant="outline-primary"
                className="rounded-pill px-4"
                onClick={() => handleSkillClick('Tất cả')}
              >
                Xem tất cả Mentor
              </Button>
            </div>
          ) : (
            <Row className="g-4">
              {displayedMentors.map(m => {
                const skills = m.skills
                  ? m.skills.split(',').map(s => s.trim()).filter(Boolean)
                  : []

                return (
                  <Col key={m.id} xs={12} md={6} lg={4}>
                    <div className="mentor-public-card h-100 d-flex flex-column">
                      {/* Top Header Card */}
                      <div className="d-flex align-items-start gap-3 mb-3">
                        <div
                          className="mentor-avatar-lg shadow-sm"
                          style={{ background: getAvatarGradient(m.fullName) }}
                        >
                          {getInitials(m.fullName)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2">
                            <h5 className="fw-bold text-dark mb-0">{m.fullName}</h5>
                            <i className="bi bi-patch-check-fill text-primary" title="Đã xác thực"></i>
                          </div>
                          <div className="text-muted small mt-1">
                            <i className="bi bi-envelope me-1 text-primary"></i>
                            {m.email}
                          </div>
                          {m.phone && (
                            <div className="text-muted small">
                              <i className="bi bi-telephone me-1 text-success"></i>
                              {m.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Skills List */}
                      <div className="mb-3">
                        <small className="text-muted fw-bold d-block mb-1">Kỹ năng chuyên môn:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {skills.length > 0 ? (
                            skills.map((s, idx) => (
                              <span key={idx} className="badge bg-light text-dark border px-2 py-1">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted fst-italic small">Chưa cập nhật kỹ năng</span>
                          )}
                        </div>
                      </div>

                      {/* CV Snippet */}
                      <div className="cv-snippet-box mb-4 flex-grow-1">
                        <small className="text-muted d-block fw-semibold mb-1">
                          <i className="bi bi-file-text me-1"></i> Tóm tắt hồ sơ:
                        </small>
                        <p className="cv-snippet-text mb-0">
                          {m.cv
                            ? m.cv.length > 120
                              ? m.cv.substring(0, 120) + '...'
                              : m.cv
                            : 'Mentor chưa cập nhật hồ sơ chi tiết.'}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 pt-2 border-top">
                        <Button
                          variant="outline-primary"
                          className="w-50 rounded-pill fw-semibold btn-sm py-2 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => setViewingMentor(m)}
                        >
                          <i className="bi bi-file-earmark-person"></i>
                          <span>Xem CV</span>
                        </Button>
                        <Button
                          className="w-50 btn-gradient-primary rounded-pill fw-semibold btn-sm py-2 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => setContactMentor(m)}
                        >
                          <i className="bi bi-chat-dots-fill"></i>
                          <span>Kết Nối</span>
                        </Button>
                      </div>
                    </div>
                  </Col>
                )
              })}
            </Row>
          )}
        </Container>
      </section>

      {/* Become a Mentor CTA Section */}
      <section id="become-mentor" className="py-5 bg-gradient-cta text-white position-relative">
        <Container className="py-4">
          <Row className="align-items-center">
            <Col xs={12} lg={8} className="mb-4 mb-lg-0">
              <span className="badge bg-white text-primary px-3 py-2 rounded-pill fw-bold mb-3">
                CƠ HỘI ĐỒNG HÀNH
              </span>
              <h2 className="display-6 fw-bold mb-3">Bạn Có Chuyên Môn & Đam Mê Chia Sẻ Kiến Thức?</h2>
              <p className="lead mb-0 text-white-50" style={{ maxWidth: '650px' }}>
                Hãy gia nhập mạng lưới Mentor tại Happy Programming để truyền cảm hứng, rèn giũa thế hệ kỹ sư tương lai và mở rộng thương hiệu cá nhân của bạn.
              </p>
            </Col>
            <Col xs={12} lg={4} className="text-lg-end">
              <Button
                variant="light"
                size="lg"
                className="px-4 py-3 rounded-pill fw-bold text-primary shadow-lg d-inline-flex align-items-center gap-2 hover-lift"
                onClick={() => setShowApplyModal(true)}
              >
                <i className="bi bi-rocket-takeoff-fill"></i>
                <span>Đăng Ký Làm Mentor</span>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer-section py-5 bg-dark text-white-50">
        <Container>
          <Row className="g-4">
            <Col xs={12} md={5}>
              <div className="d-flex align-items-center gap-2 text-white mb-3">
                <div className="brand-icon-wrapper" style={{ width: 36, height: 36, fontSize: '1.1rem' }}>
                  <i className="bi bi-mortarboard-fill"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">Happy Programming</h5>
              </div>
              <p className="small mb-3" style={{ maxWidth: '380px' }}>
                Hệ thống kết nối lập trình viên và người hướng dẫn học tập trực tuyến 1-on-1 theo chuẩn công nghiệp, giúp học viên tiến bộ nhanh chóng và yêu thích lập trình.
              </p>
              <div className="d-flex gap-2">
                <span className="social-circle"><i className="bi bi-github"></i></span>
                <span className="social-circle"><i className="bi bi-facebook"></i></span>
                <span className="social-circle"><i className="bi bi-linkedin"></i></span>
                <span className="social-circle"><i className="bi bi-youtube"></i></span>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <h6 className="text-white fw-bold mb-3">Điều hướng</h6>
              <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                <li><a href="#hero" className="text-white-50 text-decoration-none hover-white">Trang chủ</a></li>
                <li><a href="#mentors" className="text-white-50 text-decoration-none hover-white">Đội ngũ Mentor</a></li>
                <li><a href="#why-us" className="text-white-50 text-decoration-none hover-white">Lợi ích học 1-on-1</a></li>
                <li><a href="#become-mentor" className="text-white-50 text-decoration-none hover-white">Trở thành Mentor</a></li>
                <li>
                  <a href="#admin" onClick={onNavigateToAdmin} className="text-primary fw-semibold text-decoration-none">
                    Quản trị viên (Admin Portal)
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={6} md={4}>
              <h6 className="text-white fw-bold mb-3">Liên hệ</h6>
              <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                <li><i className="bi bi-geo-alt me-2 text-primary"></i>Khu Công Nghệ Cao Hòa Lạc, Hà Nội</li>
                <li><i className="bi bi-envelope me-2 text-primary"></i>contact@happyprogramming.edu.vn</li>
                <li><i className="bi bi-telephone me-2 text-primary"></i>0987.654.321</li>
                <li><i className="bi bi-clock me-2 text-primary"></i>Thứ 2 - Chủ Nhật: 08:00 - 22:00</li>
              </ul>
            </Col>
          </Row>

          <hr className="my-4 border-secondary opacity-25" />

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small">
            <div>&copy; 2026 Happy Programming Platform. All rights reserved.</div>
            <div className="text-white-50 mt-2 mt-sm-0">
              Thiết kế theo chuẩn kiến trúc Spring Boot & React
            </div>
          </div>
        </Container>
      </footer>

      {/* CV Detail Modal */}
      <Modal
        show={viewingMentor !== null}
        onHide={() => setViewingMentor(null)}
        size="lg"
        centered
        className="mentor-cv-modal"
      >
        {viewingMentor && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
                <i className="bi bi-file-earmark-person-fill text-primary"></i>
                Hồ Sơ Năng Lực Chi Tiết
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
              {/* Profile Card inside modal */}
              <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 p-3 bg-light rounded-4 mb-4">
                <div
                  className="mentor-avatar-lg"
                  style={{ background: getAvatarGradient(viewingMentor.fullName) }}
                >
                  {getInitials(viewingMentor.fullName)}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2">
                    <h4 className="fw-bold text-dark mb-0">{viewingMentor.fullName}</h4>
                    <Badge bg="success" pill className="d-inline-flex align-items-center gap-1">
                      <i className="bi bi-check2-circle"></i> Đang nhận học viên
                    </Badge>
                  </div>
                  <div className="text-muted small mt-1 d-flex flex-wrap gap-3">
                    <span>
                      <i className="bi bi-envelope text-primary me-1"></i>
                      {viewingMentor.email}
                    </span>
                    {viewingMentor.phone && (
                      <span>
                        <i className="bi bi-telephone text-success me-1"></i>
                        {viewingMentor.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Box */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-award-fill text-warning"></i>
                  Kỹ Năng & Công Nghệ Sở Trường
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {viewingMentor.skills ? (
                    viewingMentor.skills.split(',').map((s, idx) => (
                      <Badge
                        key={idx}
                        bg="primary-subtle"
                        text="primary"
                        className="px-3 py-2 fs-6 rounded-pill border border-primary-subtle fw-medium"
                      >
                        {s.trim()}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted fst-italic">Chưa có thông tin kỹ năng</span>
                  )}
                </div>
              </div>

              {/* Full CV Content */}
              <div>
                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-briefcase-fill text-primary"></i>
                  Hồ Sơ Năng Lực & Kinh Nghiệm Thực Tế (CV)
                </h6>
                <div className="cv-full-content-box p-3 rounded-3 bg-white border">
                  {viewingMentor.cv ? (
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                      {viewingMentor.cv}
                    </div>
                  ) : (
                    <p className="text-muted fst-italic mb-0">
                      Chưa có nội dung CV chi tiết cho Mentor này.
                    </p>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
              <Button variant="light" className="rounded-pill px-4" onClick={() => setViewingMentor(null)}>
                Đóng
              </Button>
              <Button
                className="btn-gradient-primary rounded-pill px-4"
                onClick={() => {
                  const m = viewingMentor
                  setViewingMentor(null)
                  setContactMentor(m)
                }}
              >
                <i className="bi bi-calendar-check me-2"></i>
                Đăng Ký Học Cùng Mentor
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Contact / Connect Modal */}
      <Modal
        show={contactMentor !== null}
        onHide={() => {
          setContactMentor(null)
          setBookingSuccess('')
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            Kết Nối & Đặt Lịch Cùng Mentor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingSuccess ? (
            <Alert variant="success" className="mb-0">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i>
              {bookingSuccess}
            </Alert>
          ) : (
            <>
              {contactMentor && (
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
                  <div
                    className="mentor-avatar"
                    style={{ background: getAvatarGradient(contactMentor.fullName) }}
                  >
                    {getInitials(contactMentor.fullName)}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{contactMentor.fullName}</h6>
                    <small className="text-muted">{contactMentor.skills || 'Mentor Lập Trình'}</small>
                  </div>
                </div>
              )}

              <Form onSubmit={handleBookingSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Họ và tên của bạn</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={bookingForm.name}
                    onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Email nhận phản hồi</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={bookingForm.email}
                    onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Số điện thoại / Zalo</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="0912345678"
                    value={bookingForm.phone}
                    onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">Nội dung / Chủ đề bạn muốn được Mentor hỗ trợ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ví dụ: Cần mentor hướng dẫn đồ án Spring Boot + React, review code hoặc định hướng phỏng vấn..."
                    value={bookingForm.message}
                    onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })}
                  />
                </Form.Group>

                <Button type="submit" className="w-100 btn-gradient-primary rounded-pill py-2 fw-semibold">
                  Gửi Yêu Cầu Kết Nối
                </Button>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Become Mentor Modal */}
      <Modal
        show={showApplyModal}
        onHide={() => setShowApplyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            Ứng Tuyển Gia Nhập Mạng Lưới Mentor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {applySuccess ? (
            <Alert variant="success" className="mb-0">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i>
              Đã gửi thông tin ứng tuyển thành công! Ban điều phối Happy Programming sẽ liên hệ với bạn trong vòng 24h.
            </Alert>
          ) : (
            <Form onSubmit={handleApplySubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Họ tên của bạn"
                  value={applyForm.name}
                  onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  placeholder="mentor@example.com"
                  value={applyForm.email}
                  onChange={e => setApplyForm({ ...applyForm, email: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="0988776655"
                  value={applyForm.phone}
                  onChange={e => setApplyForm({ ...applyForm, phone: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Kỹ năng công nghệ sở trường</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Java, Spring Boot, React, AWS, Docker..."
                  value={applyForm.skills}
                  onChange={e => setApplyForm({ ...applyForm, skills: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold">Tóm tắt kinh nghiệm / Link LinkedIn / GitHub</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="3 năm Senior Java Backend tại..., kinh nghiệm mentoring..."
                  value={applyForm.cv}
                  onChange={e => setApplyForm({ ...applyForm, cv: e.target.value })}
                />
              </Form.Group>

              <Button type="submit" className="w-100 btn-gradient-primary rounded-pill py-2 fw-semibold">
                Nộp Hồ Sơ Mentor
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <UserProfileModal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        user={currentUser}
        onLogout={onLogout}
      />
    </div>
  )
}
