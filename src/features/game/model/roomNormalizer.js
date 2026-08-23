const hasOwn = (object, key) => {
  return Object.prototype.hasOwnProperty.call(
    object,
    key,
  )
}

/**
 * 방 조회 응답을 애플리케이션에서 사용하는 상태 구조로 변환합니다.
 * 응답 필드가 생략된 경우에는 직전 상태를 유지합니다.
 */
export const normalizeRoomResponse = (
  data,
  previousState,
  fallbackEntryCode = null,
) => {
  const previousRoom = previousState.room
  const roomData = data.room ?? data

  const players =
    data.players ??
    roomData.players ??
    previousState.players ??
    []

  const responseMissions =
    data.missions ??
    roomData.missions ??
    previousState.missions ??
    []

  /*
   * 방 조회/SSE의 MissionItem에는 인증 사진 필드가 생략될 수 있습니다.
   * 완료/사보타주 응답으로 받은 상세 인증 정보는 같은 position의
   * 최신 미션에 합쳐서 화면 전환 이후에도 유지합니다.
   */
  const previousMissions =
    previousState.missions ?? []

  const missions = responseMissions.map(
    (mission) => {
      const previousMission =
        previousMissions.find(
          (item) =>
            String(item.position) ===
            String(mission.position),
        )

      let newSabotagedAt = mission.sabotagedAt || previousMission?.sabotagedAt
      let newCompletedAt = mission.completedAt || previousMission?.completedAt

      const wasSabotaged = previousMission?.sabotagedByOpponent ?? previousMission?.sabotaged
      const isSabotaged = mission.sabotagedByOpponent ?? mission.sabotaged
      if (!wasSabotaged && isSabotaged && !newSabotagedAt) {
        newSabotagedAt = new Date().toISOString()
      }

      const wasCompleted = previousMission?.completedByRole || previousMission?.completedBy
      const isCompleted = mission.completedByRole || mission.completedBy
      if (!wasCompleted && isCompleted && !newCompletedAt) {
        newCompletedAt = new Date().toISOString()
      }

      return {
        ...previousMission,
        ...mission,
        sabotagedAt: newSabotagedAt,
        completedAt: newCompletedAt,
      }
    },
  )

  const hasTopLevelMyMemberId = hasOwn(
    data,
    'myMemberId',
  )
  const hasRoomMyMemberId = hasOwn(
    roomData,
    'myMemberId',
  )
  const hasMyMemberId =
    hasTopLevelMyMemberId ||
    hasRoomMyMemberId

  const responseMyMemberId =
    hasTopLevelMyMemberId
      ? data.myMemberId
      : roomData.myMemberId

  const myMemberId = hasMyMemberId
    ? responseMyMemberId
    : previousState.myMemberId ?? null

  const myPlayer =
    myMemberId !== null &&
    myMemberId !== undefined
      ? players.find(
          (player) =>
            String(player.memberId) ===
            String(myMemberId),
        )
      : null

  const myRole =
    hasMyMemberId && myMemberId === null
      ? null
      : myPlayer?.role ??
        previousState.myRole ??
        null

  const currentTurnMemberId = hasOwn(
    roomData,
    'currentTurnMemberId',
  )
    ? roomData.currentTurnMemberId
    : previousState.currentTurnMemberId ??
      null

  const responseStatus =
    roomData.status ??
    previousState.status ??
    'IDLE'

  const winnerMemberId =
    responseStatus === 'PLAYING'
      ? null
      : hasOwn(roomData, 'winnerMemberId')
        ? roomData.winnerMemberId
        : previousState.winnerMemberId ??
          null

  return {
    room: {
      roomId:
        roomData.roomId ??
        previousRoom?.roomId ??
        null,
      entryCode:
        roomData.entryCode ??
        fallbackEntryCode ??
        previousRoom?.entryCode ??
        null,
      status:
        roomData.status ??
        previousRoom?.status ??
        'IDLE',
      category:
        roomData.category ??
        previousRoom?.category ??
        null,
      roomName:
        roomData.roomName ??
        previousRoom?.roomName ??
        null,
    },

    missions,
    players,
    currentTurnMemberId,

    currentTurnNumber: hasOwn(
      roomData,
      'currentTurnNumber',
    )
      ? roomData.currentTurnNumber
      : previousState.currentTurnNumber ??
        null,

    turnDeadline: hasOwn(
      roomData,
      'turnDeadline',
    )
      ? roomData.turnDeadline
      : previousState.turnDeadline ?? null,

    currentTurnSabotaged: hasOwn(
      roomData,
      'currentTurnSabotaged',
    )
      ? roomData.currentTurnSabotaged
      : previousState.currentTurnSabotaged ??
        false,

    myMemberId,
    myRole,
    winnerMemberId,
    status: responseStatus,
  }
}
