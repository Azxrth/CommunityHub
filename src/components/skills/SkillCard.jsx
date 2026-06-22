import { Card, Badge } from 'react-bootstrap'

export default function SkillCard({ skill }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{skill.title}</Card.Title>
        <Badge bg="success" className="mb-2">{skill.daily_price} €/jour</Badge>
        <Card.Text className="small">{skill.description}</Card.Text>
        {skill.pseudo && <small className="text-muted">Par {skill.pseudo}</small>}
      </Card.Body>
    </Card>
  )
}
