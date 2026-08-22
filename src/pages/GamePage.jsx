import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import useGameStore from '../features/game/model/gameStore'
import GameBoard from '../components/GameBoard'
import MobileShell from '../components/MobileShell'
import PixelMascot from '../components/PixelMascot'
import arrowIcon from '../assets/arrow-icon.png'

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
]

const formatRemainingTime = (seconds) => {
  if (
    seconds === null ||
    seconds === undefined
  ) {
    return '-'
  }

  const safeSeconds = Math.max(
    0,
    seconds,
  )

  const hours = Math.floor(
    safeSeconds / 3600,
  )

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  )

  return `${hours}시간 ${minutes}분`
}

const getMissionOwnerRole = (
  mission,
  players,
) => {
  const directRole =
    mission.completedByRole ??
    mission.ownerRole ??
    mission.playerRole ??
    mission.role ??
    null

  if (directRole) {
    return directRole
  }

  const ownerMemberId =
    mission.completedByMemberId ??
    mission.completedMemberId ??
    mission.ownerMemberId ??
    mission.completedBy ??
    mission.ownerId ??
    null

  if (
    ownerMemberId === null ||
    ownerMemberId === undefined
  ) {
    return null
  }

  const ownerPlayer = players.find(
    (player) =>
      String(player.memberId) ===
      String(ownerMemberId),
  )

  return ownerPlayer?.role ?? null
}

const createBoardFromMissions = (
  missions,
  players,
) => {
  const board = Array(9).fill(null)

  missions.forEach((mission) => {
    const position = Number(
      mission.position,
    )

    if (
      Number.isNaN(position) ||
      position < 0 ||
      position > 8
    ) {
      return
    }

    board[position] =
      getMissionOwnerRole(
        mission,
        players,
      )
  })

  return board
}

const getWinningLine = (
  board,
  role,
) => {
  if (!role) {
    return null
  }

  return (
    WINNING_LINES.find((line) =>
      line.every(
        (index) =>
          board[index] === role,
      ),
    ) ?? null
  )
}

const getMissionCount = (
  board,
  role,
) => {
  if (!role) {
    return 0
  }

  return board.filter(
    (cell) => cell === role,
  ).length
}

function GamePage() {
  const { entryCode } = useParams()
  const navigate = useNavigate()

  const missions = useGameStore(
    (state) => state.missions,
  )

  const players = useGameStore(
    (state) => state.players,
  )

  const myMemberId = useGameStore(
    (state) => state.myMemberId,
  )

  const myRole = useGameStore(
    (state) => state.myRole,
  )

  const currentTurnMemberId =
    useGameStore(
      (state) =>
        state.currentTurnMemberId,
    )

  const currentTurnNumber =
    useGameStore(
      (state) =>
        state.currentTurnNumber,
    )

  const currentTurnSabotaged =
    useGameStore(
      (state) =>
        state.currentTurnSabotaged,
    )

  const turnDeadline = useGameStore(
    (state) => state.turnDeadline,
  )

  const winnerMemberId =
    useGameStore(
      (state) =>
        state.winnerMemberId,
    )

  const status = useGameStore(
    (state) => state.status,
  )

  const isRoomLoading = useGameStore(
    (state) => state.isRoomLoading,
  )

  const error = useGameStore(
    (state) => state.error,
  )

  const fetchRoom = useGameStore(
    (state) => state.fetchRoom,
  )
  
  const connectRoomEvents = useGameStore(
  (state) => state.connectRoomEvents,
  )

  const disconnectRoomEvents =
  useGameStore(
    (state) =>
      state.disconnectRoomEvents,
  )
  
  const effectiveMyMemberId = myMemberId

const [currentTime, setCurrentTime] = useState(
  () => Date.now(),
)

useEffect(() => {
  if (
    !turnDeadline ||
    status !== 'PLAYING'
  ) {
    return undefined
  }

  const timerId = window.setInterval(() => {
    setCurrentTime(Date.now())
  }, 1000)

  return () => {
    window.clearInterval(timerId)
  }
}, [turnDeadline, status])

const remainingSeconds = useMemo(() => {
  if (!turnDeadline) {
    return null
  }

  const deadlineTime =
    new Date(turnDeadline).getTime()

  if (Number.isNaN(deadlineTime)) {
    return null
  }

  return Math.max(
    0,
    Math.floor(
      (deadlineTime - currentTime) / 1000,
    ),
  )
}, [turnDeadline, currentTime])

  const board = useMemo(() => {
    return createBoardFromMissions(
      missions,
      players,
    )
  }, [missions, players])

  const myPlayer = useMemo(() => {
    if (
      effectiveMyMemberId !== null &&
      effectiveMyMemberId !==
        undefined
    ) {
      const playerByMemberId =
        players.find(
          (player) =>
            String(
              player.memberId,
            ) ===
            String(
              effectiveMyMemberId,
            ),
        )

      if (playerByMemberId) {
        return playerByMemberId
      }
    }

    if (myRole) {
      return players.find(
        (player) =>
          player.role === myRole,
      )
    }

    return null
  }, [
    players,
    effectiveMyMemberId,
    myRole,
  ])

  const effectiveMyRole =
    myPlayer?.role ?? myRole ?? null

  const opponentPlayer =
    useMemo(() => {
      if (!myPlayer) {
        return null
      }

      return (
        players.find(
          (player) =>
            String(
              player.memberId,
            ) !==
            String(
              myPlayer.memberId,
            ),
        ) ?? null
      )
    }, [players, myPlayer])

  const currentTurnPlayer =
    useMemo(() => {
      if (
        currentTurnMemberId === null ||
        currentTurnMemberId ===
          undefined
      ) {
        return null
      }

      return (
        players.find(
          (player) =>
            String(
              player.memberId,
            ) ===
            String(
              currentTurnMemberId,
            ),
        ) ?? null
      )
    }, [
      players,
      currentTurnMemberId,
    ])

  const isMyTurn =
    status === 'PLAYING' &&
    effectiveMyMemberId !== null &&
    effectiveMyMemberId !==
      undefined &&
    currentTurnMemberId !== null &&
    currentTurnMemberId !==
      undefined &&
    String(currentTurnMemberId) ===
      String(effectiveMyMemberId)

/*
 * 게임 페이지 진입 시 현재 방 정보를 한 번 조회하고
 * 이후 변경 사항은 SSE로 실시간 수신합니다.
 */
useEffect(() => {
  if (!entryCode) {
    return undefined
  }

  const initializeRoom = async () => {
    try {
      /*
       * SSE를 먼저 시작해 최초 방 조회와 구독 사이에 발생하는
       * 두 번째 플레이어 입장 이벤트를 놓치지 않습니다.
       */
      connectRoomEvents(entryCode)

      /*
       * 페이지 최초 진입 시 현재 상태를 조회합니다.
       * SSE 연결 직후에도 한 번 더 동기화합니다.
       */
      await fetchRoom(entryCode)
    } catch (error) {
      console.error(
        '게임 페이지 초기화 오류:',
        error,
      )
    }
  }

  initializeRoom()

  /*
   * 게임 페이지를 벗어나면 SSE 연결을 종료합니다.
   */
  return () => {
    disconnectRoomEvents()
  }
}, [
  entryCode,
  fetchRoom,
  connectRoomEvents,
  disconnectRoomEvents,
])

/*
 * 서버가 플레이어 입장 이벤트를 누락하거나 프록시가 SSE 메시지를
 * 지연시키더라도 WAITING 화면에 고정되지 않도록 대기 중에만 보정합니다.
 * PLAYING으로 전환되는 즉시 타이머가 정리됩니다.
 */
useEffect(() => {
  if (!entryCode || status !== 'WAITING') {
    return undefined
  }

  const intervalId = window.setInterval(() => {
    fetchRoom(entryCode, {
      showLoading: false,
      clearError: false,
    }).catch((syncError) => {
      console.error(
        '대기 중 방 상태 동기화 실패:',
        syncError,
      )
    })
  }, 3000)

  return () => {
    window.clearInterval(intervalId)
  }
}, [entryCode, status, fetchRoom])

  /*
   * 게임 종료 결과를 서버의 winnerMemberId로 판단합니다.
   *
   * winnerMemberId가 null이면 무승부입니다.
   */
  const resultData = useMemo(() => {
    if (status !== 'FINISHED') {
      return null
    }

    let result = 'draw'

    if (
      winnerMemberId !== null &&
      winnerMemberId !== undefined
    ) {
      const isWinner =
        effectiveMyMemberId !==
          null &&
        effectiveMyMemberId !==
          undefined &&
        String(winnerMemberId) ===
          String(
            effectiveMyMemberId,
          )

      result = isWinner
        ? 'win'
        : 'lose'
    }

    const winnerPlayer =
      winnerMemberId !== null &&
      winnerMemberId !== undefined
        ? players.find(
            (player) =>
              String(
                player.memberId,
              ) ===
              String(
                winnerMemberId,
              ),
          )
        : null

    const winningLine =
      winnerPlayer
        ? getWinningLine(
            board,
            winnerPlayer.role,
          ) ?? []
        : []

    return {
      result,

      playerMissionCount:
        getMissionCount(
          board,
          effectiveMyRole,
        ),

      opponentMissionCount:
        getMissionCount(
          board,
          opponentPlayer?.role,
        ),

      winningLine,

      winnerMemberId:
        winnerMemberId ?? null,
    }
  }, [
    status,
    winnerMemberId,
    effectiveMyMemberId,
    effectiveMyRole,
    opponentPlayer,
    players,
    board,
  ])

  useEffect(() => {
    if (
      !entryCode ||
      !resultData
    ) {
      return
    }

    navigate(
      `/rooms/${entryCode}/result`,
      {
        replace: true,
        state: resultData,
      },
    )
  }, [
    entryCode,
    resultData,
    navigate,
  ])

  if (
    isRoomLoading &&
    missions.length === 0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4FF] text-[#302842]">
        게임 정보를 불러오는
        중입니다...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F7F4FF] px-6">
        <p className="text-center font-semibold text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate('/')
          }
          className="rounded-xl bg-[#8B00F5] px-5 py-3 text-sm font-bold text-white"
        >
          홈으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <MobileShell bgColor="bg-white">
      <header className="flex items-center justify-between px-4 pb-3 pt-[60px]">
        <button
          type="button"
          onClick={() => navigate('/rooms')}
          className="flex h-9 w-9 items-center justify-center hover:opacity-80 transition-opacity"
        >
          <img src={arrowIcon} alt="뒤로 가기" className="h-full w-full object-contain" />
        </button>
      </header>

      <main className="flex flex-col flex-1 px-5 pb-8 pt-4">
        <section className="mb-10 flex justify-between px-6">
          <div className="flex flex-col items-center">
            <p className="text-xs font-black">내 역할</p>
            <p className="mt-2 text-2xl font-black pixel-title">{effectiveMyRole ?? '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs font-black">현재 턴</p>
            <p className="mt-2 text-2xl font-black pixel-title">
              {currentTurnPlayer?.role ?? 
                (currentTurnMemberId 
                  ? (String(currentTurnMemberId) === String(effectiveMyMemberId) 
                      ? effectiveMyRole 
                      : (effectiveMyRole === 'X' ? 'O' : 'X'))
                  : '-')}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs font-black">남은 시간</p>
            <p className="mt-2 text-xl font-black pixel-title tracking-widest">{formatRemainingTime(remainingSeconds)}</p>
          </div>
        </section>

        <GameBoard
          entryCode={entryCode}
          missions={missions}
          players={players}
          disabled={status !== 'PLAYING' || !effectiveMyMemberId}
        />

        <div className="mt-auto flex items-end gap-3 px-2">
          <div className="w-[100px] flex-shrink-0">
            <PixelMascot size="custom" className="w-full" />
          </div>
          <div className="relative flex-1 rounded-[24px] rounded-bl-none bg-[#96E4D6] p-4 text-xs font-black leading-5 min-h-[100px] shadow-sm mb-4">
            <div className="absolute -bottom-4 left-0 w-0 h-0 border-t-[16px] border-t-[#96E4D6] border-r-[16px] border-r-transparent"></div>
            {isMyTurn ? '내 차례예요! 인증할 미션을 골라보세요.' : '상대 차례예요. 사보타주 기회를 노려보세요.'}
          </div>
        </div>
      </main>
    </MobileShell>
  )
}

export default GamePage

