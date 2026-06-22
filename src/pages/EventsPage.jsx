import { useEffect } from 'react'
import { Row, Col, Spinner, Alert } from 'react-bootstrap'
import useEventsStore from '../stores/eventsStore'
import EventCard from '../components/events/EventCard'

export default function EventsPage() {
  const { events, loading, error, fetchEvents } = useEventsStore()

  useEffect(() => { fetchEvents() }, [])

  if (loading) return <div className="text-center py-5"><Spinner /></div>
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <div>
      <h2 className="mb-4">Événements</h2>
      {events.length === 0 ? (
        <p className="text-muted">Aucun événement disponible.</p>
      ) : (
        <Row className="g-3">
          {events.map((event) => (
            <Col key={event.id} md={4}><EventCard event={event} /></Col>
          ))}
        </Row>
      )}
    </div>
  )
}
