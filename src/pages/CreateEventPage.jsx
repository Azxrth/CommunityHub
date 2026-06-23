import { useEffect, useState } from 'react'
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useEventsStore from '../stores/eventsStore'
import useCategoriesStore from '../stores/categoriesStore'

export default function CreateEventPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const createEvent = useEventsStore((s) => s.createEvent)
  const { categories, fetchCategories } = useCategoriesStore()

  const priceType = watch('price_type')

  useEffect(() => { fetchCategories() }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...data,
        event_category_id: Number(data.event_category_id),
        max_participants: data.max_participants ? Number(data.max_participants) : undefined,
        price: data.price_type === 'payant' ? Number(data.price) : 0,
      }
      const res = await createEvent(payload)
      navigate(`/events/${res.id || res.event_id || ''}`)
    } catch (err) {
      setError(err.message || "Erreur lors de la création")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center py-4">
      <Card style={{ width: '700px' }} className="p-4 shadow-sm">
        <h2 className="mb-4">Créer un événement</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie *</Form.Label>
                <Form.Select
                  {...register('event_category_id', { required: 'Catégorie requise' })}
                  isInvalid={!!errors.event_category_id}
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.event_category_id?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Nom de l'événement *</Form.Label>
                <Form.Control
                  {...register('name', { required: 'Nom requis' })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type *</Form.Label>
                <Form.Select
                  {...register('event_type', { required: 'Type requis' })}
                  isInvalid={!!errors.event_type}
                >
                  <option value="">Choisir</option>
                  <option value="presentiel">Présentiel</option>
                  <option value="distanciel">Distanciel</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.event_type?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tarif *</Form.Label>
                <Form.Select
                  {...register('price_type', { required: 'Tarif requis' })}
                  isInvalid={!!errors.price_type}
                >
                  <option value="">Choisir</option>
                  <option value="gratuit">Gratuit</option>
                  <option value="payant">Payant</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.price_type?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            {priceType === 'payant' && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix (€) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('price', { required: 'Prix requis' })}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}
            <Col md={priceType === 'payant' ? 6 : 12}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de places max</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  {...register('max_participants')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date de début *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register('start_date', { required: 'Date de début requise' })}
                  isInvalid={!!errors.start_date}
                />
                <Form.Control.Feedback type="invalid">{errors.start_date?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date de fin *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register('end_date', {
                    required: 'Date de fin requise',
                    validate: (val) => {
                      const start = watch('start_date')
                      if (!start || !val) return true
                      const startDay = start.slice(0, 10)
                      const endDay = val.slice(0, 10)
                      if (endDay === startDay) return 'La date de fin doit être un jour différent de la date de début'
                      if (new Date(val) <= new Date(start)) return 'La date de fin doit être après la date de début'
                      return true
                    },
                  })}
                  isInvalid={!!errors.end_date}
                />
                <Form.Control.Feedback type="invalid">{errors.end_date?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Image (URL)</Form.Label>
                <Form.Control {...register('image')} placeholder="https://..." />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Introduction *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register('introduction', { required: 'Introduction requise' })}
                  isInvalid={!!errors.introduction}
                />
                <Form.Control.Feedback type="invalid">{errors.introduction?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Création...' : "Créer l'événement"}
          </Button>
        </Form>
      </Card>
    </div>
  )
}
