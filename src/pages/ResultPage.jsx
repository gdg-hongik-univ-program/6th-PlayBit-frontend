import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useGameStore from '../features/game/model/gameStore'
import MobileShell from '../components/MobileShell'

import hansimWonImg from '../assets/hansim_won.png'
import hansimLoseImg from '../assets/hansimlose.png'
import hansimDrawImg from '../assets/hansimdraw.png'

const RESULT_ASSETS = {
  win: { text: '승리', mascot: hansimWonImg },
  lose: { text: '패배', mascot: hansimLoseImg },
  draw: { text: '무승부', mascot: hansimDrawImg },
}

const isSameMember = (firstMemberId, secondMemberId) => {
  if (firstMemberId === null || firstMemberId === undefined || secondMemberId === null || secondMemberId === undefined) {
    return false
  }
  return String(firstMemberId) === String(secondMemberId)
}

function ResultPage() {
  const { entryCode } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const room = useGameStore((state) => state.room)
  const myMemberId = useGameStore((state) => state.myMemberId)
  const winnerMemberId = useGameStore((state) => state.winnerMemberId)
  const status = useGameStore((state) => state.status)
  const isRoomLoading = useGameStore((state) => state.isRoomLoading)
  const error = useGameStore((state) => state.error)
  const fetchRoom = useGameStore((state) => state.fetchRoom)
  const resetRoomState = useGameStore((state) => state.resetRoomState)

  const navigationState = location.state ?? {}
  const effectiveMyMemberId = myMemberId

  useEffect(() => {
    if (!entryCode) return
    fetchRoom(entryCode).catch(() => {})
  }, [entryCode, fetchRoom])

  const hasServerResult = status === 'FINISHED' && String(room?.entryCode) === String(entryCode)

  const result = useMemo(() => {
    if (hasServerResult) {
      if (winnerMemberId === null || winnerMemberId === undefined) {
        return 'draw'
      }
      return isSameMember(winnerMemberId, effectiveMyMemberId) ? 'win' : 'lose'
    }
    return navigationState.result ?? null
  }, [hasServerResult, winnerMemberId, effectiveMyMemberId, navigationState.result])

  const handleGoHome = () => {
    resetRoomState()
    navigate('/rooms', { replace: true })
  }

  const handleConfirm = () => {
    navigate(`/rooms/${entryCode}/game`, { state: { fromResult: true } })
  }

  if (isRoomLoading && !result) {
    return (
      <MobileShell bgColor="bg-white">
        <main className="flex min-h-dvh items-center justify-center px-5 sm:min-h-full">
          <p className="font-black text-gray-500">결과를 불러오는 중입니다...</p>
        </main>
      </MobileShell>
    )
  }

  if (error && !result) {
    return (
      <MobileShell bgColor="bg-white">
        <main className="safe-bottom flex min-h-dvh flex-col items-center justify-center gap-6 px-5 sm:min-h-full">
          <p className="text-center font-black text-[#9C3434]">{error}</p>
          <button type="button" onClick={handleGoHome} className="w-full max-w-[240px] rounded-full bg-[#00D0B3] py-4 text-base font-black text-white hover:opacity-90">
            돌아가기
          </button>
        </main>
      </MobileShell>
    )
  }

  if (!result) {
    return (
      <MobileShell bgColor="bg-white">
        <main className="safe-bottom flex min-h-dvh flex-col items-center justify-center gap-6 px-5 sm:min-h-full">
          <p className="font-black text-gray-500">게임 결과를 찾을 수 없습니다.</p>
          <button type="button" onClick={handleGoHome} className="w-full max-w-[240px] rounded-full bg-[#00D0B3] py-4 text-base font-black text-white hover:opacity-90">
            돌아가기
          </button>
        </main>
      </MobileShell>
    )
  }

  const currentAssets = RESULT_ASSETS[result] ?? RESULT_ASSETS.draw

  return (
    <MobileShell bgColor="bg-white">
      <main className="safe-bottom flex min-h-dvh flex-col items-center px-5 pt-[clamp(56px,10dvh,96px)] sm:min-h-full">
        
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-[clamp(20px,5dvh,40px)]">
          <div className="flex min-h-[80px] items-center justify-center">
            <h1 className="pixel-title text-[clamp(48px,17vw,72px)] font-black text-[#211A35]">
              {currentAssets.text}
            </h1>
          </div>
          <div className="flex h-[clamp(210px,36dvh,300px)] w-full items-end justify-center">
            <img 
              src={currentAssets.mascot} 
              alt={`${result} mascot`} 
              className="max-h-full max-w-full object-contain" 
              style={{ imageRendering: 'pixelated' }} 
            />
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleConfirm} 
          className="mt-6 w-full max-w-[240px] rounded-full bg-[#00D0B3] py-4 text-base font-black text-white transition-opacity hover:opacity-90"
        >
          확인
        </button>
      </main>
    </MobileShell>
  )
}

export default ResultPage
