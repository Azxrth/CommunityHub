import { Form, Button, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import useCategoriesStore from '../../stores/categoriesStore'

export default function CategoryForm({ onCreated }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const createCategory = useCategoriesStore((s) => s.createCategory)

  const onSubmit = async (data) => {
    try {
      await createCategory(data)
      reset()
      onCreated?.()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-2">
        <Form.Label>Nom de la catégorie</Form.Label>
        <Form.Control {...register('name', { required: 'Nom requis' })} isInvalid={!!errors.name} />
        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" size="sm">Créer</Button>
    </Form>
  )
}
