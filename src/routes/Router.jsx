import { createBrowserRouter } from 'react-router-dom'

import LandingPage from '../pages/LandingPage'
import LobbyPage from '../pages/LobbyPage'
import CreateRoomPage from '../pages/CreateRoomPage'
import JoinRoomPage from '../pages/JoinRoomPage'
import GamePage from '../pages/GamePage'
import ResultPage from '../pages/ResultPage'
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/lobby',
        element: <LobbyPage />,
      },
      {
        path: '/rooms/create',
        element: <CreateRoomPage />,
      },
      {
        path: '/join-room',
        element: <JoinRoomPage />,
      },
      {
        path: '/rooms/:entryCode/game',
        element: <GamePage />,
      },
      {
        path: '/rooms/:entryCode/result',
        element: <ResultPage />,
      },
    ],
  },
])

export default router
