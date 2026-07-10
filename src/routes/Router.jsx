import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import CreateRoomPage from '../pages/CreateRoomPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/create-room',
    element: <CreateRoomPage />,
  }
])

export default router