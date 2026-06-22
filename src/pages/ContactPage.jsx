import { useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import { apiFetch } from '../services/api'

export default function ContactPage() {
  const user = useAuthStore((s) => s.user)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user ? `${user.firstname} ${user.lastname}` : '',
    }
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await apiFetch('/contacts/store.php', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      setSuccess(true)
      reset()
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '560px' }} className="p-4 shadow-sm mt-4">
        <h2 className="mb-4">Nous contacter</h2>
        {success && <Alert variant="success">Message envoyé ! Nous vous répondrons rapidement.</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Nom & Prénom *</Form.Label>
            <Form.Control
              {...register('name', { required: 'Nom requis' })}
              isInvalid={!!errors.name}
              placeholder="Jean Dupont"
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sujet *</Form.Label>
            <Form.Control
              {...register('subject', { required: 'Sujet requis' })}
              isInvalid={!!errors.subject}
              placeholder="Votre sujet..."
            />
            <Form.Control.Feedback type="invalid">{errors.subject?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              {...register('message', { required: 'Message requis' })}
              isInvalid={!!errors.message}
              placeholder="Votre message..."
            />
            <Form.Control.Feedback type="invalid">{errors.message?.message}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le message'}
          </Button>
        </Form>
      </Card>
    </div>
  )
}
