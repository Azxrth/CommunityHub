import { useEffect } from 'react'
import { Row, Col, Card, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap'
import useCategoriesStore from '../stores/categoriesStore'
import CategoryForm from '../components/categories/CategoryForm'

export default function AdminPage() {
  const { categories, fetchCategories } = useCategoriesStore()

  useEffect(() => { fetchCategories() }, [])

  return (
    <div>
      <h2 className="mb-4">
        Administration <Badge bg="danger">Admin</Badge>
      </h2>
      <Row className="g-4">
        <Col md={5}>
          <Card className="p-4 shadow-sm">
            <h5 className="mb-3">Créer une catégorie</h5>
            <CategoryForm onCreated={fetchCategories} />
          </Card>
        </Col>
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Header><strong>Catégories existantes ({categories.length})</strong></Card.Header>
            {categories.length === 0 ? (
              <Card.Body><p className="text-muted mb-0">Aucune catégorie.</p></Card.Body>
            ) : (
              <ListGroup variant="flush">
                {categories.map((c) => (
                  <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
                    {c.name}
                    <Badge bg="secondary">#{c.id}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
