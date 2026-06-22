import { create } from 'zustand'
import { apiFetch } from '../services/api'

const useSkillsStore = create((set) => ({
  skills: [],

  fetchSkills: async () => {
    const data = await apiFetch('/skills/index.php')
    set({ skills: data })
  },

  createSkill: async (data) => {
    return await apiFetch('/skills/store.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}))

export default useSkillsStore
