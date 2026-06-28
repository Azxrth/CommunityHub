import { describe, it, expect } from 'vitest'
import reducer, { clearContactMessages, sendContactRequest } from './contactSlice'

const initialState = {
  status: 'idle',
  error: null,
  successMessage: null,
}

describe('contactSlice', () => {
  it('clearContactMessages() vide error', () => {
    const state = { ...initialState, error: 'une erreur réseau' }
    const next = reducer(state, clearContactMessages())
    expect(next.error).toBeNull()
  })

  it('clearContactMessages() vide successMessage', () => {
    const state = { ...initialState, successMessage: 'Message envoyé avec succès' }
    const next = reducer(state, clearContactMessages())
    expect(next.successMessage).toBeNull()
  })

  it('sendContactRequest.fulfilled met status à "succeeded"', () => {
    const action = { type: sendContactRequest.fulfilled.type, payload: {} }
    const next = reducer(initialState, action)
    expect(next.status).toBe('succeeded')
  })

  it('sendContactRequest.rejected met status à "failed"', () => {
    const action = {
      type: sendContactRequest.rejected.type,
      error: { message: 'Erreur serveur' },
    }
    const next = reducer(initialState, action)
    expect(next.status).toBe('failed')
  })
})
