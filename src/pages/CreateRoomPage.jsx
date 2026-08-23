import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileShell from '../components/MobileShell'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import useGameStore from '../features/game/model/gameStore'

import studyImg from '../assets/study.png'
import workoutImg from '../assets/workout.png'
import healthImg from '../assets/health.png'
import hobbyImg from '../assets/hobby.png'
import lifeImg from '../assets/life.png'

const categories = [
  { apiValue: 'STUDY', icon: studyImg, title: '공부' },
  { apiValue: 'WORKOUT', icon: workoutImg, title: '운동' },
  { apiValue: 'HEALTH', icon: healthImg, title: '건강' },
  { apiValue: 'HOBBY', icon: hobbyImg, title: '취미' },
  { apiValue: 'LIFE', icon: lifeImg, title: '일상생활' },
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
      navigate('/rooms', { replace: true })
    } catch (createError) {
      console.error('방 생성 실패:', createError)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <MobileShell bgColor="bg-white">
      <div className="flex min-h-dvh flex-col sm:min-h-full">
        <PageHeader title="방 만들기" onBack={() => navigate('/rooms')} />
        <main className="safe-bottom flex flex-1 flex-col px-5 pt-5 text-center min-[380px]:px-6 min-[380px]:pt-8">
        
        {/* Room Name Input */}
        <section className="mb-8 flex w-full flex-col items-start px-1 min-[380px]:mb-10 min-[380px]:px-2">
          <label htmlFor="roomName" className="pixel-title text-xl font-black text-[#171717]">방 이름을 입력하세요</label>
          <input
            id="roomName" 
            value={roomName} 
            onChange={(event) => setRoomName(event.target.value.slice(0, 20))} 
            className="pixel-input mt-4 w-full text-left text-base font-bold min-[380px]:mt-5 min-[380px]:text-lg"
            placeholder="갓생 도전" 
          />
        </section>

        {/* Categories */}
        <section className="flex w-full flex-col items-center px-1 min-[380px]:px-2">
          <h2 className="mb-5 self-start pixel-title text-xl font-black text-[#171717] min-[380px]:mb-6">카테고리를 선택하세요</h2>
          <div className="grid w-full grid-cols-2 gap-3 min-[380px]:grid-cols-3 min-[380px]:gap-4">
            {categories.map((category) => (
              <button 
                key={category.apiValue} 
                type="button" 
                onClick={() => setSelectedCategory(category)} 
                className={`flex min-h-[104px] min-w-0 flex-col items-center justify-center gap-2 rounded-3xl border-[3px] p-2 transition-all min-[380px]:min-h-[120px] min-[380px]:gap-3 ${selectedCategory?.apiValue === category.apiValue ? 'border-[#00D0B3] bg-[#E5FAF7] scale-[1.03] shadow-md' : 'border-[#F1F2F5] bg-[#F8F9FB]'}`}
              >
                <img src={category.icon} alt={category.title} className="h-11 w-11 object-contain min-[380px]:h-[52px] min-[380px]:w-[52px]" />
                <span className="break-keep text-xs font-black text-[#171717] min-[380px]:text-sm">{category.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mt-8 flex items-center justify-center gap-2 rounded-full bg-black/50 px-5 py-3 text-xs font-black text-white w-fit mx-auto">
            <span className="text-yellow-400">⚠️</span>
            이미 사용중인 방 이름이에요. 다시 시도해주세요.
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="button" 
          onClick={handleCreate} 
          disabled={!selectedCategory || !roomName.trim() || isProcessing} 
          className="mx-auto mt-8 w-full max-w-[240px] min-[380px]:mt-10"
        >
          {isProcessing ? '방 준비 중...' : '방 생성하기'}
        </Button>
        </main>
      </div>
    </MobileShell>
  )
}

export default CreateRoomPage
