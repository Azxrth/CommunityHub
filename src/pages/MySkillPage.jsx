import { useEffect, useState } from 'react'
import { Card, Form, Button, Alert, ListGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useSkillsStore from '../stores/skillsStore'

export default function MySkillPage() {
  const { skills, fetchSkills, createSkill } = useSkillsStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchSkills().catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data) => {
    try {
      await createSkill(data)
      reset()
      fetchSkills()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2 className="mb-4">Mes compétences</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="p-4 mb-4">
        <h5>Ajouter une compétence</h5>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Titre *</Form.Label>
            <Form.Control {...register('title', { required: 'Requis' })} isInvalid={!!errors.title} />
            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('description', { required: 'Requis' })} isInvalid={!!errors.description} />
            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prix journalier (€) *</Form.Label>
            <Form.Control type="number" {...register('daily_price', { required: 'Requis' })} isInvalid={!!errors.daily_price} />
            <Form.Control.Feedback type="invalid">{errors.daily_price?.message}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Ajouter</Button>
        </Form>
      </Card>
      {!loading && skills.length === 0 && <p className="text-muted">Aucune compétence ajoutée.</p>}
      {skills.length > 0 && (
        <ListGroup>
          {skills.map((s) => (
            <ListGroup.Item key={s.id}>
              <strong>{s.title}</strong> — {s.daily_price} €/jour
              <p className="mb-0 text-muted small">{s.description}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}
