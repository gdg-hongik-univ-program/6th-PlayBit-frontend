import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  if (seconds === null || seconds === undefined) return '-'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return `${hours}시간 ${minutes}분`
}

const getMissionOwnerRole = (mission, players) => {
  const directRole =
    mission.completedByRole ??
    mission.ownerRole ??
    mission.playerRole ??
    mission.role ??
    null

  if (directRole) return directRole

  const ownerMemberId =
    mission.completedMemberId ??
    mission.completedByMemberId ??
    mission.ownerMemberId ??
    mission.completedBy ??
    mission.ownerId ??
    null

  if (!ownerMemberId) return null

  const ownerPlayer = players.find(
    (player) => player.memberId === ownerMemberId,
  )

  return ownerPlayer?.role ?? null
}

const createBoardFromMissions = (missions, players) => {
  const board = Array(9).fill(null)

  missions.slice(0, 9).forEach((mission) => {
    const position = mission.position

    if (position < 0 || position > 8) return

    board[position] = getMissionOwnerRole(mission, players)
  })

  return board
}

const getWinningLine = (board, role) => {
  return (
    WINNING_LINES.find((line) =>
      line.every((index) => board[index] === role),
    ) ?? null
  )
}

const getMissionCount = (board, role) => {
  return board.filter((cell) => cell === role).length
}

const getGameResult = ({ board, myRole, players }) => {
  if (!myRole || players.length < 2) {
    return null
  }

  const opponent = players.find((player) => player.role !== myRole)

  if (!opponent) {
    return null
  }

  const myWinningLine = getWinningLine(board, myRole)
  const opponentWinningLine = getWinningLine(board, opponent.role)

  if (myWinningLine) {
    return {
      result: 'win',
      winningLine: myWinningLine,
    }
  }

  if (opponentWinningLine) {
    return {
      result: 'lose',
      winningLine: opponentWinningLine,
    }
  }

  const isBoardFull = board.every((cell) => cell !== null)

  if (isBoardFull) {
    return {
      result: 'draw',
      winningLine: [],
    }
  }

  return null
}

function GamePage() {
  const { entryCode } = useParams()
  const navigate = useNavigate()

  const missions = useGameStore((state) => state.missions)
  const players = useGameStore((state) => state.players)
  const turn = useGameStore((state) => state.turn)
  const myRole = useGameStore((state) => state.myRole)
  const status = useGameStore((state) => state.status)
  const isLoading = useGameStore((state) => state.isLoading)
  const error = useGameStore((state) => state.error)
  const fetchRoom = useGameStore((state) => state.fetchRoom)

  const board = useMemo(() => {
    return createBoardFromMissions(missions, players)
  }, [missions, players])

  const gameResult = useMemo(() => {
    return getGameResult({
      board,
      myRole,
      players,
    })
  }, [board, myRole, players])

  useEffect(() => {
    if (!entryCode) return

    fetchRoom(entryCode)
  }, [entryCode, fetchRoom])

  useEffect(() => {
    if (status !== 'FINISHED' && !gameResult) {
      return
    }

    const playerMissionCount = myRole ? getMissionCount(board, myRole) : 0

    const opponentPlayer = players.find((player) => player.role !== myRole)

    const opponentMissionCount = opponentPlayer
      ? getMissionCount(board, opponentPlayer.role)
      : 0

    navigate(`/rooms/${entryCode}/result`, {
      state: {
        result: gameResult?.result ?? 'draw',
        playerMissionCount,
        opponentMissionCount,
        winningLine: gameResult?.winningLine ?? [],
      },
    })
  }, [status, gameResult, board, myRole, players, entryCode, navigate])

  const myPlayer = players.find((player) => player.role === myRole)

  const currentTurnPlayer = players.find(
    (player) => player.memberId === turn?.currentTurnMemberId,
  )

  const isMyTurn =
    Boolean(turn) &&
    Boolean(myPlayer) &&
    turn.currentTurnMemberId === myPlayer.memberId

  if (isLoading && missions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4FF] text-[#302842]">
        게임 정보를 불러오는 중입니다...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4FF] text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F4FF]">
      <header className="flex h-16 items-center justify-between bg-white px-8 shadow-sm">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xl font-extrabold"
        >
          <span className="text-[#8B00F5]">Play</span>
          <span className="text-[#211A35]">Bit</span>
        </button>

        <p className="text-sm font-medium text-[#74698E]">게임 보드</p>

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
                3개의 미션을 한 줄로 완성하면 승리합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-[#EEE8FF] px-5 py-3 text-center">
              <p className="text-xs font-semibold text-[#8B00F5]">입장 코드</p>
              <p className="mt-1 text-xl font-black tracking-widest text-[#211A35]">
                {entryCode}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">내 역할</p>
              <p className="mt-1 text-xl font-black text-[#8B00F5]">
                {myRole ?? '-'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">게임 상태</p>
              <p className="mt-1 text-sm font-bold text-[#211A35]">
                {status}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">현재 턴</p>
              <p className="mt-1 text-sm font-bold text-[#211A35]">
                {currentTurnPlayer ? `${currentTurnPlayer.role} 턴` : '-'}
              </p>
              <p className="mt-1 text-xs text-[#8175A5]">
                {isMyTurn ? '내 턴입니다' : '상대 턴입니다'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-4">
              <p className="text-xs text-[#8175A5]">남은 시간</p>
              <p className="mt-1 text-sm font-bold text-[#211A35]">
                {formatRemainingTime(turn?.remainingSeconds)}
              </p>
            </div>
          </div>
        </section>

        <GameBoard
          entryCode={entryCode}
          missions={missions}
          players={players}
          myRole={myRole}
          isMyTurn={isMyTurn}
        />
      </main>
    </div>
  )
}

export default GamePage