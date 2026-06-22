import { create } from 'zustand'
import { apiFetch } from '../services/api'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  login: async (credentials) => {
    const res = await apiFetch('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    set({ user: res.user, token: res.token })
    return res
  },

  register: async (data) => {
    return await apiFetch('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout.php', { method: 'POST' })
    } catch (_) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

export default useAuthStore
