import {
  leaveRoomApi,
  registerPlayerApi,
} from '../api/playerApi'

export const registerPlayer = async (entryCode) => {
  const response = await registerPlayerApi(entryCode)

  if (!response.success) {
    throw new Error(
      response.error?.message || '플레이어 등록에 실패했습니다.',
    )
  }

  const player = response.data

  const role = player.Role ?? player.role

  return {
    entryCode,
    playerId: player.playerId,
    memberId: player.memberId,
    role,
  }
}

export const leaveRoom = async (entryCode) => {
  const response = await leaveRoomApi(entryCode)

  if (!response.success) {
    throw new Error(
      response.error?.message ||
        '방 퇴장에 실패했습니다.',
    )
  }

  return response.data
}
