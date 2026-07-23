import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RoomCodeCard from '../components/RoomCodeCard'
import CategoryOption from '../components/CategoryOption'
import useGameStore from '../stores/gameStore'

const categories = [
  {
    id: 1,
    apiValue: 'STUDY',
    icon: '📚',
    title: '공부',
    description: '교재 1챕터 읽기 · 플래시카드 외우기 · 노트 정리하기',
  },
  {
    id: 2,
    apiValue: 'EXERCISE',
    icon: '💪',
    title: '운동',
    description: '팔굽혀펴기 20개 · 30분 달리기 · 10분 스트레칭',
  },
  {
    id: 3,
    apiValue: 'HEALTH',
    icon: '🌿',
    title: '건강',
    description: '명상 10분 · 균형 잡힌 식사 · 일찍 잠들기',
  },
  {
    id: 4,
    apiValue: 'HOBBY',
    icon: '🎨',
    title: '취미',
    description: '새 곡 연습하기 · 책 읽기 · 요리하기',
  },
  {
    id: 5,
    apiValue: 'LIFE',
    icon: '🏠',
    title: '일상생활',
    description: '방 정리하기 · 이메일 정리 · 하루 계획 세우기',
  },
]

function CreateRoomPage() {
  const navigate = useNavigate()
  const hasCreatedRoom = useRef(false)

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isStarting, setIsStarting] = useState(false)

  const room = useGameStore((state) => state.room)

  const createNewRoom = useGameStore(
    (state) => state.createNewRoom,
  )

  const selectCategory = useGameStore(
    (state) => state.selectCategory,
  )

  const enterRoom = useGameStore(
    (state) => state.enterRoom,
  )

  const fetchRoom = useGameStore(
    (state) => state.fetchRoom,
  )

  const isLoading = useGameStore(
    (state) => state.isLoading,
  )

  const error = useGameStore(
    (state) => state.error,
  )

  const isProcessing =
    isLoading || isStarting

  useEffect(() => {
    const createRoomOnPageEnter = async () => {
      if (hasCreatedRoom.current) {
        return
      }

      hasCreatedRoom.current = true

      try {
        await createNewRoom()
      } catch (createRoomError) {
        console.error(
          '방 생성 요청 실패:',
          createRoomError,
        )
      }
    }

    createRoomOnPageEnter()
  }, [createNewRoom])

  const handleCategorySelect = (
    category,
  ) => {
    if (isProcessing) {
      return
    }

    setSelectedCategory(category)
  }

  const handleStartGame = async () => {
    if (
      !selectedCategory ||
      !room?.entryCode ||
      isProcessing
    ) {
      return
    }

    const entryCode = room.entryCode

    try {
      setIsStarting(true)

      /*
       * 1. 방 카테고리 설정
       * PATCH /api/rooms/{entryCode}/category
       */
      await selectCategory(
        entryCode,
        selectedCategory.apiValue,
      )

      /*
       * 2. 방 생성자를 플레이어로 등록
       * POST /api/rooms/{entryCode}/players
       */
      await enterRoom(entryCode)

      /*
       * 3. 등록된 플레이어, 미션, 턴 정보 조회
       * GET /api/rooms/{entryCode}
       */
      await fetchRoom(entryCode)

      /*
       * 4. 모든 요청이 성공한 후 게임보드 이동
       */
      navigate(
        `/rooms/${entryCode}/game`,
      )
    } catch (startGameError) {
      console.error(
        '게임 시작 준비 실패:',
        startGameError.response?.status,
        startGameError.response?.data,
        startGameError,
      )
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F4FF]">
      <header className="flex h-16 items-center justify-between bg-white px-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xl font-extrabold"
        >
          <span className="text-[#8B00F5]">
            Play
          </span>

          <span className="text-[#211A35]">
            Bit
          </span>
        </button>

        <p className="text-sm font-medium text-[#74698E]">
          방 만들기
        </p>

        <div className="w-[62px]" />
      </header>

      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <RoomCodeCard
            roomCode={
              room?.entryCode ?? '------'
            }
          />

          <section className="rounded-xl border border-[#FFD98A] bg-[#FFF9E8] px-5 py-4">
            <p className="text-xs leading-5 text-[#E18424]">
              ⚠️ 방 코드를 저장하세요.
              두 플레이어 모두 이 코드로
              게임에 입장해야 합니다.
            </p>
          </section>

          <button
            type="button"
            disabled={
              !selectedCategory ||
              isProcessing ||
              !room?.entryCode
            }
            onClick={handleStartGame}
            className={`h-12 rounded-xl text-sm font-semibold transition ${
              selectedCategory &&
              room?.entryCode &&
              !isProcessing
                ? 'bg-[#8B00F5] text-white hover:bg-[#7700D4]'
                : 'cursor-not-allowed bg-[#EEE8FF] text-[#9A8EBB]'
            }`}
          >
            {isProcessing
              ? '게임방 준비 중...'
              : selectedCategory
                ? `${selectedCategory.title} 카테고리로 시작하기`
                : '카테고리를 선택해주세요'}
          </button>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#302842]">
              카테고리 선택
            </h2>

            <span className="rounded-full bg-[#EEE8FF] px-2 py-1 text-[10px] text-[#8B00F5]">
              {selectedCategory
                ? '1개 선택'
                : '0개 선택'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {categories.map(
              (category) => (
                <CategoryOption
                  key={category.id}
                  icon={category.icon}
                  title={category.title}
                  description={
                    category.description
                  }
                  isSelected={
                    selectedCategory?.id ===
                    category.id
                  }
                  onClick={() =>
                    handleCategorySelect(
                      category,
                    )
                  }
                />
              ),
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default CreateRoomPage