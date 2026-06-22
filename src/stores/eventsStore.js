import { create } from 'zustand'
import { apiFetch } from '../services/api'

const useEventsStore = create((set) => ({
  events: [],
  currentEvent: null,
  loading: false,
  error: null,

  fetchEvents: async (filters = {}) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams(filters).toString()
      const data = await apiFetch(`/events/index.php${params ? '?' + params : ''}`)
      set({ events: data })
    } catch (err) {
      set({ error: err.message || 'Erreur' })
    } finally {
      set({ loading: false })
    }
  },

  fetchEvent: async (id) => {
    set({ loading: true, error: null })
    try {
      const data = await apiFetch(`/events/show.php?id=${id}`)
      set({ currentEvent: data })
    } catch (err) {
      set({ error: err.message || 'Erreur' })
    } finally {
      set({ loading: false })
    }
  },

  createEvent: async (data) => {
    return await apiFetch('/events/store.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  registerToEvent: async (data) => {
    return await apiFetch('/events/register.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  addMessage: async (data) => {
    return await apiFetch('/events/message.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}))

export default useEventsStore
