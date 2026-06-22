import { Card, Button, Alert, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import useAuthStore from '../stores/authStore'
import usePaymentsStore from '../stores/paymentsStore'

export default function PremiumPage() {
  const { register, handleSubmit } = useForm({ defaultValues: { payment_method: 'stripe', amount: 19.99 } })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, updateUser } = useAuthStore()
  const payPremium = usePaymentsStore((s) => s.payPremium)

  if (user?.is_premium) return <Alert variant="success">Vous êtes déjà membre Premium !</Alert>

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await payPremium(data)
      updateUser({ ...user, is_premium: true })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Paiement échoué')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 mx-auto shadow-sm" style={{ maxWidth: '500px' }}>
      <h2 className="mb-2">Passer Premium</h2>
      <p className="text-muted mb-4">Accédez à toutes les fonctionnalités pour 19,99 €.</p>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Bienvenue parmi les membres Premium !</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Moyen de paiement</Form.Label>
          <Form.Select {...register('payment_method')}>
            <option value="stripe">Stripe</option>
            <option value="cheque">Chèque</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" className="w-100" disabled={loading}>
          {loading ? 'Traitement...' : 'Payer 19,99 €'}
        </Button>
      </Form>
    </Card>
  )
}
