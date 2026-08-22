import {
  completeMission as completeMissionApi,
  sabotageMission as sabotageMissionApi,
} from '../../../../api/missionApi'
import { getRoom } from '../../../../api/roomApi'
import { getErrorMessage } from '../../lib/getErrorMessage'
import { normalizeRoomResponse } from '../roomNormalizer'

const refreshRoom = async (
  entryCode,
  set,
  get,
  missionResult,
) => {
  const roomData =
    missionResult?.room ??
    (await getRoom(entryCode))

  const normalizedRoom =
    normalizeRoomResponse(
      roomData,
      get(),
      entryCode,
    )

  const detailedMission =
    missionResult?.mission

  if (detailedMission) {
    normalizedRoom.missions =
      normalizedRoom.missions.map(
        (mission) =>
          String(mission.position) ===
          String(detailedMission.position)
            ? {
                ...mission,
                ...detailedMission,
              }
            : mission,
      )
  }

  set(normalizedRoom)

  return roomData
}

export const createMissionSlice = (set, get) => ({
  completeMission: async (
    entryCode,
    position,
    image,
    comment,
  ) => {
    try {
      set({
        isMissionSubmitting: true,
        error: null,
      })

      const missionResult =
        await completeMissionApi(
        entryCode,
        position,
        image,
        comment,
      )

      return await refreshRoom(
        entryCode,
        set,
        get,
        missionResult,
      )
    } catch (error) {
      console.error(
        '미션 완료 오류:',
        error.response?.status,
        error.response?.data,
        error,
      )

      set({
        error: getErrorMessage(
          error,
          '미션 완료 처리에 실패했습니다.',
        ),
      })

      throw error
    } finally {
      set({ isMissionSubmitting: false })
    }
  },

  sabotageMission: async (
    entryCode,
    position,
    image,
    comment,
  ) => {
    try {
      set({
        isMissionSubmitting: true,
        error: null,
      })

      const missionResult =
        await sabotageMissionApi(
        entryCode,
        position,
        image,
        comment,
      )

      return await refreshRoom(
        entryCode,
        set,
        get,
        missionResult,
      )
    } catch (error) {
      console.error(
        '사보타주 오류:',
        error.response?.status,
        error.response?.data,
        error,
      )

      set({
        error: getErrorMessage(
          error,
          '사보타주 처리에 실패했습니다.',
        ),
      })

      throw error
    } finally {
      set({ isMissionSubmitting: false })
    }
  },
})
