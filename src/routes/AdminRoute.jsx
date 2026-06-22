import { Navigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  return user?.role === 'admin' ? children : <Navigate to="/" replace />
}
