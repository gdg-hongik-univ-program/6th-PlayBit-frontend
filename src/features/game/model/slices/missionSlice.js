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
) => {
  const roomData = await getRoom(entryCode)

  set(
    normalizeRoomResponse(
      roomData,
      get(),
      entryCode,
    ),
  )

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
