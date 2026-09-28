const BASE_URL = 'http://localhost:8081/api/mentors'

export async function getMentors(keyword = '', visible = '') {
  const params = new URLSearchParams()
  if (keyword) params.set('keyword', keyword)
  if (visible !== '') params.set('visible', visible)
  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) throw new Error('Cannot load mentors')
  return res.json()
}

export async function getMentorById(id) {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Cannot load mentor details')
  return res.json()
}

export async function createMentor(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || 'Create failed')
  return body
}

export async function updateMentor(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || 'Update failed')
  return body
}

export async function deleteMentor(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {method: 'DELETE'})
  if (!res.ok) throw new Error('Delete failed')
}

export async function setMentorVisibility(id, visible) {
  const res = await fetch(`${BASE_URL}/${id}/visibility?visible=${visible}`, {method: 'PATCH'})
  if (!res.ok) throw new Error('Visibility update failed')
  return res.json()
}
