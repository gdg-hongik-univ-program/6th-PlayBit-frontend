import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RoomCodeCard from '../components/RoomCodeCard'
import CategoryOption from '../components/CategoryOption'

const categories = [
  {
    id: 1,
    icon: '📚',
    title: '공부',
    description: '교재 1챕터 읽기 · 플래시카드 외우기 · 노트 정리하기',
  },
  {
    id: 2,
    icon: '💪',
    title: '운동',
    description: '팔굽혀펴기 20개 · 30분 달리기 · 10분 스트레칭',
  },
  {
    id: 3,
    icon: '🌿',
    title: '건강',
    description: '명상 10분 · 균형 잡힌 식사 · 일찍 잠들기',
  },
  {
    id: 4,
    icon: '🎨',
    title: '취미',
    description: '새 곡 연습하기 · 책 읽기 · 요리하기',
  },
  {
    id: 5,
    icon: '🏠',
    title: '일상생활',
    description: '방 정리하기 · 이메일 정리 · 하루 계획 세우기',
  },
]

const createRoomCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''

  for (let i = 0; i < 6; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters[randomIndex]
  }

  return code
}

function CreateRoomPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [roomCode] = useState(() => createRoomCode())

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    console.log(`${category.title} 카테고리가 선택되었습니다.`)
  }

  const handleStartGame = () => {
    if (!selectedCategory) return

    navigate('/game')
  }

  return (
    <div className="min-h-screen bg-[#F7F4FF]">
      <header className="flex h-16 items-center justify-between bg-white px-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xl font-extrabold"
        >
          <span className="text-[#8B00F5]">Play</span>
          <span className="text-[#211A35]">Bit</span>
        </button>

        <p className="text-sm font-medium text-[#74698E]">방 만들기</p>

        <div className="w-[62px]" />
      </header>

      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <RoomCodeCard roomCode={roomCode} />

          <section className="rounded-xl border border-[#FFD98A] bg-[#FFF9E8] px-5 py-4">
            <p className="text-xs leading-5 text-[#E18424]">
              ⚠️ 방 코드를 저장하세요. 두 플레이어 모두 이 코드로 게임에
              입장해야 합니다.
            </p>
          </section>

          <button
            type="button"
            disabled={!selectedCategory}
            onClick={handleStartGame}
            className={`h-12 rounded-xl text-sm font-semibold ${
              selectedCategory
                ? 'bg-[#8B00F5] text-white'
                : 'cursor-not-allowed bg-[#EEE8FF] text-[#9A8EBB]'
            }`}
          >
            {selectedCategory
              ? `${selectedCategory.title} 카테고리로 시작하기`
              : '카테고리를 선택해주세요'}
          </button>
        </div>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#302842]">
              카테고리 선택
            </h2>

            <span className="rounded-full bg-[#EEE8FF] px-2 py-1 text-[10px] text-[#8B00F5]">
              {selectedCategory ? '1개 선택' : '0개 선택'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {categories.map((category) => (
              <CategoryOption
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                isSelected={selectedCategory?.id === category.id}
                onClick={() => handleCategorySelect(category)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default CreateRoomPage