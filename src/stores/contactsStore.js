import { create } from 'zustand'
import { apiFetch } from '../services/api'

const useContactsStore = create((set) => ({
  contacts: [],
  users: [],

  fetchContacts: async () => {
    const data = await apiFetch('/contacts/index.php')
    set({ contacts: data })
  },

  fetchUsers: async () => {
    const data = await apiFetch('/users/index.php')
    set({ users: data })
  },

  sendRequest: async (receiverId) => {
    return await apiFetch('/contacts/store.php', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId }),
    })
  },

  acceptContact: async (contactId) => {
    return await apiFetch('/contacts/accept.php', {
      method: 'POST',
      body: JSON.stringify({ contact_id: contactId }),
    })
  },
}))

export default useContactsStore
