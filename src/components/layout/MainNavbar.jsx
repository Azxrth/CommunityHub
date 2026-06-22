import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

export default function MainNavbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">CommunityHub</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/events">Événements</Nav.Link>
            <Nav.Link as={Link} to="/skills">Compétences</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/contacts">Contacts</Nav.Link>
                <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center gap-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/dashboard">
                    <Badge bg="danger">Admin</Badge>
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/profile">
                  {user.pseudo}
                  {user.is_premium && <Badge bg="warning" text="dark" className="ms-1">Premium</Badge>}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
                <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
