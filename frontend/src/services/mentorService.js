import { getAuthHeaders } from './authService'

const BASE_URL = 'http://localhost:8081/api/mentors'

export async function getMentors(keyword = '', visible = '') {
  const params = new URLSearchParams()
  if (keyword) params.set('keyword', keyword)
  if (visible !== '') params.set('visible', visible)
  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('Cannot load mentors')
  return res.json()
}

export async function getMentorById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('Cannot load mentor details')
  return res.json()
}

export async function createMentor(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || 'Create failed')
  return body
}

export async function updateMentor(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || 'Update failed')
  return body
}

export async function deleteMentor(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || 'Delete failed')
  }
}

export async function setMentorVisibility(id, visible) {
  const res = await fetch(`${BASE_URL}/${id}/visibility?visible=${visible}`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || 'Visibility update failed')
  }
  return res.json()
}
