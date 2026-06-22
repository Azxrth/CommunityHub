import { Card, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function EventCard({ event }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{event.name}</Card.Title>
          <Badge bg={event.price_type === 'gratuit' ? 'success' : 'primary'}>
            {event.price_type === 'gratuit' ? 'Gratuit' : `${event.price} €`}
          </Badge>
        </div>
        {event.category_name && <Badge bg="secondary" className="mb-2">{event.category_name}</Badge>}
        <Badge bg={event.event_type === 'presentiel' ? 'info' : 'warning'} text="dark" className="ms-1 mb-2">
          {event.event_type}
        </Badge>
        <Card.Text className="small text-muted">{event.introduction?.slice(0, 100)}...</Card.Text>
        <small className="text-muted d-block">
          {new Date(event.start_date).toLocaleDateString('fr-FR')}
        </small>
      </Card.Body>
      <Card.Footer>
        <Button as={Link} to={`/events/${event.id}`} size="sm" variant="outline-primary" className="w-100">
          Voir les détails
        </Button>
      </Card.Footer>
    </Card>
  )
}
