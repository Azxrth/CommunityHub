import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Badge, Button, Spinner, Alert, Form, ListGroup, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useEventsStore from '../stores/eventsStore'
import useAuthStore from '../stores/authStore'

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentEvent, fetchEvent, registerToEvent, addMessage } = useEventsStore()
  const user = useAuthStore((s) => s.user)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerError, setRegisterError] = useState(null)
  const [msgError, setMsgError] = useState(null)
  const [msgSuccess, setMsgSuccess] = useState(false)

  const { register: regMsg, handleSubmit: handleMsgSubmit, reset: resetMsg } = useForm()
  const { register: regReg, handleSubmit: handleRegSubmit } = useForm({
    defaultValues: { payment_method: 'stripe' }
  })

  useEffect(() => {
    fetchEvent(id)
      .catch((e) => setError(e.message || 'Événement introuvable'))
      .finally(() => setLoading(false))
  }, [id])

  const onRegister = async (data) => {
    setRegisterLoading(true)
    setRegisterError(null)
    try {
      await registerToEvent({ event_id: Number(id), payment_method: data.payment_method })
      setRegisterSuccess(true)
    } catch (err) {
      setRegisterError(err.message || "Erreur lors de l'inscription")
    } finally {
      setRegisterLoading(false)
    }
  }

  const onMessage = async (data) => {
    setMsgError(null)
    try {
      await addMessage({ event_id: Number(id), message: data.message })
      resetMsg()
      setMsgSuccess(true)
      setTimeout(() => setMsgSuccess(false), 3000)
      fetchEvent(id)
    } catch (err) {
      setMsgError(err.message || 'Erreur')
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner /></div>
  if (error) return <Alert variant="danger">{error}</Alert>
  if (!currentEvent) return null

  const ev = currentEvent

  return (
    <div>
      <Button variant="outline-secondary" size="sm" className="mb-3" onClick={() => navigate('/events')}>
        ← Retour aux événements
      </Button>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h2 className="mb-0">{ev.name}</h2>
            <div className="d-flex gap-2">
              <Badge bg={ev.price_type === 'gratuit' ? 'success' : 'primary'}>
                {ev.price_type === 'gratuit' ? 'Gratuit' : `${ev.price} €`}
              </Badge>
              <Badge bg={ev.event_type === 'presentiel' ? 'info' : 'warning'} text="dark">
                {ev.event_type}
              </Badge>
            </div>
          </div>

          {ev.category_name && (
            <Badge bg="secondary" className="mb-3">{ev.category_name}</Badge>
          )}

          <p>{ev.introduction}</p>

          <Row className="text-muted small">
            <Col md={4}><strong>Début :</strong> {new Date(ev.start_date).toLocaleString('fr-FR')}</Col>
            <Col md={4}><strong>Fin :</strong> {new Date(ev.end_date).toLocaleString('fr-FR')}</Col>
            {ev.max_participants && (
              <Col md={4}><strong>Places :</strong> {ev.max_participants}</Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {user?.is_premium && !registerSuccess && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5>S'inscrire à cet événement</h5>
            {registerError && <Alert variant="danger">{registerError}</Alert>}
            <Form onSubmit={handleRegSubmit(onRegister)} className="d-flex gap-3 align-items-end">
              <Form.Group>
                <Form.Label>Moyen de paiement</Form.Label>
                <Form.Select {...regReg('payment_method')} style={{ width: '200px' }}>
                  <option value="stripe">Stripe</option>
                  <option value="cheque">Chèque</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" disabled={registerLoading}>
                {registerLoading ? 'Inscription...' : "S'inscrire"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
      {registerSuccess && <Alert variant="success">Inscription confirmée ! Un email de confirmation vous a été envoyé.</Alert>}

      {user && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5>Laisser un message</h5>
            {msgError && <Alert variant="danger">{msgError}</Alert>}
            {msgSuccess && <Alert variant="success">Message envoyé !</Alert>}
            <Form onSubmit={handleMsgSubmit(onMessage)} className="d-flex gap-2">
              <Form.Control
                placeholder="Votre message..."
                {...regMsg('message', { required: true })}
              />
              <Button type="submit">Envoyer</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {ev.messages?.length > 0 && (
        <Card className="shadow-sm">
          <Card.Header><strong>Messages ({ev.messages.length})</strong></Card.Header>
          <ListGroup variant="flush">
            {ev.messages.map((m, i) => (
              <ListGroup.Item key={i}>
                <strong>{m.pseudo || m.sender_pseudo}</strong>
                <span className="text-muted small ms-2">
                  {new Date(m.created_at).toLocaleString('fr-FR')}
                </span>
                <p className="mb-0 mt-1">{m.message}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </div>
  )
}
