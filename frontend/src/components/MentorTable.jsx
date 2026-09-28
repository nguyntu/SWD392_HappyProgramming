import { useState } from 'react'
import { Table, Modal, Button, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap'

// Function to generate consistent avatar background colors from name
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

export default function MentorTable({ mentors, onEdit, onDelete, onToggle }) {
  const [viewingMentor, setViewingMentor] = useState(null)
  const [deletingMentor, setDeletingMentor] = useState(null)

  function confirmDelete() {
    if (deletingMentor) {
      onDelete(deletingMentor.id)
      setDeletingMentor(null)
    }
  }

  if (!mentors || mentors.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-people"></i>
          </div>
          <h5 className="fw-bold text-dark mb-2">Không tìm thấy Mentor nào</h5>
          <p className="text-muted small mb-0">
            Hãy thử tìm kiếm với từ khóa khác hoặc nhấn <strong>"+ Thêm Mentor"</strong> để tạo mới.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="table-container">
        <div className="table-responsive">
          <Table hover className="modern-table align-middle">
            <thead>
              <tr>
                <th style={{ width: '60px' }} className="text-center">ID</th>
                <th>Thông Tin Mentor</th>
                <th>Liên Hệ</th>
                <th>Kỹ Năng Chuyên Môn</th>
                <th className="text-center" style={{ width: '130px' }}>Trạng Thái</th>
                <th className="text-end" style={{ width: '160px' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map(m => {
                const skills = m.skills
                  ? m.skills.split(',').map(s => s.trim()).filter(Boolean)
                  : []

                return (
                  <tr key={m.id}>
                    <td className="text-center fw-semibold text-muted font-monospace">
                      #{m.id}
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="mentor-avatar"
                          style={{ background: getAvatarGradient(m.fullName) }}
                        >
                          {getInitials(m.fullName)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{m.fullName}</div>
                          {m.phone ? (
                            <small className="text-muted d-flex align-items-center gap-1">
                              <i className="bi bi-telephone text-primary" style={{ fontSize: '0.75rem' }}></i>
                              {m.phone}
                            </small>
                          ) : (
                            <small className="text-muted fst-italic">Chưa có SĐT</small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-envelope-at text-muted"></i>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-decoration-none text-secondary fw-medium"
                        >
                          {m.email}
                        </a>
                      </div>
                    </td>

                    <td>
                      {skills.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {skills.map((skill, idx) => (
                            <span key={idx} className="skill-pill">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted small fst-italic">Chưa cập nhật</span>
                      )}
                    </td>

                    <td className="text-center">
                      <span className={`status-pill ${m.visible ? 'status-visible' : 'status-hidden'}`}>
                        <span className="status-dot"></span>
                        {m.visible ? 'Hiển thị' : 'Đang ẩn'}
                      </span>
                    </td>

                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        {/* View Details */}
                        <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết & CV</Tooltip>}>
                          <button
                            id={`btn-view-${m.id}`}
                            className="action-btn action-btn-view"
                            onClick={() => setViewingMentor(m)}
                            aria-label="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </OverlayTrigger>

                        {/* Edit */}
                        <OverlayTrigger placement="top" overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                          <button
                            id={`btn-edit-${m.id}`}
                            className="action-btn action-btn-edit"
                            onClick={() => onEdit(m)}
                            aria-label="Edit Mentor"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </OverlayTrigger>

                        {/* Toggle visibility */}
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>{m.visible ? 'Ẩn Mentor này' : 'Hiện Mentor này'}</Tooltip>}
                        >
                          <button
                            id={`btn-toggle-${m.id}`}
                            className="action-btn action-btn-toggle"
                            onClick={() => onToggle(m)}
                            aria-label="Toggle Visibility"
                          >
                            <i className={`bi ${m.visible ? 'bi-eye-slash' : 'bi-check2-circle'}`}></i>
                          </button>
                        </OverlayTrigger>

                        {/* Delete */}
                        <OverlayTrigger placement="top" overlay={<Tooltip>Xóa Mentor</Tooltip>}>
                          <button
                            id={`btn-delete-${m.id}`}
                            className="action-btn action-btn-delete"
                            onClick={() => setDeletingMentor(m)}
                            aria-label="Delete Mentor"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal View Details */}
      {viewingMentor && (
        <Modal show={true} onHide={() => setViewingMentor(null)} centered size="md">
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fs-5 fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-file-earmark-person text-primary"></i>
              Hồ Sơ Mentor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-3 px-4">
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
              <div
                className="mentor-avatar"
                style={{
                  width: '54px',
                  height: '54px',
                  fontSize: '1.2rem',
                  background: getAvatarGradient(viewingMentor.fullName)
                }}
              >
                {getInitials(viewingMentor.fullName)}
              </div>
              <div>
                <h5 className="mb-0 fw-bold">{viewingMentor.fullName}</h5>
                <div className="small text-muted">{viewingMentor.email}</div>
                {viewingMentor.phone && (
                  <div className="small text-muted">
                    <i className="bi bi-telephone me-1"></i>
                    {viewingMentor.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-secondary small fw-bold mb-1 d-block">Trạng Thái:</label>
              <span className={`status-pill ${viewingMentor.visible ? 'status-visible' : 'status-hidden'}`}>
                <span className="status-dot"></span>
                {viewingMentor.visible ? 'Đang hiển thị công khai' : 'Đang tạm ẩn'}
              </span>
            </div>

            <div className="mb-3">
              <label className="text-secondary small fw-bold mb-1 d-block">Kỹ Năng:</label>
              {viewingMentor.skills ? (
                <div className="d-flex flex-wrap gap-1">
                  {viewingMentor.skills.split(',').map((s, idx) => (
                    <span key={idx} className="skill-pill">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted small fst-italic">Chưa có thông tin kỹ năng</span>
              )}
            </div>

            <div className="mb-2">
              <label className="text-secondary small fw-bold mb-1 d-block">Giới Thiệu / CV:</label>
              <div
                className="p-3 bg-light rounded-3 text-secondary small"
                style={{ whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}
              >
                {viewingMentor.cv || 'Chưa có thông tin giới thiệu tóm tắt.'}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" className="px-4" onClick={() => setViewingMentor(null)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMentor && (
        <Modal show={true} onHide={() => setDeletingMentor(null)} centered size="sm">
          <Modal.Body className="text-center p-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger mb-3"
              style={{ width: '60px', height: '60px', fontSize: '1.75rem' }}
            >
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">Xác nhận xóa Mentor?</h5>
            <p className="text-muted small mb-4">
              Bạn có chắc chắn muốn xóa mentor <strong>"{deletingMentor.fullName}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Button variant="light" className="border px-3" onClick={() => setDeletingMentor(null)}>
                Hủy
              </Button>
              <Button variant="danger" className="px-3" onClick={confirmDelete}>
                Xác nhận Xóa
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}
