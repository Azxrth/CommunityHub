import { Card, Row, Col, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

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
    </div>
  )
}
