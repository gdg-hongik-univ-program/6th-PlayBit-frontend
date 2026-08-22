import axiosInstance from './axiosInstance'

const validateEntryCode = (entryCode) => {
  if (!entryCode || typeof entryCode !== 'string') {
    throw new Error('방 입장 코드가 필요합니다.')
  }

  return entryCode.trim()
}

const unwrapResponse = (response) => {
  const responseBody = response.data

  if (!responseBody?.success) {
    const errorMessage =
      responseBody?.error?.message ??
      responseBody?.error ??
      '요청 처리에 실패했습니다.'

    throw new Error(errorMessage)
  }

  return responseBody.data
}

/**
 * 방 생성
 *
 * POST /api/rooms
 *
 * 빈 방을 생성하고 입장 코드와 카테고리 목록을 반환합니다.
 */
export const createRoom = async () => {
  const response = await axiosInstance.post('/api/rooms')

  return unwrapResponse(response)
}

/**
 * 방 카테고리와 이름 설정
 *
 * PATCH /api/rooms/{entryCode}/category
 */
export const setRoom = async (
  entryCode,
  { category, roomName },
) => {
  const normalizedEntryCode =
    validateEntryCode(entryCode)

  if (!category || typeof category !== 'string') {
    throw new Error('카테고리를 선택해야 합니다.')
  }

  if (!roomName || typeof roomName !== 'string') {
    throw new Error('방 이름을 입력해야 합니다.')
  }

  const response = await axiosInstance.patch(
    `/api/rooms/${encodeURIComponent(
      normalizedEntryCode,
    )}/category`,
    {
      category: category.trim(),
      roomName: roomName.trim(),
    },
  )

  return unwrapResponse(response)
}

/**
 * 로그인 사용자가 참여한 방 목록 조회
 *
 * GET /api/rooms
 */
export const getRooms = async () => {
  const response = await axiosInstance.get('/api/rooms')

  return unwrapResponse(response)
}

/**
 * 방 정보 조회
 *
 * GET /api/rooms/{entryCode}
 *
 * PLAYING 상태 반환값:
 * {
 *   entryCode,
 *   status,
 *   category,
 *   myMemberId,
 *   currentTurnMemberId,
 *   turnStartedAt,
 *   turnDeadline,
 *   currentTurnSabotaged,
 *   missions,
 *   players
 * }
 *
 * FINISHED 상태 반환값:
 * {
 *   status,
 *   missions,
 *   players,
 *   winnerMemberId
 * }
 */
export const getRoom = async (entryCode) => {
  const normalizedEntryCode =
    validateEntryCode(entryCode)

  const response = await axiosInstance.get(
    `/api/rooms/${encodeURIComponent(
      normalizedEntryCode,
    )}`,
  )

  return unwrapResponse(response)
}

