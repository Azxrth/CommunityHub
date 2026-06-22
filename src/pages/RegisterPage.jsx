import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const registerUser = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const { confirm_password, ...payload } = data
      await registerUser(payload)
      navigate('/login')
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center py-4">
      <Card style={{ width: '600px' }} className="p-4 shadow-sm">
        <h2 className="mb-4 text-center">Inscription</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Pseudo *</Form.Label>
                <Form.Control
                  {...register('pseudo', { required: 'Pseudo requis' })}
                  isInvalid={!!errors.pseudo}
                />
                <Form.Control.Feedback type="invalid">{errors.pseudo?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  {...register('email', { required: 'Email requis' })}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  {...register('firstname', { required: 'Prénom requis' })}
                  isInvalid={!!errors.firstname}
                />
                <Form.Control.Feedback type="invalid">{errors.firstname?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  {...register('lastname', { required: 'Nom requis' })}
                  isInvalid={!!errors.lastname}
                />
                <Form.Control.Feedback type="invalid">{errors.lastname?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mot de passe *</Form.Label>
                <Form.Control
                  type="password"
                  {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: 'Min 6 caractères' } })}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Confirmer le mot de passe *</Form.Label>
                <Form.Control
                  type="password"
                  {...register('confirm_password', {
                    required: 'Confirmation requise',
                    validate: v => v === watch('password') || 'Les mots de passe ne correspondent pas'
                  })}
                  isInvalid={!!errors.confirm_password}
                />
                <Form.Control.Feedback type="invalid">{errors.confirm_password?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date de naissance *</Form.Label>
                <Form.Control
                  type="date"
                  {...register('birthdate', { required: 'Date de naissance requise' })}
                  isInvalid={!!errors.birthdate}
                />
                <Form.Control.Feedback type="invalid">{errors.birthdate?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control {...register('phone')} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Adresse *</Form.Label>
                <Form.Control
                  {...register('address', { required: 'Adresse requise' })}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Code postal *</Form.Label>
                <Form.Control
                  {...register('postal_code', { required: 'Code postal requis' })}
                  isInvalid={!!errors.postal_code}
                />
                <Form.Control.Feedback type="invalid">{errors.postal_code?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Ville *</Form.Label>
                <Form.Control
                  {...register('city', { required: 'Ville requise' })}
                  isInvalid={!!errors.city}
                />
                <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Statut *</Form.Label>
                <Form.Select
                  {...register('user_status_id', { required: 'Statut requis' })}
                  isInvalid={!!errors.user_status_id}
                >
                  <option value="">Choisir un statut</option>
                  <option value="1">Utilisateur</option>
                  <option value="2">Organisateur</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.user_status_id?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Avatar (URL)</Form.Label>
                <Form.Control {...register('avatar')} placeholder="https://..." />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </Card>
    </div>
  )
}
