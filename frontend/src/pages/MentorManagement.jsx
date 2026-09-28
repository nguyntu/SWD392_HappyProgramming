import { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import MentorForm from '../components/MentorForm'
import MentorTable from '../components/MentorTable'
import {
  getMentors,
  createMentor,
  updateMentor,
  deleteMentor,
  setMentorVisibility
} from '../services/mentorService'

export default function MentorManagement({ currentUser, onNavigateToHome, onLogout, onRequireLogin }) {
  const [mentors, setMentors] = useState([])
  const [editing, setEditing] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [visible, setVisible] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState(null) // { type: 'success' | 'danger', message: '' }

  function showAlert(message, type = 'success') {
    setAlert({ message, type })
    setTimeout(() => {
      setAlert(null)
    }, 4000)
  }

  async function loadData() {
    setLoading(true)
    try {
      const data = await getMentors(keyword, visible)
      setMentors(data)
    } catch (e) {
      showAlert(e.message || 'Không thể tải danh sách Mentor', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSave(data) {
    setSubmitting(true)
    try {
      if (editing && editing.id) {
        await updateMentor(editing.id, data)
        showAlert(`Đã cập nhật mentor "${data.fullName}" thành công!`, 'success')
      } else {
        await createMentor(data)
        showAlert(`Đã thêm mentor "${data.fullName}" thành công!`, 'success')
      }
      setEditing(null)
      await loadData()
    } catch (e) {
      showAlert(e.message || 'Thao tác không thành công', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(id) {
    try {
      await deleteMentor(id)
      showAlert('Đã xóa mentor khỏi hệ thống.', 'success')
      await loadData()
    } catch (e) {
      showAlert(e.message || 'Xóa mentor thất bại', 'danger')
    }
  }

  async function handleToggle(m) {
    try {
      const updatedStatus = !m.visible
      await setMentorVisibility(m.id, updatedStatus)
      showAlert(
        `Đã ${updatedStatus ? 'hiển thị' : 'tạm ẩn'} mentor "${m.fullName}".`,
        'success'
      )
      await loadData()
    } catch (e) {
      showAlert(e.message || 'Không thể cập nhật trạng thái', 'danger')
    }
  }

  function handleResetFilter() {
    setKeyword('')
    setVisible('')
    // Trigger reload with blank params
    getMentors('', '').then(data => setMentors(data)).catch(() => {})
  }

  // Quick statistics calculation
  const totalCount = mentors.length
  const visibleCount = mentors.filter(m => m.visible).length
  const hiddenCount = totalCount - visibleCount

  return (
    <div className="app-wrapper">
      {/* Sticky Modern Navbar */}
      <nav className="app-navbar py-3">
        <Container>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="brand-icon-wrapper" style={{ cursor: onNavigateToHome ? 'pointer' : 'default' }} onClick={onNavigateToHome}>
                <i className="bi bi-mortarboard-fill"></i>
              </div>
              <div>
                <h1 className="brand-title mb-0" style={{ cursor: onNavigateToHome ? 'pointer' : 'default' }} onClick={onNavigateToHome}>
                  Happy Programming
                </h1>
                <small className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>
                  Hệ Thống Quản Lý Người Hướng Dẫn (Mentor Management)
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {onNavigateToHome && (
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-2 fw-semibold"
                  onClick={onNavigateToHome}
                  id="btn-back-home"
                >
                  <i className="bi bi-house-door-fill"></i>
                  <span className="d-none d-sm-inline">Xem Trang Chủ</span>
                </Button>
              )}
              {currentUser && (
                <div className="d-flex align-items-center gap-2 bg-white border rounded-pill px-3 py-1 shadow-sm">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: '26px',
                      height: '26px',
                      fontSize: '0.8rem',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    }}
                  >
                    A
                  </div>
                  <span className="small fw-bold text-dark d-none d-md-inline">{currentUser.fullName}</span>
                  <span className="badge bg-danger rounded-pill">Admin</span>
                </div>
              )}
              <Button
                variant="light"
                className="border d-flex align-items-center gap-2 px-3 shadow-sm rounded-pill"
                onClick={loadData}
                disabled={loading}
                title="Tải lại dữ liệu"
              >
                <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
              </Button>
              {onLogout && (
                <Button
                  variant="outline-danger"
                  className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-1 small fw-semibold"
                  onClick={onLogout}
                  title="Đăng xuất"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-md-inline">Đăng xuất</span>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </nav>


      {/* Main Container */}
      <Container className="py-4">
        {/* Floating Alert Notification */}
        {alert && (
          <Alert
            variant={alert.type}
            onClose={() => setAlert(null)}
            dismissible
            className="shadow-sm border-0 d-flex align-items-center gap-2"
          >
            <i
              className={`bi ${
                alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'
              } fs-5`}
            ></i>
            <div>{alert.message}</div>
          </Alert>
        )}

        {/* Stats Row */}
        <Row className="g-3 mb-4">
          <Col xs={12} sm={4}>
            <div className="stat-card card-primary d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Tổng Mentor</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark">{totalCount}</h3>
              </div>
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={4}>
            <div className="stat-card card-success d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Đang Hiển Thị</span>
                <h3 className="fw-bold mb-0 mt-1 text-success">{visibleCount}</h3>
              </div>
              <div className="stat-icon bg-success bg-opacity-10 text-success">
                <i className="bi bi-eye-fill"></i>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={4}>
            <div className="stat-card card-secondary d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Đang Tạm Ẩn</span>
                <h3 className="fw-bold mb-0 mt-1 text-secondary">{hiddenCount}</h3>
              </div>
              <div className="stat-icon bg-secondary bg-opacity-10 text-secondary">
                <i className="bi bi-eye-slash-fill"></i>
              </div>
            </div>
          </Col>
        </Row>

        {/* Toolbar Card */}
        <div className="toolbar-card mb-4">
          <Row className="g-3 align-items-center">
            {/* Search Input */}
            <Col xs={12} md={5}>
              <div className="search-input-group">
                <i className="bi bi-search search-icon-inside"></i>
                <Form.Control
                  id="search-mentor-input"
                  className="custom-input ps-5"
                  placeholder="Tìm theo tên, email, kỹ năng..."
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') loadData()
                  }}
                />
              </div>
            </Col>

            {/* Filter by Status */}
            <Col xs={6} md={3}>
              <Form.Select
                id="filter-visibility-select"
                className="custom-input"
                value={visible}
                onChange={e => setVisible(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Chỉ hiển thị (Visible)</option>
                <option value="false">Chỉ đang ẩn (Hidden)</option>
              </Form.Select>
            </Col>

            {/* Action Buttons */}
            <Col xs={6} md={4} className="d-flex justify-content-md-end gap-2">
              <Button
                variant="light"
                className="border custom-input d-flex align-items-center gap-1"
                onClick={loadData}
                disabled={loading}
              >
                <i className="bi bi-funnel"></i>
                Lọc
              </Button>

              {(keyword || visible !== '') && (
                <Button
                  variant="outline-secondary"
                  className="custom-input"
                  onClick={handleResetFilter}
                  title="Xóa bộ lọc"
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
              )}

              <Button
                id="btn-add-mentor"
                className="btn-gradient-primary ms-auto ms-md-0"
                onClick={() => setEditing({})}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Thêm Mentor</span>
              </Button>
            </Col>
          </Row>
        </div>

        {/* Loading Spinner or Mentor Table */}
        {loading ? (
          <div className="table-container text-center py-5">
            <Spinner animation="border" variant="primary" role="status" className="mb-3" />
            <p className="text-muted small mb-0">Đang đồng bộ dữ liệu Mentor...</p>
          </div>
        ) : (
          <MentorTable
            mentors={mentors}
            onEdit={m => setEditing(m)}
            onDelete={handleRemove}
            onToggle={handleToggle}
          />
        )}

        {/* Modal Mentor Form */}
        {editing !== null && (
          <MentorForm
            mentor={editing.id ? editing : null}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            isSubmitting={submitting}
          />
        )}
      </Container>
    </div>
  )
}
