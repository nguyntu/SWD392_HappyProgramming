import { Modal, Button, Badge } from 'react-bootstrap'

export default function UserProfileModal({ show, onHide, user, onLogout }) {
  if (!user) return null

  function getRoleBadge(role) {
    switch (role) {
      case 'ROLE_ADMIN':
        return <Badge bg="danger" className="px-3 py-2 rounded-pill">Quản Trị Viên (Admin)</Badge>
      case 'ROLE_MENTOR':
        return <Badge bg="info" className="px-3 py-2 rounded-pill text-dark">Mentor</Badge>
      default:
        return <Badge bg="success" className="px-3 py-2 rounded-pill">Học Viên</Badge>
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered className="user-profile-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <h5 className="modal-title fw-bold">Thông Tin Tài Khoản</h5>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <div className="text-center my-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold shadow-sm mb-2"
            style={{
              width: '72px',
              height: '72px',
              fontSize: '1.8rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
            }}
          >
            {user.fullName ? user.fullName.substring(0, 1).toUpperCase() : 'U'}
          </div>
          <h5 className="fw-bold mb-1">{user.fullName}</h5>
          <div className="text-muted small mb-2">@{user.username}</div>
          <div>{getRoleBadge(user.role)}</div>
        </div>

        <div className="list-group list-group-flush rounded-3 border mt-3">
          <div className="list-group-item d-flex justify-content-between align-items-center py-2">
            <span className="text-muted small"><i className="bi bi-envelope me-2"></i>Email</span>
            <span className="fw-semibold small">{user.email}</span>
          </div>
          <div className="list-group-item d-flex justify-content-between align-items-center py-2">
            <span className="text-muted small"><i className="bi bi-telephone me-2"></i>Số điện thoại</span>
            <span className="fw-semibold small">{user.phone || 'Chưa cập nhật'}</span>
          </div>
          <div className="list-group-item d-flex justify-content-between align-items-center py-2">
            <span className="text-muted small"><i className="bi bi-shield-check me-2"></i>Quyền hạn</span>
            <span className="fw-semibold small">{user.role}</span>
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <Button variant="outline-secondary" className="flex-grow-1 rounded-pill" onClick={onHide}>
            Đóng
          </Button>
          <Button
            variant="outline-danger"
            className="rounded-pill d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              onLogout()
              onHide()
            }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Đăng xuất</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
