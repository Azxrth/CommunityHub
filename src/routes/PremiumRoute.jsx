import { Navigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function PremiumRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  return user?.is_premium ? children : <Navigate to="/premium" replace />
}
