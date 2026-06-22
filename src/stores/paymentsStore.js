import { create } from 'zustand'
import { apiFetch } from '../services/api'

const usePaymentsStore = create((set) => ({
  payments: [],

  fetchPayments: async () => {
    const data = await apiFetch('/payments/index.php')
    set({ payments: data })
  },

  payPremium: async (data) => {
    return await apiFetch('/payments/premium.php', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}))

export default usePaymentsStore
