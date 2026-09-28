import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import MentorManagement from './pages/MentorManagement'

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#admin' ? 'admin' : 'home'
  })

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
    setCurrentPage(page)
    window.location.hash = page === 'admin' ? '#admin' : '#home'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {currentPage === 'admin' ? (
        <MentorManagement onNavigateToHome={() => navigateTo('home')} />
      ) : (
        <HomePage onNavigateToAdmin={() => navigateTo('admin')} />
      )}
    </>
  )
}
