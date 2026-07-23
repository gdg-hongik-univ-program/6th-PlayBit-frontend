import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import useGameStore from '../stores/gameStore'
import GameBoard from '../components/GameBoard'

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

  const isLoading = useGameStore(
    (state) => state.isLoading,
  )

  const error = useGameStore(
    (state) => state.error,
  )

  const fetchRoom = useGameStore(
    (state) => state.fetchRoom,
  )

  /*
   * 서버에서 myMemberId를 주지 않는 상황을 대비하여
   * localStorage의 uuid를 보조값으로 사용합니다.
   */
  const effectiveMyMemberId =
    myMemberId ??
    localStorage.getItem('uuid')

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
   * 최초 게임 페이지 진입 시 방 정보를 조회합니다.
   */
  useEffect(() => {
    if (!entryCode) {
      return
    }

    fetchRoom(entryCode).catch(() => {
      // 오류 상태는 gameStore에서 처리합니다.
    })
  }, [entryCode, fetchRoom])

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
    isLoading &&
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
    <div className="min-h-screen bg-[#F7F4FF]">
      <header className="flex h-16 items-center justify-between bg-white px-8 shadow-sm">
        <button
          type="button"
          onClick={() =>
            navigate('/')
          }
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
          게임 보드
        </p>

        <div className="w-[62px]" />
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#211A35]">
                게임 보드
              </h1>

              <p className="mt-1 text-sm text-[#8175A5]">
                3개의 미션을 한 줄로
                완성하면 승리합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-[#EEE8FF] px-5 py-3 text-center">
              <p className="text-xs font-semibold text-[#8B00F5]">
                입장 코드
              </p>

              <p className="mt-1 text-xl font-black tracking-widest text-[#211A35]">
                {entryCode}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">
                내 역할
              </p>

              <p className="mt-1 text-xl font-black text-[#8B00F5]">
                {effectiveMyRole ?? '-'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">
                게임 상태
              </p>

              <p className="mt-1 text-sm font-bold text-[#211A35]">
                {status}
              </p>

              {currentTurnNumber !==
                null && (
                <p className="mt-1 text-xs text-[#8175A5]">
                  {currentTurnNumber}번째
                  턴
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">
                현재 턴
              </p>

              <p className="mt-1 text-sm font-bold text-[#211A35]">
                {currentTurnPlayer
                  ? `${currentTurnPlayer.role} 턴`
                  : '-'}
              </p>

              <p className="mt-1 text-xs text-[#8175A5]">
                {currentTurnPlayer
                  ? isMyTurn
                    ? '내 턴입니다'
                    : '상대 턴입니다'
                  : '게임 시작 대기 중'}
              </p>

              {currentTurnSabotaged && (
                <p className="mt-1 text-xs font-semibold text-red-500">
                  이번 턴 사보타주 사용됨
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">
                남은 시간
              </p>

              <p className="mt-1 text-sm font-bold text-[#211A35]">
                {formatRemainingTime(
                  remainingSeconds,
                )}
              </p>
            </div>
          </div>
        </section>

        <GameBoard
          entryCode={entryCode}
          missions={missions}
          players={players}
          disabled={
            status !== 'PLAYING' ||
            !effectiveMyMemberId
          }
        />
      </main>
    </div>
  )
}

export default GamePage