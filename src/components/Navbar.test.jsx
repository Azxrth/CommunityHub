import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import Navbar from './Navbar'

function makeStore(user = null, token = null) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { user, token, status: 'idle', error: null },
    },
  })
}

const userConnecte = { pseudo: 'Jean', role: 'user', is_premium: false }
const userAdmin = { pseudo: 'Admin', role: 'admin', is_premium: false }

function renderNavbar(store) {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  )
}

describe('Navbar — Visiteur', () => {
  it('Connexion visible', () => {
    renderNavbar(makeStore(null, null))
    expect(screen.getByText('Connexion')).toBeInTheDocument()
  })

  it('Inscription visible', () => {
    renderNavbar(makeStore(null, null))
    expect(screen.getByText('Inscription')).toBeInTheDocument()
  })

  it('Profil absent', () => {
    renderNavbar(makeStore(null, null))
    expect(screen.queryByText('Profil')).not.toBeInTheDocument()
  })

  it('Administration absent', () => {
    renderNavbar(makeStore(null, null))
    expect(screen.queryByText('Administration')).not.toBeInTheDocument()
  })
})

describe('Navbar — Utilisateur connecté', () => {
  it('Profil visible', () => {
    renderNavbar(makeStore(userConnecte, 'token123'))
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('Déconnexion visible', () => {
    renderNavbar(makeStore(userConnecte, 'token123'))
    expect(screen.getByText('Déconnexion')).toBeInTheDocument()
  })

  it('Connexion absent', () => {
    renderNavbar(makeStore(userConnecte, 'token123'))
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument()
  })
})

describe('Navbar — Admin', () => {
  it('Administration visible', () => {
    renderNavbar(makeStore(userAdmin, 'admintoken'))
    expect(screen.getByText('Administration')).toBeInTheDocument()
  })
})

describe('Navbar — clic sur Déconnexion', () => {
  it('user devient null, token devient null, redirection vers /login', async () => {
    const store = makeStore(userConnecte, 'token123')
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Navbar />} />
            <Route path="/login" element={<div>Page Login</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    await user.click(screen.getByText('Déconnexion'))

    await waitFor(() => {
      expect(store.getState().auth.user).toBeNull()
      expect(store.getState().auth.token).toBeNull()
      expect(screen.getByText('Page Login')).toBeInTheDocument()
    })
  })
})
