import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRooms } from '../api/roomApi'
import MobileShell from '../components/MobileShell'
import PageHeader from '../components/PageHeader'
import useGameStore from '../features/game/model/gameStore'
import { leaveRoom } from '../services/playerService'

function RoomListPage() {
  const navigate = useNavigate()
  const fetchRoom = useGameStore((state) => state.fetchRoom)
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [leavingEntryCode, setLeavingEntryCode] = useState(null)
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

  const handleLeaveRoom = async (
    event,
    entryCode,
  ) => {
    event.stopPropagation()

    try {
      setLeavingEntryCode(entryCode)
      setError('')
      await leaveRoom(entryCode)
      setRooms((currentRooms) =>
        currentRooms.filter(
          (roomInfo) =>
            roomInfo.entryCode !== entryCode,
        ),
      )
    } catch (leaveError) {
      console.error('방 퇴장 실패:', leaveError)
      setError(
        leaveError.message ||
          '방에서 나가지 못했습니다.',
      )
    } finally {
      setLeavingEntryCode(null)
    }
  }

  return (
    <MobileShell>
      <PageHeader
        title="방 목록"
        onBack={() => navigate('/lobby')}
        action={
          <button
            type="button"
            onClick={() => navigate('/join-room')}
            className="rounded-full bg-[#6E82D7] px-3 py-2 text-[10px] font-black text-white"
          >
            입장
          </button>
        }
      />

      <main className="px-5 pb-8 pt-4">
        <p className="mb-5 text-xs font-bold text-[#4E587B]">
          참여한 게임방
        </p>

        {error && (
          <p className="mb-4 rounded-xl bg-[#535F8B] px-4 py-3 text-xs font-bold text-white">
            ⚠ {error}
          </p>
        )}

        {isLoading ? (
          <div className="pixel-card p-8 text-center text-xs font-black">
            방 목록을 불러오는 중...
          </div>
        ) : rooms.length > 0 ? (
          <div className="space-y-3">
            {rooms.map((roomInfo) => (
              <article
                key={roomInfo.entryCode}
                className="pixel-card flex items-center gap-3 p-4"
              >
                <button
                  type="button"
                  onClick={() => handleOpenRoom(roomInfo)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-black">
                      {roomInfo.roomName || '이름 없는 방'}
                    </p>
                    <span className="rounded-full bg-[#E8ECFF] px-2 py-1 text-[9px] font-black text-[#5264AD]">
                      {roomInfo.roomStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#69718C]">
                    입장 코드 · {roomInfo.entryCode}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={(event) =>
                    handleLeaveRoom(
                      event,
                      roomInfo.entryCode,
                    )
                  }
                  disabled={
                    leavingEntryCode === roomInfo.entryCode
                  }
                  className="rounded-lg px-2 py-2 text-[10px] font-black text-[#A14A4A] disabled:opacity-40"
                >
                  {leavingEntryCode === roomInfo.entryCode
                    ? '처리 중'
                    : '나가기'}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="pixel-card p-8 text-center">
            <p className="text-3xl">☁</p>
            <p className="mt-3 text-sm font-black">
              아직 참여한 방이 없어요
            </p>
            <p className="mt-2 text-xs text-[#707998]">
              새 방을 만들거나 코드를 입력해보세요.
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate('/rooms/create')}
            className="pixel-button"
          >
            ＋ 새 방 만들기
          </button>
          <button
            type="button"
            onClick={() => navigate('/join-room')}
            className="pixel-card min-h-12 text-sm font-black"
          >
            코드로 입장
          </button>
        </div>
      </main>
    </MobileShell>
  )
}

export default RoomListPage
