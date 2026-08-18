import { useNavigate } from 'react-router-dom'

import LandingContent from '../components/LandingContent'
import NotificationButton from '../components/NotificationButton'
import useGameStore from '../features/game/model/gameStore'
import useAuthStore from '../stores/authStore'

function LobbyPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const resetRoomState = useGameStore(
    (state) => state.resetRoomState,
  )

  const handleLogout = async () => {
    try {
      await logout()
      resetRoomState()

      navigate('/', { replace: true })
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <main
      className="
        relative
        min-h-screen
        bg-[#F8F5FF]
        flex
        items-center
        justify-center
      "
    >
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <NotificationButton />

        <button
          onClick={handleLogout}
          className="
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-2
            text-sm
            font-semibold
            text-gray-700
            shadow-sm
            transition
            hover:bg-gray-50
            active:scale-95
          "
        >
          로그아웃
        </button>
      </div>

      <LandingContent />
    </main>
  )
}

export default LobbyPage
