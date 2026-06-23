import { useEffect, useState } from 'react'
import { Spinner, Alert, ListGroup, Badge, Button, Form, Card, Row, Col, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useContactsStore from '../stores/contactsStore'
import useMessagesStore from '../stores/messagesStore'
import useAuthStore from '../stores/authStore'

export default function ContactsPage() {
  const { contacts, users, fetchContacts, fetchUsers, sendRequest, acceptContact } = useContactsStore()
  const { sendMessage } = useMessagesStore()
  const currentUser = useAuthStore((s) => s.user)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openMsgId, setOpenMsgId] = useState(null)
  const [msgSuccess, setMsgSuccess] = useState(null)
  const [msgError, setMsgError] = useState(null)
  const [sentRequests, setSentRequests] = useState([])
  const [userSearch, setUserSearch] = useState('')

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    Promise.all([fetchContacts(), fetchUsers()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const accepted = contacts.filter((c) => c.status === 'accepted')
  const pending = contacts.filter((c) => c.status === 'pending')

  const contactIds = contacts.map((c) => c.user_id ?? c.id)

  const filteredUsers = users.filter((u) => {
    if (u.id === currentUser?.id) return false
    if (contactIds.includes(u.id)) return false
    if (!userSearch) return true
    const q = userSearch.toLowerCase()
    return (u.pseudo?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
  })

  const handleAccept = async (contactId) => {
    try {
      await acceptContact(contactId)
      await fetchContacts()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleSendRequest = async (userId) => {
    try {
      await sendRequest(userId)
      setSentRequests((prev) => [...prev, userId])
    } catch (e) {
      setError(e?.message || 'Erreur lors de la demande')
    }
  }

  const onSendMessage = async (data, receiverId) => {
    setMsgError(null)
    try {
      await sendMessage({ receiver_id: Number(receiverId), message: data.message })
      reset()
      setMsgSuccess(receiverId)
      setOpenMsgId(null)
      setTimeout(() => setMsgSuccess(null), 3000)
    } catch (e) {
      setMsgError(e?.message || 'Erreur lors de l\'envoi')
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner /></div>

  return (
    <div>
      <h2 className="mb-4">Mes contacts</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {msgSuccess && <Alert variant="success" onClose={() => setMsgSuccess(null)} dismissible>Message envoyé !</Alert>}

      {/* Contacts acceptés */}
      <h5 className="mb-3">Contacts <Badge bg="secondary">{accepted.length}</Badge></h5>
      {accepted.length === 0 ? (
        <p className="text-muted mb-4">Aucun contact pour le moment.</p>
      ) : (
        <ListGroup className="mb-4">
          {accepted.map((c) => {
            const receiverId = c.user_id ?? c.receiver_id ?? c.id
            const isOpen = openMsgId === c.id
            return (
              <ListGroup.Item key={c.id} className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{c.pseudo}</strong>
                    <span className="text-muted ms-2 small">{c.email}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={isOpen ? 'secondary' : 'outline-primary'}
                    onClick={() => setOpenMsgId(isOpen ? null : c.id)}
                  >
                    {isOpen ? 'Fermer' : 'Envoyer un message'}
                  </Button>
                </div>
                {isOpen && (
                  <MessageForm
                    onSubmit={(data) => onSendMessage(data, receiverId)}
                    error={msgError}
                  />
                )}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      )}

      {/* Demandes en attente */}
      {pending.length > 0 && (
        <>
          <h5 className="mb-3">Demandes reçues <Badge bg="warning" text="dark">{pending.length}</Badge></h5>
          <ListGroup className="mb-4">
            {pending.map((c) => (
              <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{c.pseudo}</strong>
                  <span className="text-muted ms-2 small">{c.email}</span>
                </div>
                <Button size="sm" variant="success" onClick={() => handleAccept(c.id)}>
                  Accepter
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}

      {/* Trouver des membres */}
      <h5 className="mb-3">Trouver des membres</h5>
      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <Form.Control
          placeholder="Rechercher par pseudo ou email..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        {userSearch && (
          <Button variant="outline-secondary" onClick={() => setUserSearch('')}>✕</Button>
        )}
      </InputGroup>
      {filteredUsers.length === 0 ? (
        <p className="text-muted">Aucun membre trouvé.</p>
      ) : (
        <ListGroup>
          {filteredUsers.map((u) => {
            const sent = sentRequests.includes(u.id)
            return (
              <ListGroup.Item key={u.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{u.pseudo}</strong>
                  <span className="text-muted ms-2 small">{u.email}</span>
                </div>
                {sent ? (
                  <Badge bg="info">Demande envoyée</Badge>
                ) : (
                  <Button size="sm" variant="outline-primary" onClick={() => handleSendRequest(u.id)}>
                    + Ajouter
                  </Button>
                )}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      )}
    </div>
  )
}

function MessageForm({ onSubmit, error }) {
  const { register, handleSubmit, reset } = useForm()

  const submit = (data) => {
    onSubmit(data)
    reset()
  }

  return (
    <Form onSubmit={handleSubmit(submit)} className="mt-3 d-flex gap-2">
      {error && <Alert variant="danger" className="w-100 py-1 px-2 small mb-0">{error}</Alert>}
      <Form.Control
        placeholder="Votre message..."
        {...register('message', { required: true })}
      />
      <Button type="submit" size="sm">Envoyer</Button>
    </Form>
  )
}
