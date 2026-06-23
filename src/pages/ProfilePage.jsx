import { useEffect, useState } from 'react'
import { Card, Row, Col, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useEventsStore from '../stores/eventsStore'
import { apiFetch } from '../services/api'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { fetchOrganizerStats, requestPayout } = useEventsStore()
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [payoutMsg, setPayoutMsg] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      pseudo: user?.pseudo,
      email: user?.email,
      firstname: user?.firstname,
      lastname: user?.lastname,
      birthdate: user?.birthdate || '',
      address: user?.address,
      postal_code: user?.postal_code,
      city: user?.city,
      phone: user?.phone,
      avatar: user?.avatar,
      password: '',
    }
  })

  useEffect(() => {
    if (user?.is_premium) {
      fetchOrganizerStats()
        .then(setStats)
        .catch(() => setStats(null))
    }
  }, [])

  const onSubmit = async (data) => {
    setError(null)
    try {
      await apiFetch('/users/update.php', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      updateUser({ ...user, ...data, password: undefined })
      setSuccess(true)
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour')
    }
  }

  const handlePayout = async () => {
    setPayoutLoading(true)
    setPayoutMsg(null)
    try {
      await requestPayout()
      setPayoutMsg({ type: 'success', text: 'Demande de paiement envoyée ! Vous serez réglé sous 5 jours ouvrés.' })
    } catch (err) {
      setPayoutMsg({ type: 'danger', text: err.message || 'Erreur lors de la demande' })
    } finally {
      setPayoutLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-4">Mon profil</h2>

      {success && <Alert variant="success" onClose={() => setSuccess(false)} dismissible>Profil mis à jour !</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!editing ? (
        <Card className="shadow-sm p-4 mb-4">
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" width={80} height={80} className="rounded-circle" />
              ) : (
                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 80, height: 80, fontSize: 32 }}>
                  {user?.pseudo?.[0]?.toUpperCase()}
                </div>
              )}
            </Col>
            <Col>
              <h4 className="mb-0">
                {user?.firstname} {user?.lastname}
                {user?.is_premium && <Badge bg="warning" text="dark" className="ms-2">Premium</Badge>}
                {user?.role === 'admin' && <Badge bg="danger" className="ms-2">Admin</Badge>}
              </h4>
              <p className="text-muted mb-0">@{user?.pseudo}</p>
              <p className="text-muted mb-0">{user?.email}</p>
            </Col>
          </Row>
          <Row className="g-3">
            {user?.birthdate && <Col md={6}><strong>Date de naissance :</strong> {new Date(user.birthdate).toLocaleDateString('fr-FR')}</Col>}
            <Col md={6}><strong>Adresse :</strong> {user?.address || '—'}</Col>
            <Col md={3}><strong>Code postal :</strong> {user?.postal_code || '—'}</Col>
            <Col md={3}><strong>Ville :</strong> {user?.city || '—'}</Col>
            <Col md={6}><strong>Téléphone :</strong> {user?.phone || '—'}</Col>
          </Row>
          <Button variant="outline-primary" className="mt-4" onClick={() => setEditing(true)}>
            Modifier mon profil
          </Button>
        </Card>
      ) : (
        <Card className="shadow-sm p-4 mb-4">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pseudo *</Form.Label>
                  <Form.Control {...register('pseudo', { required: 'Requis' })} isInvalid={!!errors.pseudo} />
                  <Form.Control.Feedback type="invalid">{errors.pseudo?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" {...register('email', { required: 'Requis' })} isInvalid={!!errors.email} />
                  <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control {...register('firstname', { required: 'Requis' })} isInvalid={!!errors.firstname} />
                  <Form.Control.Feedback type="invalid">{errors.firstname?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control {...register('lastname', { required: 'Requis' })} isInvalid={!!errors.lastname} />
                  <Form.Control.Feedback type="invalid">{errors.lastname?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date de naissance</Form.Label>
                  <Form.Control type="date" {...register('birthdate')} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control {...register('phone')} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control {...register('address')} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Code postal</Form.Label>
                  <Form.Control {...register('postal_code')} />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Ville</Form.Label>
                  <Form.Control {...register('city')} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Avatar (URL)</Form.Label>
                  <Form.Control {...register('avatar')} placeholder="https://..." />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nouveau mot de passe <span className="text-muted small">(laisser vide pour ne pas changer)</span></Form.Label>
                  <Form.Control type="password" {...register('password')} autoComplete="new-password" />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button type="submit">Enregistrer</Button>
              <Button variant="outline-secondary" onClick={() => setEditing(false)}>Annuler</Button>
            </div>
          </Form>
        </Card>
      )}

      {user?.is_premium && (
        <Card className="shadow-sm p-4">
          <h5>Revenus & statistiques</h5>
          {payoutMsg && (
            <Alert variant={payoutMsg.type} onClose={() => setPayoutMsg(null)} dismissible>
              {payoutMsg.text}
            </Alert>
          )}
          {stats === null ? (
            <Spinner size="sm" />
          ) : (
            <Row className="g-3 mb-3">
              <Col md={4}>
                <div className="border rounded p-3 text-center">
                  <div className="fs-4 fw-bold text-success">{stats.total_earned ?? 0} €</div>
                  <div className="text-muted small">Total généré</div>
                </div>
              </Col>
              <Col md={4}>
                <div className="border rounded p-3 text-center">
                  <div className="fs-4 fw-bold">{stats.pending_amount ?? 0} €</div>
                  <div className="text-muted small">En attente de paiement</div>
                </div>
              </Col>
              <Col md={4}>
                <div className="border rounded p-3 text-center">
                  <div className="fs-4 fw-bold">{stats.total_events ?? 0}</div>
                  <div className="text-muted small">Événements organisés</div>
                </div>
              </Col>
              {stats.rating !== undefined && (
                <Col md={4}>
                  <div className="border rounded p-3 text-center">
                    <div className="fs-4 fw-bold text-warning">👍 {stats.rating}</div>
                    <div className="text-muted small">Votes positifs reçus</div>
                  </div>
                </Col>
              )}
            </Row>
          )}
          <Button
            variant="primary"
            onClick={handlePayout}
            disabled={payoutLoading || (stats && !stats.pending_amount)}
          >
            {payoutLoading ? 'Envoi...' : 'Demander le paiement'}
          </Button>
        </Card>
      )}
    </div>
  )
}
