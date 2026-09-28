import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import MentorManagement from './pages/MentorManagement'
import AuthModal from './components/AuthModal'
import { getStoredUser, fetchCurrentUser, logout } from './services/authService'

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#admin' ? 'admin' : 'home'
  })
  const [currentUser, setCurrentUser] = useState(() => getStoredUser())
  const [authModal, setAuthModal] = useState({
    show: false,
    tab: 'login',
    notice: '',
    redirectAfterLogin: null
  })

  useEffect(() => {
    fetchCurrentUser().then(user => {
      if (user) setCurrentUser(user)
    })
  }, [])

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash
      if (hash === '#admin') {
        setCurrentPage('admin')
      } else if (hash === '#home' || hash === '') {
        setCurrentPage('home')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function navigateTo(page) {
    if (page === 'admin') {
      if (!currentUser) {
        setAuthModal({
          show: true,
          tab: 'login',
          notice: 'Vui lòng đăng nhập với tài khoản Quản trị viên (Admin) để vào trang Quản lý Mentor.',
          redirectAfterLogin: 'admin'
        })
        return
      }
      if (currentUser.role !== 'ROLE_ADMIN') {
        setAuthModal({
          show: true,
          tab: 'login',
          notice: `Tài khoản "@${currentUser.username}" (${currentUser.role}) không có quyền Quản trị viên. Hãy đăng nhập tài khoản Admin (ví dụ: admin / admin123).`,
          redirectAfterLogin: 'admin'
        })
        return
      }
    }

    setCurrentPage(page)
    window.location.hash = page === 'admin' ? '#admin' : '#home'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openAuth(tab = 'login', notice = '', redirect = null) {
    setAuthModal({
      show: true,
      tab,
      notice,
      redirectAfterLogin: redirect
    })
  }

  function handleLoginSuccess(user) {
    setCurrentUser(user)
    if (authModal.redirectAfterLogin === 'admin' && user.role === 'ROLE_ADMIN') {
      navigateTo('admin')
    }
  }

  async function handleLogout() {
    await logout()
    setCurrentUser(null)
    if (currentPage === 'admin') {
      navigateTo('home')
    }
  }

  return (
    <>
      {currentPage === 'admin' ? (
        <MentorManagement
          currentUser={currentUser}
          onNavigateToHome={() => navigateTo('home')}
          onLogout={handleLogout}
          onRequireLogin={() => openAuth('login', 'Vui lòng đăng nhập lại tài khoản Admin', 'admin')}
        />
      ) : (
        <HomePage
          currentUser={currentUser}
          onNavigateToAdmin={() => navigateTo('admin')}
          onOpenAuth={openAuth}
          onLogout={handleLogout}
        />
      )}

      <AuthModal
        show={authModal.show}
        initialTab={authModal.tab}
        customNotice={authModal.notice}
        onHide={() => setAuthModal(prev => ({ ...prev, show: false }))}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}
