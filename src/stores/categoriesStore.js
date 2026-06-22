import { create } from 'zustand'
import { apiFetch } from '../services/api'

const useCategoriesStore = create((set) => ({
  categories: [],

  fetchCategories: async () => {
    const data = await apiFetch('/categories/index.php')
    set({ categories: data })
  },

  createCategory: async (data) => {
    return await apiFetch('/categories/store.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}))

export default useCategoriesStore
