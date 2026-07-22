import { create } from 'zustand'
import {
  createRoom,
  updateRoomCategory,
  getRoom,
  completeMission,
  sabotageMission,
} from '../services/gameService'

import { registerPlayer } from '../services/playerService'

const applyRoomData = (data) => ({
  room: {
    roomId: data.roomId,
    entryCode: data.entryCode,
    status: data.status,
    category: data.category ?? null,
  },
  missions: data.missions ?? [],
  players: data.players ?? [],
  turn: data.turn ?? null,
  myRole: data.myRole ?? null,
  winnerMemberId: data.winnerMemberId ?? null,
  status: data.status ?? 'IDLE',
})

const useGameStore = create((set) => ({
  room: null,
  missions: [],
  players: [],
  turn: null,
  myRole: null,
  winnerMemberId: null,
  status: 'IDLE',
  isLoading: false,
  error: null,

  setRoomState: (data) => {
    set(applyRoomData(data))
  },

  clearError: () => {
    set({ error: null })
  },

  resetRoomState: () => {
    set({
      room: null,
      missions: [],
      players: [],
      turn: null,
      myRole: null,
      winnerMemberId: null,
      status: 'IDLE',
      isLoading: false,
      error: null,
    })
  },

  createNewRoom: async () => {
    try {
      set({ isLoading: true, error: null })

      const data = await createRoom()

      set({
        room: {
          roomId: data.roomId,
          entryCode: data.entryCode,
          status: data.status,
          category: data.category ?? null,
        },
        missions: [],
        players: [],
        turn: null,
        myRole: null,
        winnerMemberId: null,
        status: data.status ?? 'WAITING',
      })

      return data
    } catch (error) {
      set({ error: '방 생성에 실패했습니다.' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  selectCategory: async (entryCode, category) => {
    try {
      set({ isLoading: true, error: null })

      const data = await updateRoomCategory(entryCode, category)

      set(applyRoomData(data))

      return data
    } catch (error) {
      set({ error: '카테고리 설정에 실패했습니다.' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

 enterRoom: async (entryCode) => {
  try {
    set({
      isLoading: true,
      error: null,
    })

    const playerData = await registerPlayer(entryCode)

    set({
      myRole: playerData.role,
    })

    return playerData
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      '방 입장에 실패했습니다.'

    set({
      error: errorMessage,
    })

    throw error
  } finally {
    set({
      isLoading: false,
    })
  }
},

  fetchRoom: async (entryCode) => {
    try {
      set({ isLoading: true, error: null })

      const data = await getRoom(entryCode)

      set(applyRoomData(data))

      return data
    } catch (error) {
      set({ error: '게임 정보를 불러오지 못했습니다.' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  handleCompleteMission: async (entryCode, position) => {
    try {
      set({ isLoading: true, error: null })

      const data = await completeMission(entryCode, position)

      set(applyRoomData(data))

      return data
    } catch (error) {
      set({ error: '미션 완료 처리에 실패했습니다.' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  handleSabotageMission: async (entryCode, position) => {
    try {
      set({ isLoading: true, error: null })

      const data = await sabotageMission(entryCode, position)

      set(applyRoomData(data))

      return data
    } catch (error) {
      set({ error: '사보타주 처리에 실패했습니다.' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useGameStore