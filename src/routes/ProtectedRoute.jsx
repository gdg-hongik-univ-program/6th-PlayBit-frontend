import {
  Navigate,
  Outlet,
} from 'react-router-dom'
import useAuthStore from '../stores/authStore'

function ProtectedRoute() {
  const member = useAuthStore(
    (state) => state.member,
  )
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  )

  if (!isAuthenticated || !member?.nickname) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
