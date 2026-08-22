import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileShell from '../components/MobileShell'

import useGameStore from '../features/game/model/gameStore'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'

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
    <MobileShell bgColor="bg-white">
      <PageHeader title="방 입장하기" onBack={() => navigate('/rooms')} />
      <form onSubmit={handleJoinRoom} className="flex flex-col items-center px-6 pt-4 pb-12 sm:min-h-0" style={{ minHeight: 'calc(100dvh - 4rem)' }}>
        <label htmlFor="entryCode" className="mt-6 self-start pixel-title text-[22px] font-black tracking-tight text-[#171717]">
          방 코드를 입력하세요
        </label>
        <p className="mt-4 self-start text-sm font-black leading-relaxed text-gray-500">
          상대방에게 공유받은 6자리 코드를 입력하면<br />
          게임에 참여할 수 있어요
        </p>
        
        <input 
          id="entryCode" 
          value={entryCode} 
          onChange={handleCodeChange} 
          className="pixel-input mt-8 w-full text-center text-xl font-black uppercase tracking-[0.35em]" 
          placeholder="ABC123" 
          autoFocus 
        />
        
        <Button 
          type="submit" 
          disabled={entryCode.length !== 6 || isRoomLoading} 
          className="mt-6"
        >
          {isRoomLoading ? '참여 중...' : '참여하기'}
        </Button>
        
        {(validationError || storeError) && (
          <div className="mt-4 flex w-full justify-center">
             <p className="rounded-xl bg-[#9C3434] px-4 py-3 text-xs font-bold text-white shadow-md">
               ⚠ {validationError || storeError}
             </p>
          </div>
        )}
      </form>
    </MobileShell>
  )
}

export default JoinRoomPage
