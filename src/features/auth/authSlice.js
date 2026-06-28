import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../../services/api'

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const res = await apiFetch('/auth/login.php', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  localStorage.setItem('token', res.token)
  localStorage.setItem('user', JSON.stringify(res.user))
  return res
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await apiFetch('/auth/logout.php', { method: 'POST' })
  } catch (_) {}
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch (_) {}
})

const authSlice = createSlice({
  name: 'auth',
  initialState: () => {
    try {
      return {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        status: 'idle',
        error: null,
      }
    } catch {
      return { user: null, token: null, status: 'idle', error: null }
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
      })
  },
})

export default authSlice.reducer
