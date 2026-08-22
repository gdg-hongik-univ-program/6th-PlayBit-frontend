import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileShell from '../components/MobileShell'
import PageHeader from '../components/PageHeader'
import useGameStore from '../features/game/model/gameStore'

function JoinRoomPage() {
  const navigate = useNavigate()
  const [entryCode, setEntryCode] = useState('')
  const [validationError, setValidationError] = useState('')
  const enterRoom = useGameStore((state) => state.enterRoom)
  const fetchRoom = useGameStore((state) => state.fetchRoom)
  const isRoomLoading = useGameStore((state) => state.isRoomLoading)
  const storeError = useGameStore((state) => state.error)
  const clearError = useGameStore((state) => state.clearError)

  const handleCodeChange = (event) => {
    setEntryCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
    setValidationError('')
    clearError()
  }

  const handleJoinRoom = async (event) => {
    event.preventDefault()
    if (entryCode.length !== 6) {
      setValidationError('6자리 방 코드를 입력해주세요.')
      return
    }
    try {
      await enterRoom(entryCode)
      await fetchRoom(entryCode)
      navigate(`/rooms/${entryCode}/game`)
    } catch (error) {
      console.error('플레이어 등록 실패:', error)
    }
  }

  return (
    <MobileShell>
      <PageHeader title="방으로 입장" onBack={() => navigate('/rooms')} />
      <form onSubmit={handleJoinRoom} className="flex min-h-[calc(100dvh-4rem)] flex-col px-5 pb-8 pt-20">
        <h1 className="pixel-title text-2xl font-black">방 코드를 입력하세요</h1>
        <p className="mt-3 break-keep text-xs leading-5 text-[#5D6686]">친구에게 받은 6자리 코드를 입력하면 게임방에 참여할 수 있어요.</p>
        <label htmlFor="entryCode" className="mt-9 text-xs font-black">입장 코드</label>
        <input id="entryCode" value={entryCode} onChange={handleCodeChange} className="pixel-input mt-3 text-center text-xl font-black uppercase tracking-[0.35em]" placeholder="ABC123" autoFocus />
        {(validationError || storeError) && <p className="mt-3 rounded-xl bg-[#535F8B] px-4 py-3 text-xs font-bold text-white">⚠ {validationError || storeError}</p>}
        <button type="submit" disabled={entryCode.length !== 6 || isRoomLoading} className="pixel-button mt-4 w-full">{isRoomLoading ? '입장 중...' : '입장하기'}</button>
        <div className="mt-auto text-center text-7xl opacity-30">→</div>
      </form>
    </MobileShell>
  )
}

export default JoinRoomPage
