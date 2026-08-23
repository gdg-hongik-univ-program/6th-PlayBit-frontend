import axiosInstance from './axiosInstance'

const unwrapMissionResponse = (response) => {
  if (!response.data?.success) {
    throw new Error(
      response.data?.error?.message ||
        '미션 인증 요청에 실패했습니다.',
    )
  }

  return response.data.data
}

/**
 * 미션 완료
 * PATCH /api/rooms/{entryCode}/missions/{position}
 */
export const completeMission = async (entryCode, position, image, comment) => {
  if (!entryCode) {
    throw new Error('entryCode가 필요합니다.')
  }

  if (position === undefined || position === null) {
    throw new Error('position이 필요합니다.')
  }

  const formData = new FormData()

  formData.append('image', image)

  if (comment) {
    formData.append('comment', comment)
  }

  const response = await axiosInstance.patch(
    `/api/rooms/${encodeURIComponent(entryCode)}/missions/${position}`,
    formData,
  )

  return unwrapMissionResponse(response)
}

/**
 * 상대방 미션 사보타주
 * PATCH /api/rooms/{entryCode}/missions/{position}/sabotage
 */
export const sabotageMission = async (entryCode, position, image, comment) => {
  if (!entryCode) {
    throw new Error('entryCode가 필요합니다.')
  }

  if (position === undefined || position === null) {
    throw new Error('position이 필요합니다.')
  }

  const formData = new FormData()

  formData.append('image', image)

  if (comment) {
    formData.append('comment', comment)
  }

  const response = await axiosInstance.patch(
    `/api/rooms/${encodeURIComponent(entryCode)}/missions/${position}/sabotage`,
    formData,
  )

  return unwrapMissionResponse(response)
}
