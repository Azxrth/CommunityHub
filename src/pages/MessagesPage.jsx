import { useEffect, useState } from 'react'
import { Spinner, Alert, ListGroup, Form, Button, Nav, Card, Badge } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useMessagesStore from '../stores/messagesStore'
import useContactsStore from '../stores/contactsStore'

export default function MessagesPage() {
  const { received, sent, fetchReceived, fetchSent, sendMessage } = useMessagesStore()
  const { contacts, fetchContacts } = useContactsStore()
  const [tab, setTab] = useState('received')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sendSuccess, setSendSuccess] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    Promise.all([fetchReceived(), fetchSent(), fetchContacts()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const acceptedContacts = contacts.filter((c) => c.status === 'accepted')

  const onSubmit = async (data) => {
    setError(null)
    setSendSuccess(false)
    try {
      await sendMessage({ receiver_id: Number(data.receiver_id), message: data.message })
      reset()
      setSendSuccess(true)
      setTimeout(() => setSendSuccess(false), 3000)
      fetchReceived()
      fetchSent()
    } catch (err) {
      setError(err?.message || 'Erreur lors de l\'envoi')
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner /></div>

  const messages = tab === 'received' ? received : sent

  return (
    <div>
      <h2 className="mb-4">Messages</h2>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {sendSuccess && <Alert variant="success" onClose={() => setSendSuccess(false)} dismissible>Message envoyé !</Alert>}

      <Card className="p-3 mb-4">
        <h6 className="mb-3">Nouveau message</h6>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-2">
            <Form.Label>Destinataire *</Form.Label>
            {acceptedContacts.length > 0 ? (
              <Form.Select {...register('receiver_id', { required: 'Requis' })} isInvalid={!!errors.receiver_id}>
                <option value="">-- Choisir un contact --</option>
                {acceptedContacts.map((c) => {
                  const uid = c.user_id ?? c.receiver_id ?? c.id
                  return <option key={c.id} value={uid}>{c.pseudo}</option>
                })}
              </Form.Select>
            ) : (
              <Form.Control
                type="number"
                placeholder="ID du destinataire"
                {...register('receiver_id', { required: 'Requis' })}
                isInvalid={!!errors.receiver_id}
              />
            )}
            <Form.Control.Feedback type="invalid">{errors.receiver_id?.message}</Form.Control.Feedback>
            {acceptedContacts.length === 0 && (
              <Form.Text className="text-muted">Ajoutez des contacts pour les sélectionner ici.</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Votre message..."
              {...register('message', { required: 'Requis' })}
              isInvalid={!!errors.message}
            />
            <Form.Control.Feedback type="invalid">{errors.message?.message}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" size="sm">Envoyer</Button>
        </Form>
      </Card>

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active={tab === 'received'} onClick={() => setTab('received')}>
            Reçus <Badge bg="secondary">{received.length}</Badge>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={tab === 'sent'} onClick={() => setTab('sent')}>
            Envoyés <Badge bg="secondary">{sent.length}</Badge>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {messages.length === 0 ? (
        <p className="text-muted">Aucun message.</p>
      ) : (
        <ListGroup>
          {messages.map((m, i) => (
            <ListGroup.Item key={i} className="py-3">
              <div className="d-flex justify-content-between align-items-start">
                <strong>
                  {tab === 'received'
                    ? `De : ${m.sender_pseudo ?? m.pseudo ?? '—'}`
                    : `À : ${m.receiver_pseudo ?? '—'}`}
                </strong>
                <small className="text-muted">{new Date(m.created_at).toLocaleString('fr-FR')}</small>
              </div>
              <p className="mb-0 mt-1">{m.message}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}
