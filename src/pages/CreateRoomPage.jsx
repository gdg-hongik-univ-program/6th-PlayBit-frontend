import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileShell from '../components/MobileShell'
import PageHeader from '../components/PageHeader'
import useGameStore from '../features/game/model/gameStore'

const categories = [
  { apiValue: 'STUDY', icon: '📚', title: '공부' },
  { apiValue: 'WORKOUT', icon: '💪', title: '운동' },
  { apiValue: 'HEALTH', icon: '🌿', title: '건강' },
  { apiValue: 'HOBBY', icon: '🎨', title: '취미' },
  { apiValue: 'LIFE', icon: '🏠', title: '일상생활' },
]

function CreateRoomPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [roomName, setRoomName] = useState('')
  const [isStarting, setIsStarting] = useState(false)
  const createNewRoom = useGameStore((state) => state.createNewRoom)
  const enterRoom = useGameStore((state) => state.enterRoom)
  const fetchRoom = useGameStore((state) => state.fetchRoom)
  const isRoomLoading = useGameStore((state) => state.isRoomLoading)
  const error = useGameStore((state) => state.error)
  const isProcessing = isRoomLoading || isStarting

  const handleCreate = async () => {
    if (!selectedCategory || !roomName.trim() || isProcessing) return
    try {
      setIsStarting(true)
      const roomData = await createNewRoom({
        category: selectedCategory.apiValue,
        roomName: roomName.trim(),
      })
      await enterRoom(roomData.entryCode)
      await fetchRoom(roomData.entryCode)
      navigate(`/rooms/${roomData.entryCode}/game`)
    } catch (createError) {
      console.error('게임 시작 준비 실패:', createError)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <MobileShell>
      <PageHeader title="방 만들기" onBack={() => navigate('/rooms')} />
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col px-5 pb-8 pt-4">
        <section>
          <div className="flex items-center justify-between"><h2 className="text-xs font-black">카테고리 선택</h2><span className="text-[9px] text-[#687292]">선택해주세요</span></div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button key={category.apiValue} type="button" onClick={() => setSelectedCategory(category)} className={`pixel-card flex min-h-20 flex-col items-center justify-center gap-2 p-3 text-xs font-black ${selectedCategory?.apiValue === category.apiValue ? '!border-[#4559AE] !bg-[#E8ECFF]' : ''}`}><span className="text-2xl">{category.icon}</span>{category.title}</button>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <label htmlFor="roomName" className="text-xs font-black">방 이름을 입력하세요</label>
          <input id="roomName" value={roomName} onChange={(event) => setRoomName(event.target.value.slice(0, 20))} className="pixel-input mt-3" placeholder="바나나 치" />
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#535F8B] px-4 py-3 text-[10px] font-bold text-white"><span>⚠ 이미 사용중인 방 이름이면 다시 시도해주세요.</span></div>
        </section>
        <section className="pixel-card mt-6 px-4 py-3"><p className="text-[10px] font-bold text-[#707996]">방을 생성하면 친구에게 공유할 6자리 입장 코드가 자동으로 발급됩니다.</p></section>
        {error && <p className="mt-4 text-xs font-bold text-[#9C3434]">{error}</p>}
        <button type="button" onClick={handleCreate} disabled={!selectedCategory || !roomName.trim() || isProcessing} className="pixel-button mt-auto w-full">{isProcessing ? '방 준비 중...' : '방 생성하기'}</button>
      </main>
    </MobileShell>
  )
}

export default CreateRoomPage
