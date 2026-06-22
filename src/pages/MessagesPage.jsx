import { useEffect, useState } from 'react'
import { Spinner, Alert, ListGroup, Form, Button, Nav } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useMessagesStore from '../stores/messagesStore'

export default function MessagesPage() {
  const { received, sent, fetchReceived, fetchSent, sendMessage } = useMessagesStore()
  const [tab, setTab] = useState('received')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    Promise.all([fetchReceived(), fetchSent()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data) => {
    try {
      await sendMessage(data)
      reset()
      fetchReceived()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner /></div>

  const messages = tab === 'received' ? received : sent

  return (
    <div>
      <h2 className="mb-4">Messages</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-4 p-3 border rounded">
        <Form.Group className="mb-2">
          <Form.Control
            type="number"
            placeholder="ID du destinataire"
            {...register('receiver_id', { required: true })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control as="textarea" rows={2} placeholder="Votre message..." {...register('message', { required: true })} />
        </Form.Group>
        <Button type="submit" size="sm">Envoyer</Button>
      </Form>
      <Nav variant="tabs" className="mb-3">
        <Nav.Item><Nav.Link active={tab === 'received'} onClick={() => setTab('received')}>Reçus ({received.length})</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link active={tab === 'sent'} onClick={() => setTab('sent')}>Envoyés ({sent.length})</Nav.Link></Nav.Item>
      </Nav>
      {messages.length === 0 ? <p className="text-muted">Aucun message.</p> : (
        <ListGroup>
          {messages.map((m, i) => (
            <ListGroup.Item key={i}>
              <strong>{tab === 'received' ? `De : ${m.sender_pseudo}` : `À : ${m.receiver_pseudo}`}</strong>
              <p className="mb-0">{m.message}</p>
              <small className="text-muted">{new Date(m.created_at).toLocaleString('fr-FR')}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}
