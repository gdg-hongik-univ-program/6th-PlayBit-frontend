import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import useAuthStore from '../stores/authStore'

function ProtectedRoute() {
  const location = useLocation()
  const member = useAuthStore(
    (state) => state.member,
  )
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  )

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!member?.nickname && location.pathname !== '/nickname') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
