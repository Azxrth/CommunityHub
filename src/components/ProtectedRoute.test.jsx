import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import ProtectedRoute from './ProtectedRoute'

function makeStore(token = null) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { user: null, token, status: 'idle', error: null },
    },
  })
}

describe('ProtectedRoute', () => {
  it('token absent : redirige vers /login', () => {
    render(
      <Provider store={makeStore(null)}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Contenu protégé</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Page Login</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Page Login')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
  })
})
