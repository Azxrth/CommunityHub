import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await login({ login: data.login, password: data.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '420px' }} className="p-4 mt-5 shadow-sm">
        <h2 className="mb-4 text-center">Connexion</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Pseudo ou email</Form.Label>
            <Form.Control
              {...register('login', { required: 'Champ requis' })}
              isInvalid={!!errors.login}
              placeholder="Votre pseudo ou email"
            />
            <Form.Control.Feedback type="invalid">{errors.login?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              {...register('password', { required: 'Mot de passe requis' })}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </Card>
    </div>
  )
}
