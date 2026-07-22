import { mockRoom } from '../data/mockRoom'
import { registerPlayerApi } from '../api/playerApi'

let roomState = structuredClone(mockRoom)

const delay = (ms = 300) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const SABOTAGE_PENALTY_SECONDS = 6 * 60 * 60

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
]

const checkWinner = (missions) => {
  for (const line of winningLines) {
    const [a, b, c] = line

    const firstMemberId = missions.find(
      (mission) => mission.position === a,
    )?.completedByMemberId

    const secondMemberId = missions.find(
      (mission) => mission.position === b,
    )?.completedByMemberId

    const thirdMemberId = missions.find(
      (mission) => mission.position === c,
    )?.completedByMemberId

    if (
      firstMemberId !== null &&
      firstMemberId !== undefined &&
      firstMemberId === secondMemberId &&
      secondMemberId === thirdMemberId
    ) {
      return firstMemberId
    }
  }

  return null
}

export const initializeMember = async () => {
  await delay()

  const savedUuid = localStorage.getItem('uuid')

  if (savedUuid) {
    return {
      uuid: savedUuid,
    }
  }

  const uuid = crypto.randomUUID()
  localStorage.setItem('uuid', uuid)

  return {
    uuid,
  }
}

export const createRoom = async () => {
  await delay()

  roomState = structuredClone(mockRoom)

  roomState.status = 'WAITING'
  roomState.entryCode = 'ABCD12'
  roomState.category = null
  roomState.missions = []
  roomState.players = [
    {
      playerId: 100,
      memberId: 1,
      role: 'O',
    },
  ]
  roomState.myRole = 'O'
  roomState.turn = null
  roomState.winnerMemberId = null

  return {
    roomId: roomState.roomId,
    entryCode: roomState.entryCode,
    status: roomState.status,
    category: roomState.category,
  }
}

export const updateRoomCategory = async (entryCode, category) => {
  await delay()

  roomState = structuredClone(mockRoom)

  roomState.entryCode = entryCode
  roomState.category = category

  // 원래 플로우: 카테고리 선택 후에도 상대가 들어오기 전까지는 WAITING
  roomState.status = 'WAITING'
  roomState.myRole = 'O'
  roomState.winnerMemberId = null

  roomState.players = [
    {
      playerId: 100,
      memberId: 1,
      role: 'O',
    },
  ]

  // 상대가 들어오기 전이므로 턴 없음
  roomState.turn = null

  roomState.missions = roomState.missions.map((mission) => ({
    ...mission,
    completedByMemberId: null,
    completedAt: null,
    sabotaged: false,
  }))

  return structuredClone(roomState)
}

export const joinRoom = async (entryCode) => {
  await delay()

  roomState.status = 'PLAYING'
  roomState.entryCode = entryCode
  roomState.myRole = 'X'
  roomState.winnerMemberId = null

  roomState.players = [
    {
      playerId: 100,
      memberId: 1,
      role: 'O',
    },
    {
      playerId: 101,
      memberId: 2,
      role: 'X',
    },
  ]

  roomState.turn = {
    currentTurnMemberId: 1,
    turnStartedAt: new Date().toISOString(),
    turnDurationSeconds: 86400,
    remainingSeconds: 86400,
  }

  return structuredClone(roomState)
}

export const getRoom = async (entryCode) => {
  await delay()

  return {
    ...structuredClone(roomState),
    entryCode,
  }
}

export const completeMission = async (entryCode, position) => {
  await delay()

  if (!roomState.turn) {
    throw new Error('현재 진행 중인 턴이 없습니다.')
  }

  const currentTurnMemberId = roomState.turn.currentTurnMemberId

  const targetMission = roomState.missions.find(
    (mission) => mission.position === position,
  )

  if (!targetMission) {
    throw new Error('존재하지 않는 미션입니다.')
  }

  if (targetMission.completedByMemberId !== null) {
    throw new Error('이미 완료된 미션입니다.')
  }

  roomState.missions = roomState.missions.map((mission) => {
    if (mission.position !== position) return mission

    return {
      ...mission,
      completedByMemberId: currentTurnMemberId,
      completedAt: new Date().toISOString(),
    }
  })

  const winnerMemberId = checkWinner(roomState.missions)

  if (winnerMemberId !== null) {
    roomState.status = 'FINISHED'
    roomState.turn = null
    roomState.winnerMemberId = winnerMemberId

    return structuredClone(roomState)
  }

  const isDraw = roomState.missions.every(
    (mission) => mission.completedByMemberId !== null,
  )

  if (isDraw) {
    roomState.status = 'FINISHED'
    roomState.turn = null
    roomState.winnerMemberId = null

    return structuredClone(roomState)
  }

  const nextTurnMemberId = currentTurnMemberId === 1 ? 2 : 1

  roomState.turn = {
    currentTurnMemberId: nextTurnMemberId,
    turnStartedAt: new Date().toISOString(),
    turnDurationSeconds: 86400,
    remainingSeconds: 86400,
  }

  return structuredClone(roomState)
}

export const sabotageMission = async (entryCode, position) => {
  await delay()

  if (!roomState.turn) {
    throw new Error('현재 진행 중인 턴이 없습니다.')
  }

  const currentTurnMemberId = roomState.turn.currentTurnMemberId

  const targetMission = roomState.missions.find(
    (mission) => mission.position === position,
  )

  if (!targetMission) {
    throw new Error('존재하지 않는 미션입니다.')
  }

  if (targetMission.completedByMemberId !== currentTurnMemberId) {
    throw new Error('현재 턴 플레이어가 완료한 미션만 사보타주할 수 있습니다.')
  }

  if (targetMission.sabotaged) {
    throw new Error('이미 사보타주한 미션입니다.')
  }

  roomState.missions = roomState.missions.map((mission) => {
    if (mission.position !== position) return mission

    return {
      ...mission,
      sabotaged: true,
    }
  })

  roomState.turn = {
    ...roomState.turn,
    remainingSeconds: Math.max(
      0,
      roomState.turn.remainingSeconds - SABOTAGE_PENALTY_SECONDS,
    ),
  }

  return structuredClone(roomState)
}