import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1">404</h1>
      <p className="lead">Page introuvable</p>
      <Button as={Link} to="/" variant="primary">Retour à l'accueil</Button>
    </div>
  )
}
