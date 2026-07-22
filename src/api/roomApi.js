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
 * 반환값:
 * {
 *   entryCode: 'ED6137',
 *   categories: [
 *     {
 *       code: 'STUDY',
 *       name: '공부'
 *     }
 *   ]
 * }
 */
export const createRoom = async () => {
  const response = await axiosInstance.post('/api/rooms')

  return unwrapResponse(response)
}

/**
 * 방 카테고리 설정
 *
 * PATCH /api/rooms/{entryCode}/category
 *
 * 요청 바디:
 * {
 *   category: 'STUDY'
 * }
 *
 * 반환값:
 * {}
 */
export const updateRoomCategory = async (
  entryCode,
  category,
) => {
  const normalizedEntryCode =
    validateEntryCode(entryCode)

  if (!category || typeof category !== 'string') {
    throw new Error('카테고리를 선택해야 합니다.')
  }

  const response = await axiosInstance.patch(
    `/api/rooms/${encodeURIComponent(
      normalizedEntryCode,
    )}/category`,
    {
      category: category.trim(),
    },
  )

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

const roomApi = {
  createRoom,
  updateRoomCategory,
  getRoom,
}

export default roomApi