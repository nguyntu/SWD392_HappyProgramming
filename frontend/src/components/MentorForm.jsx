import { useEffect, useState } from 'react'
import { Modal, Form, Button, InputGroup, Row, Col, Badge } from 'react-bootstrap'

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  skills: '',
  cv: '',
  visible: true
}

export default function MentorForm({ mentor, onSubmit, onCancel, isSubmitting = false }) {
  const [form, setForm] = useState(emptyForm)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    setForm(mentor ? { ...mentor } : emptyForm)
    setValidated(false)
  }, [mentor])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formElement = e.currentTarget
    if (formElement.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }
    onSubmit(form)
  }

  // Parse comma separated skills for live badge preview
  const skillList = form.skills
    ? form.skills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return (
    <Modal show={true} onHide={onCancel} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center gap-2 fw-bold text-dark fs-5">
          <div className="stat-icon bg-primary bg-opacity-10 text-primary">
            <i className={`bi ${mentor ? 'bi-pencil-square' : 'bi-person-plus-fill'}`}></i>
          </div>
          <span>{mentor ? 'Chỉnh Sửa Mentor' : 'Thêm Mentor Mới'}</span>
        </Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="pt-3 px-4">
          <p className="text-muted small mb-4">
            {mentor
              ? 'Cập nhật thông tin chi tiết của người hướng dẫn (Mentor).'
              : 'Điền đầy đủ thông tin để thêm một Mentor mới vào hệ thống.'}
          </p>

          <Row className="g-3">
            <Col md={12}>
              <Form.Group controlId="mentorFullName">
                <Form.Label className="small fw-semibold text-secondary">
                  Họ và Tên <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light border-end-0 text-muted">
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    className="custom-input border-start-0 ps-0"
                    type="text"
                    name="fullName"
                    placeholder="VD: Nguyễn Văn A"
                    value={form.fullName || ''}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập họ và tên của mentor.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="mentorEmail">
                <Form.Label className="small fw-semibold text-secondary">
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light border-end-0 text-muted">
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    className="custom-input border-start-0 ps-0"
                    type="email"
                    name="email"
                    placeholder="mentor@example.com"
                    value={form.email || ''}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập định dạng email hợp lệ.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="mentorPhone">
                <Form.Label className="small fw-semibold text-secondary">Số Điện Thoại</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0 text-muted">
                    <i className="bi bi-telephone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    className="custom-input border-start-0 ps-0"
                    type="tel"
                    name="phone"
                    placeholder="VD: 0912345678"
                    value={form.phone || ''}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="mentorSkills">
                <Form.Label className="small fw-semibold text-secondary">
                  Kỹ Năng (Ngăn cách bằng dấu phẩy)
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0 text-muted">
                    <i className="bi bi-lightning-charge"></i>
                  </InputGroup.Text>
                  <Form.Control
                    className="custom-input border-start-0 ps-0"
                    type="text"
                    name="skills"
                    placeholder="Java, React, Spring Boot, MySQL..."
                    value={form.skills || ''}
                    onChange={handleChange}
                  />
                </InputGroup>
                {skillList.length > 0 && (
                  <div className="mt-2 d-flex flex-wrap gap-1 align-items-center">
                    <span className="small text-muted me-1">Preview:</span>
                    {skillList.map((skill, index) => (
                      <span key={index} className="skill-pill">
                        <i className="bi bi-check2 me-1"></i>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="mentorCV">
                <Form.Label className="small fw-semibold text-secondary">
                  Giới thiệu / CV Tóm Tắt
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="custom-input"
                  name="cv"
                  rows={4}
                  placeholder="Kinh nghiệm làm việc, học vấn, dự án tiêu biểu..."
                  value={form.cv || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold small text-dark">Trạng thái hiển thị</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Cho phép học viên nhìn thấy Mentor trên cổng thông tin
                  </div>
                </div>
                <Form.Check
                  type="switch"
                  id="mentorVisible"
                  name="visible"
                  checked={form.visible ?? true}
                  onChange={handleChange}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-0 px-4 pb-4">
          <Button
            variant="light"
            className="px-3 fw-semibold text-secondary border"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy Bỏ
          </Button>
          <Button
            type="submit"
            className="btn-gradient-primary px-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang lưu...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i>
                {mentor ? 'Cập Nhật' : 'Lưu Mentor'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
