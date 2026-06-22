import { Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function HomePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="text-center py-5">
      <h1 className="display-4 fw-bold">CommunityHub</h1>
      <p className="lead text-muted">La plateforme communautaire pour partager, échanger et grandir ensemble.</p>
      <Row className="justify-content-center gap-3 mt-4">
        <Col xs="auto">
          <Button as={Link} to="/events" size="lg" variant="primary">Voir les événements</Button>
        </Col>
        {!user && (
          <Col xs="auto">
            <Button as={Link} to="/register" size="lg" variant="outline-primary">Rejoindre la communauté</Button>
          </Col>
        )}
      </Row>
    </div>
  )
}
