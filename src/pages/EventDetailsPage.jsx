import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Badge, Button, Spinner, Alert, Form, ListGroup, Row, Col, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useEventsStore from '../stores/eventsStore'
import useAuthStore from '../stores/authStore'

function StripeModal({ amount, onConfirm, onCancel, loading }) {
  const { register, handleSubmit } = useForm()
  return (
    <Modal show onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Paiement sécurisé</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small mb-3">
          Montant à régler : <strong>{amount} €</strong> (dont 10 % de commission plateforme)
        </p>
        <Form onSubmit={handleSubmit(onConfirm)}>
          <Form.Group className="mb-3">
            <Form.Label>Numéro de carte</Form.Label>
            <Form.Control placeholder="4242 4242 4242 4242" {...register('card_number')} />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Date d'expiration</Form.Label>
                <Form.Control placeholder="MM/AA" {...register('expiry')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control placeholder="123" {...register('cvv')} />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Traitement...' : `Payer ${amount} €`}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentEvent, fetchEvent, registerToEvent, addMessage, moderateMessage } = useEventsStore()
  const user = useAuthStore((s) => s.user)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerError, setRegisterError] = useState(null)
  const [msgError, setMsgError] = useState(null)
  const [msgSuccess, setMsgSuccess] = useState(false)
  const [showStripe, setShowStripe] = useState(false)
  const [moderatingId, setModeratingId] = useState(null)

  const { register: regMsg, handleSubmit: handleMsgSubmit, reset: resetMsg } = useForm()

  useEffect(() => {
    fetchEvent(id)
      .catch((e) => setError(e.message || 'Événement introuvable'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRegisterClick = () => {
    if (ev.price_type === 'payant') {
      setShowStripe(true)
    } else {
      doRegister()
    }
  }

  const doRegister = async (paymentMethod = 'gratuit') => {
    setRegisterLoading(true)
    setRegisterError(null)
    try {
      await registerToEvent({ event_id: Number(id), payment_method: paymentMethod })
      setRegisterSuccess(true)
      setShowStripe(false)
      fetchEvent(id)
    } catch (err) {
      setRegisterError(err.message || "Erreur lors de l'inscription")
    } finally {
      setRegisterLoading(false)
    }
  }

  const onStripeConfirm = () => doRegister('stripe')

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

  const onModerate = async (messageId) => {
    setModeratingId(messageId)
    try {
      await moderateMessage(messageId)
      fetchEvent(id)
    } catch (_) {}
    setModeratingId(null)
  }

  if (loading) return <div className="text-center py-5"><Spinner /></div>
  if (error) return <Alert variant="danger">{error}</Alert>
  if (!currentEvent) return null

  const ev = currentEvent
  const isOrganizer = user && (user.id === ev.organizer_id || user.id === ev.user_id)
  const isFull = ev.max_participants && Number(ev.participant_count || ev.registrations_count || 0) >= Number(ev.max_participants)

  return (
    <div>
      {showStripe && (
        <StripeModal
          amount={ev.price}
          onConfirm={onStripeConfirm}
          onCancel={() => setShowStripe(false)}
          loading={registerLoading}
        />
      )}

      <Button variant="outline-secondary" size="sm" className="mb-3" onClick={() => navigate('/events')}>
        ← Retour aux événements
      </Button>

      <Card className="shadow-sm mb-4">
        {ev.image && (
          <Card.Img variant="top" src={ev.image} style={{ maxHeight: 300, objectFit: 'cover' }} />
        )}
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
              <Col md={4}>
                <strong>Places :</strong>{' '}
                {ev.participant_count || ev.registrations_count || 0} / {ev.max_participants}
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {user?.is_premium && !registerSuccess && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5>Inscription</h5>
            {registerError && <Alert variant="danger">{registerError}</Alert>}
            {isFull ? (
              <Alert variant="warning" className="mb-0">
                Cet événement est complet. Les inscriptions sont fermées.
              </Alert>
            ) : (
              <Button onClick={handleRegisterClick} disabled={registerLoading}>
                {registerLoading ? 'Inscription...' : (ev.price_type === 'payant' ? `S'inscrire — ${ev.price} €` : "S'inscrire gratuitement")}
              </Button>
            )}
          </Card.Body>
        </Card>
      )}
      {!user?.is_premium && user && (
        <Alert variant="info" className="mb-4">
          Vous devez être <strong>Premium</strong> pour vous inscrire à un événement.
        </Alert>
      )}
      {registerSuccess && <Alert variant="success">Inscription confirmée !</Alert>}

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
          <Card.Header><strong>Messages ({ev.messages.filter(m => m.status !== 'pending_moderation').length})</strong></Card.Header>
          <ListGroup variant="flush">
            {ev.messages.map((m, i) => {
              if (m.status === 'pending_moderation') {
                return (
                  <ListGroup.Item key={i} className="text-muted fst-italic">
                    <em>Ce message est en attente de modération.</em>
                  </ListGroup.Item>
                )
              }
              return (
                <ListGroup.Item key={i}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{m.pseudo || m.sender_pseudo}</strong>
                      <span className="text-muted small ms-2">
                        {new Date(m.created_at).toLocaleString('fr-FR')}
                      </span>
                      <p className="mb-0 mt-1">{m.message}</p>
                    </div>
                    {isOrganizer && (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        disabled={moderatingId === m.id}
                        onClick={() => onModerate(m.id)}
                        title="Demander la suppression"
                      >
                        {moderatingId === m.id ? '...' : 'Modérer'}
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Card>
      )}
    </div>
  )
}
