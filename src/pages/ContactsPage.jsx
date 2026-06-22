import { useEffect } from 'react'
import { Spinner, Alert, ListGroup, Badge, Button } from 'react-bootstrap'
import useContactsStore from '../stores/contactsStore'

export default function ContactsPage() {
  const { contacts, fetchContacts, acceptContact } = useContactsStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContacts()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-5"><Spinner /></div>
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <div>
      <h2 className="mb-4">Mes contacts</h2>
      {contacts.length === 0 ? <p className="text-muted">Aucun contact.</p> : (
        <ListGroup>
          {contacts.map((c) => (
            <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
              <span>{c.pseudo} <small className="text-muted">({c.email})</small></span>
              {c.status === 'pending' && (
                <Button size="sm" variant="success" onClick={() => acceptContact(c.id)}>Accepter</Button>
              )}
              {c.status === 'accepted' && <Badge bg="success">Contact</Badge>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}
