const API_URL = import.meta.env.VITE_API_URL
const PROJECT_KEY = import.meta.env.VITE_PROJECT_KEY

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    'X-Project-Key': PROJECT_KEY,
    ...options.headers,
  }

  if (token) {
    headers['X-Auth-Token'] = token
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) throw await res.json()
  return res.json()
}
