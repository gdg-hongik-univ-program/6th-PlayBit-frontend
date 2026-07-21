import { registerPlayerApi } from '../api/playerApi'

export const registerPlayer = async (entryCode) => {
  const response = await registerPlayerApi(entryCode)

  if (!response.success) {
    throw new Error(
      response.error?.message || '플레이어 등록에 실패했습니다.',
    )
  }

  const player = response.data

  const role = player.Role ?? player.role

  localStorage.setItem(`player-role-${entryCode}`, role)
  localStorage.setItem(
    `player-id-${entryCode}`,
    String(player.playerId),
  )
  localStorage.setItem(
    `player-member-id-${entryCode}`,
    String(player.memberId),
  )

  return {
    entryCode,
    playerId: player.playerId,
    memberId: player.memberId,
    role,
  }
}