import {
  createRoom,
  getRoom,
  updateRoomCategory,
} from '../../../../api/roomApi'
import { registerPlayer } from '../../../../services/playerService'
import { getErrorMessage } from '../../lib/getErrorMessage'
import { initialGameState } from '../initialGameState'
import { normalizeRoomResponse } from '../roomNormalizer'

export const createRoomSlice = (set, get) => ({
  clearError: () => {
    set({ error: null })
  },

  resetRoomState: () => {
    get().disconnectRoomEvents()
    set({ ...initialGameState })
  },

  createNewRoom: async () => {
    try {
      set({
        isRoomLoading: true,
        error: null,
      })

      const data = await createRoom()

      set({
        room: {
          roomId: null,
          entryCode: data.entryCode,
          status: 'WAITING',
          category: null,
        },
        missions: [],
        players: [],
        currentTurnMemberId: null,
        currentTurnNumber: null,
        turnDeadline: null,
        currentTurnSabotaged: false,
        myMemberId: null,
        myRole: null,
        winnerMemberId: null,
        status: 'WAITING',
      })

      return data
    } catch (error) {
      console.error(
        '방 생성 오류:',
        error.response?.status,
        error.response?.data,
        error,
      )

      set({
        error: getErrorMessage(
          error,
          '방 생성에 실패했습니다.',
        ),
      })

      throw error
    } finally {
      set({ isRoomLoading: false })
    }
  },

  selectCategory: async (
    entryCode,
    categoryCode,
  ) => {
    try {
      set({
        isRoomLoading: true,
        error: null,
      })

      await updateRoomCategory(
        entryCode,
        categoryCode,
      )

      set((state) => ({
        room: {
          ...state.room,
          entryCode,
          category: categoryCode,
          status: 'WAITING',
        },
        status: 'WAITING',
      }))

      return {
        entryCode,
        category: categoryCode,
      }
    } catch (error) {
      console.error(
        '카테고리 설정 오류:',
        error.response?.status,
        error.response?.data,
        error,
      )

      set({
        error: getErrorMessage(
          error,
          '카테고리 설정에 실패했습니다.',
        ),
      })

      throw error
    } finally {
      set({ isRoomLoading: false })
    }
  },

  enterRoom: async (entryCode) => {
    try {
      set({
        isRoomLoading: true,
        error: null,
      })

      const playerData =
        await registerPlayer(entryCode)

      set((state) => ({
        room: {
          ...state.room,
          entryCode,
        },
        myMemberId:
          playerData.myMemberId ??
          playerData.memberId ??
          state.myMemberId,
        myRole:
          playerData.role ??
          playerData.myRole ??
          state.myRole,
      }))

      return playerData
    } catch (error) {
      console.error(
        '방 입장 오류:',
        error.response?.status,
        error.response?.data,
        error,
      )

      set({
        error: getErrorMessage(
          error,
          '방 입장에 실패했습니다.',
        ),
      })

      throw error
    } finally {
      set({ isRoomLoading: false })
    }
  },

  fetchRoom: async (
    entryCode,
    options = {},
  ) => {
    const {
      showLoading = true,
      clearError = true,
    } = options

    try {
      if (showLoading) {
        set({
          isRoomLoading: true,
          ...(clearError
            ? { error: null }
            : {}),
        })
      } else if (clearError) {
        set({ error: null })
      }

      const data = await getRoom(entryCode)

      set({
        ...normalizeRoomResponse(
          data,
          get(),
          entryCode,
        ),
        ...(showLoading
          ? { isRoomLoading: false }
          : {}),
      })

      return data
    } catch (error) {
      console.error(
        '방 조회 오류:',
        error.response?.status,
        error.response?.data,
        error,
      )

      if (showLoading) {
        set({
          error: getErrorMessage(
            error,
            '게임 정보를 불러오지 못했습니다.',
          ),
        })
      }

      throw error
    } finally {
      if (showLoading) {
        set({ isRoomLoading: false })
      }
    }
  },
})
