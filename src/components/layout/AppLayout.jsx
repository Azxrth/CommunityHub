import { Outlet } from 'react-router-dom'
import MainNavbar from './MainNavbar'
import { Container } from 'react-bootstrap'

export default function AppLayout() {
  return (
    <>
      <MainNavbar />
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  )
}
