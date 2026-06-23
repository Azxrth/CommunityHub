import { useEffect, useState } from 'react'
import { Row, Col, Spinner, Alert, Form, Button, InputGroup } from 'react-bootstrap'
import useEventsStore from '../stores/eventsStore'
import useCategoriesStore from '../stores/categoriesStore'
import EventCard from '../components/events/EventCard'

export default function EventsPage() {
  const { events, loading, error, fetchEvents } = useEventsStore()
  const { categories, fetchCategories } = useCategoriesStore()
  const [filters, setFilters] = useState({ q: '', category_id: '', type: '', price_type: '', date_filter: '' })

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    const active = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    fetchEvents(active)
  }, [filters])

  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val }))
  const reset = () => setFilters({ q: '', category_id: '', type: '', price_type: '', date_filter: '' })
  const hasFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div>
      <h2 className="mb-4">Événements</h2>

      <Row className="g-2 mb-4 align-items-end">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Rechercher..."
              value={filters.q}
              onChange={(e) => update('q', e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={filters.category_id} onChange={(e) => update('category_id', e.target.value)}>
            <option value="">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={filters.type} onChange={(e) => update('type', e.target.value)}>
            <option value="">Tous types</option>
            <option value="presentiel">Présentiel</option>
            <option value="distanciel">Distanciel</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={filters.price_type} onChange={(e) => update('price_type', e.target.value)}>
            <option value="">Tous prix</option>
            <option value="gratuit">Gratuit</option>
            <option value="payant">Payant</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={filters.date_filter} onChange={(e) => update('date_filter', e.target.value)}>
            <option value="">Tous les événements</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passés</option>
          </Form.Select>
        </Col>
        {hasFilters && (
          <Col md={1}>
            <Button variant="outline-secondary" onClick={reset}>✕</Button>
          </Col>
        )}
      </Row>

      {loading && <div className="text-center py-5"><Spinner /></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        events.length === 0 ? (
          <p className="text-muted">Aucun événement trouvé.</p>
        ) : (
          <Row className="g-3">
            {events.map((event) => (
              <Col key={event.id} md={4}><EventCard event={event} /></Col>
            ))}
          </Row>
        )
      )}
    </div>
  )
}
