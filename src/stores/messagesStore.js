import { create } from 'zustand'
import { apiFetch } from '../services/api'

const useMessagesStore = create((set) => ({
  received: [],
  sent: [],

  fetchReceived: async () => {
    const data = await apiFetch('/messages/index.php')
    set({ received: data })
  },

  fetchSent: async () => {
    const data = await apiFetch('/messages/index.php?type=sent')
    set({ sent: data })
  },

  sendMessage: async (data) => {
    return await apiFetch('/messages/send.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}))

export default useMessagesStore
