import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../../services/api'

export const sendContactRequest = createAsyncThunk('contact/sendContactRequest', async (data) => {
  return await apiFetch('/contacts/store.php', {
    method: 'POST',
    body: JSON.stringify(data),
  })
})

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    status: 'idle',
    error: null,
    successMessage: null,
  },
  reducers: {
    clearContactMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactRequest.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(sendContactRequest.fulfilled, (state) => {
        state.status = 'succeeded'
        state.successMessage = 'Message envoyé avec succès'
        state.error = null
      })
      .addCase(sendContactRequest.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { clearContactMessages } = contactSlice.actions
export default contactSlice.reducer
