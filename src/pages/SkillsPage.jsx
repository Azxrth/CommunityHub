import { useEffect } from 'react'
import { Row, Col, Spinner, Alert } from 'react-bootstrap'
import useSkillsStore from '../stores/skillsStore'
import SkillCard from '../components/skills/SkillCard'

export default function SkillsPage() {
  const { skills, loading, error, fetchSkills } = useSkillsStore()

  useEffect(() => { fetchSkills() }, [])

  if (loading) return <div className="text-center py-5"><Spinner /></div>
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <div>
      <h2 className="mb-4">Compétences disponibles</h2>
      {skills.length === 0 ? (
        <p className="text-muted">Aucune compétence disponible.</p>
      ) : (
        <Row className="g-3">
          {skills.map((s) => <Col key={s.id} md={4}><SkillCard skill={s} /></Col>)}
        </Row>
      )}
    </div>
  )
}
