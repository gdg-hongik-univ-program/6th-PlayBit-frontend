import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRooms } from '../api/roomApi'
import MobileShell from '../components/MobileShell'
import PageHeader from '../components/PageHeader'
import useGameStore from '../features/game/model/gameStore'

import homeBg from '../assets/home-bg.jpg'
import enterRoomImg from '../assets/enterRoom.png'
import chevronRightImg from '../assets/chevron-right.png'
import plusButtonImg from '../assets/plus-button.png'

function RoomListPage() {
  const navigate = useNavigate()
  const fetchRoom = useGameStore((state) => state.fetchRoom)
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    getRooms()
      .then((data) => {
        if (isActive) {
          setRooms(data.roomInfos ?? [])
        }
      })
      .catch((loadError) => {
        console.error('방 목록 조회 실패:', loadError)

        if (isActive) {
          setError(
            loadError.message ||
              '방 목록을 불러오지 못했습니다.',
          )
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const handleOpenRoom = async (roomInfo) => {
    try {
      setError('')
      await fetchRoom(roomInfo.entryCode)

      navigate(
        roomInfo.roomStatus === 'FINISHED'
          ? `/rooms/${roomInfo.entryCode}/result`
          : `/rooms/${roomInfo.entryCode}/game`,
      )
    } catch (openError) {
      console.error('방 조회 실패:', openError)
      setError(
        openError.message ||
          '방 정보를 불러오지 못했습니다.',
      )
    }
  }

  return (
    <MobileShell bgColor="bg-transparent">
      <div 
        className="relative flex min-h-dvh flex-col sm:h-full sm:min-h-0"
        style={{ backgroundImage: `url(${homeBg})`, backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }}
      >
        <div className="absolute inset-0 bg-white/75"></div>
        
        <div className="relative z-10 flex h-full flex-col">
          <PageHeader
            title="방 목록"
            onBack={() => navigate('/lobby')}
            action={
              <button
                type="button"
                onClick={() => navigate('/join-room')}
                className="flex h-[34px] items-center justify-center hover:opacity-80 transition-opacity"
              >
                <img src={enterRoomImg} alt="방 입장" className="h-full object-contain" />
              </button>
            }
          />

          <main className="flex-1 px-5 pb-8 pt-4 overflow-y-auto">

            {error && (
              <p className="mb-4 rounded-xl bg-[#535F8B] px-4 py-3 text-xs font-bold text-white shadow-md">
                ⚠ {error}
              </p>
            )}

            {isLoading ? (
              <div className="rounded-3xl bg-[#96E4D6] p-8 text-center text-xs font-black shadow-sm">
                방 목록을 불러오는 중...
              </div>
            ) : rooms.length > 0 ? (
              <div className="space-y-4">
                {rooms.map((roomInfo) => (
                  <article
                    key={roomInfo.entryCode}
                    className="flex flex-col gap-4 rounded-[20px] bg-[#96E4D6] p-5 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                    onClick={() => handleOpenRoom(roomInfo)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[13px] font-black">
                        {roomInfo.roomName || '이름 없는 방'}
                      </p>
                      <span className="text-[11px] font-black">
                        {roomInfo.roomStatus}
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(roomInfo.entryCode)
                        }}
                        className="text-[13px] font-black hover:opacity-70 transition-opacity active:scale-95"
                        title="클릭하여 복사"
                      >
                        {roomInfo.entryCode}
                      </button>
                      <div className="flex h-5 w-5 items-center justify-center">
                        <img src={chevronRightImg} alt="입장" className="h-full w-full object-contain" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] bg-[#96E4D6] p-8 text-center shadow-sm">
                <p className="text-3xl">☁</p>
                <p className="mt-3 text-sm font-black">
                  아직 참여한 방이 없어요
                </p>
                <p className="mt-2 text-xs opacity-70">
                  새 방을 만들거나 코드를 입력해보세요.
                </p>
              </div>
            )}

            <div className="mt-6 flex w-full">
              <button
                type="button"
                onClick={() => navigate('/rooms/create')}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-[20px] border-[3px] border-dashed border-[#53608B] bg-[#96E4D6] py-5 shadow-sm hover:opacity-90 transition-opacity"
              >
                <div className="flex h-10 w-10 items-center justify-center">
                  <img src={plusButtonImg} alt="새 방 만들기 아이콘" className="h-full w-full object-contain" />
                </div>
                <span className="text-sm font-black text-[#53608B]">새 방 만들기</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </MobileShell>
  )
}

export default RoomListPage
