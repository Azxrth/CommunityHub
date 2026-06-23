import { useEffect, useState } from 'react'
import { Card, Row, Col, Badge, Nav, Spinner, Alert, Button, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useEventsStore from '../stores/eventsStore'

function EventRegistrationList({ dateFilter }) {
  const { fetchMyRegistrations, rateOrganizer } = useEventsStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratedIds, setRatedIds] = useState([])

  useEffect(() => {
    fetchMyRegistrations(dateFilter)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [dateFilter])

  const handleRate = async (organizerId) => {
    try {
      await rateOrganizer(organizerId)
      setRatedIds((prev) => [...prev, organizerId])
    } catch (_) {}
  }

  if (loading) return <div className="text-center py-3"><Spinner size="sm" /></div>
  if (!items.length) return <p className="text-muted small">Aucune inscription.</p>

  return (
    <ListGroup variant="flush">
      {items.map((item) => (
        <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
          <div>
            <Link to={`/events/${item.event_id || item.id}`} className="fw-semibold text-decoration-none">
              {item.event_name || item.name}
            </Link>
            <div className="text-muted small">
              {item.start_date ? new Date(item.start_date).toLocaleDateString('fr-FR') : ''}
              {item.price_type === 'payant' && item.price && (
                <Badge bg="primary" className="ms-2">{item.price} €</Badge>
              )}
            </div>
          </div>
          {dateFilter === 'past' && item.organizer_id && (
            <Button
              variant={ratedIds.includes(item.organizer_id) ? 'success' : 'outline-success'}
              size="sm"
              disabled={ratedIds.includes(item.organizer_id)}
              onClick={() => handleRate(item.organizer_id)}
              title="Voter positivement pour l'organisateur"
            >
              {ratedIds.includes(item.organizer_id) ? '👍 Noté' : '👍 Féliciter'}
            </Button>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

function MyEventList({ dateFilter }) {
  const { fetchMyEvents } = useEventsStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyEvents(dateFilter)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [dateFilter])

  if (loading) return <div className="text-center py-3"><Spinner size="sm" /></div>
  if (!items.length) return <p className="text-muted small">Aucun événement.</p>

  return (
    <ListGroup variant="flush">
      {items.map((ev) => (
        <ListGroup.Item key={ev.id} className="d-flex justify-content-between align-items-center">
          <div>
            <Link to={`/events/${ev.id}`} className="fw-semibold text-decoration-none">
              {ev.name}
            </Link>
            <div className="text-muted small">
              {ev.start_date ? new Date(ev.start_date).toLocaleDateString('fr-FR') : ''}
              {ev.max_participants && (
                <span className="ms-2">{ev.participant_count || 0} / {ev.max_participants} inscrits</span>
              )}
            </div>
          </div>
          <Badge bg={ev.price_type === 'gratuit' ? 'success' : 'primary'}>
            {ev.price_type === 'gratuit' ? 'Gratuit' : `${ev.price} €`}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [regTab, setRegTab] = useState('upcoming')
  const [evTab, setEvTab] = useState('upcoming')

  return (
    <div>
      <h2>
        Tableau de bord
        {user?.role === 'admin' && <Badge bg="danger" className="ms-2">Admin</Badge>}
      </h2>
      <p className="text-muted">
        Bienvenue, <strong>{user?.pseudo}</strong> !
        {user?.is_premium && <Badge bg="warning" text="dark" className="ms-2">Premium</Badge>}
      </p>

      <Row className="g-3 mt-2">
        <Col md={4}>
          <Card as={Link} to="/profile" className="text-decoration-none h-100 text-center p-3">
            <Card.Body><h5>Mon profil</h5><p className="text-muted small">Modifier mes informations</p></Card.Body>
          </Card>
        </Col>
        {!user?.is_premium && (
          <Col md={4}>
            <Card as={Link} to="/premium" className="text-decoration-none h-100 text-center p-3 border-warning">
              <Card.Body><h5>Passer Premium</h5><p className="text-muted small">Accéder à toutes les fonctionnalités</p></Card.Body>
            </Card>
          </Col>
        )}
        {user?.is_premium && (
          <>
            <Col md={4}>
              <Card as={Link} to="/my-skills" className="text-decoration-none h-100 text-center p-3">
                <Card.Body><h5>Mes compétences</h5><p className="text-muted small">Gérer mes compétences</p></Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card as={Link} to="/contacts" className="text-decoration-none h-100 text-center p-3">
                <Card.Body><h5>Mes contacts</h5><p className="text-muted small">Mon réseau</p></Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card as={Link} to="/messages" className="text-decoration-none h-100 text-center p-3">
                <Card.Body><h5>Messages</h5><p className="text-muted small">Mes échanges privés</p></Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card as={Link} to="/events/create" className="text-decoration-none h-100 text-center p-3 border-primary">
                <Card.Body><h5>Créer un événement</h5><p className="text-muted small">Proposer à la communauté</p></Card.Body>
              </Card>
            </Col>
          </>
        )}
        {user?.role === 'admin' && (
          <Col md={4}>
            <Card as={Link} to="/admin" className="text-decoration-none h-100 text-center p-3 border-danger">
              <Card.Body><h5>Administration</h5><p className="text-muted small">Gérer la plateforme</p></Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {user?.is_premium && (
        <Row className="g-4 mt-2">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header>
                <strong>Mes inscriptions</strong>
                <Nav variant="tabs" className="mt-2" activeKey={regTab} onSelect={setRegTab}>
                  <Nav.Item><Nav.Link eventKey="upcoming">En cours</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="past">Passées</Nav.Link></Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body className="p-0">
                <EventRegistrationList dateFilter={regTab} key={regTab} />
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header>
                <strong>Mes événements</strong>
                <Nav variant="tabs" className="mt-2" activeKey={evTab} onSelect={setEvTab}>
                  <Nav.Item><Nav.Link eventKey="upcoming">En cours</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="past">Passés</Nav.Link></Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body className="p-0">
                <MyEventList dateFilter={evTab} key={evTab} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}
