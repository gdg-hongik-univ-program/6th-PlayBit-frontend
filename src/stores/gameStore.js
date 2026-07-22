import { create } from 'zustand'

import {
  createRoom,
  updateRoomCategory,
  getRoom,
} from '../api/roomApi'

const initialState = {
  room: null,
  categories: [],
  missions: [],
  players: [],

  currentTurnMemberId: null,
  turnStartedAt: null,
  turnDeadline: null,
  currentTurnSabotaged: false,

  turn: null,
  myMemberId: null,
  myRole: null,

  winnerMemberId: null,
  status: 'IDLE',

  isLoading: false,
  error: null,
}

const getErrorMessage = (error, defaultMessage) => {
  const responseError = error.response?.data?.error

  if (typeof responseError === 'string') {
    return responseError
  }

  return (
    responseError?.message ??
    error.response?.data?.message ??
    error.message ??
    defaultMessage
  )
}

/**
 * GET /api/rooms/{entryCode} 응답을
 * Zustand 상태 구조로 변환합니다.
 *
 * FINISHED 응답에는 entryCode, category, myMemberId가 없을 수 있으므로
 * 기존 상태를 유지하도록 처리합니다.
 */
const applyRoomData = (
  data,
  previousState,
  fallbackEntryCode = null,
) => {
  const previousRoom = previousState.room

  const players =
    data.players ??
    previousState.players ??
    []

  const missions =
    data.missions ??
    previousState.missions ??
    []

  const myMemberId =
    data.myMemberId ??
    previousState.myMemberId ??
    null

  const myPlayer = players.find(
    (player) =>
      String(player.memberId) ===
      String(myMemberId),
  )

  const myRole =
    myPlayer?.role ??
    previousState.myRole ??
    null

  const currentTurnMemberId =
    data.currentTurnMemberId ?? null

  const currentTurnPlayer = players.find(
    (player) =>
      String(player.memberId) ===
      String(currentTurnMemberId),
  )

  return {
    room: {
      roomId:
        data.roomId ??
        previousRoom?.roomId ??
        null,

      entryCode:
        data.entryCode ??
        fallbackEntryCode ??
        previousRoom?.entryCode ??
        null,

      status:
        data.status ??
        previousRoom?.status ??
        'IDLE',

      category:
        data.category ??
        previousRoom?.category ??
        null,
    },

    missions,
    players,

    currentTurnMemberId,
    turnStartedAt:
      data.turnStartedAt ?? null,
    turnDeadline:
      data.turnDeadline ?? null,
    currentTurnSabotaged:
      data.currentTurnSabotaged ?? false,

    // 기존 컴포넌트에서 turn을 O 또는 X로 사용하기 위한 값
    turn:
      currentTurnPlayer?.role ??
      null,

    myMemberId,
    myRole,

    winnerMemberId:
      data.winnerMemberId ?? null,

    status:
      data.status ??
      previousState.status ??
      'IDLE',
  }
}

const useGameStore = create((set, get) => ({
  ...initialState,

  clearError: () => {
    set({ error: null })
  },

  resetRoomState: () => {
    set(initialState)
  },

  setRoomState: (data, fallbackEntryCode = null) => {
    const previousState = get()

    set(
      applyRoomData(
        data,
        previousState,
        fallbackEntryCode,
      ),
    )
  },

  /**
   * POST /api/rooms
   *
   * 반환:
   * {
   *   entryCode,
   *   categories
   * }
   */
  createNewRoom: async () => {
    try {
      set({
        isLoading: true,
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

        categories:
          data.categories ?? [],

        missions: [],
        players: [],

        currentTurnMemberId: null,
        turnStartedAt: null,
        turnDeadline: null,
        currentTurnSabotaged: false,

        turn: null,
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
      set({ isLoading: false })
    }
  },

  /**
   * PATCH /api/rooms/{entryCode}/category
   *
   * PATCH 응답의 data가 빈 객체이므로
   * applyRoomData를 호출하지 않습니다.
   */
  selectCategory: async (
    entryCode,
    categoryCode,
  ) => {
    try {
      set({
        isLoading: true,
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
      set({ isLoading: false })
    }
  },

  /**
   * GET /api/rooms/{entryCode}
   */
  fetchRoom: async (entryCode) => {
    try {
      set({
        isLoading: true,
        error: null,
      })

      const data = await getRoom(entryCode)
      const previousState = get()

      set(
        applyRoomData(
          data,
          previousState,
          entryCode,
        ),
      )

      return data
    } catch (error) {
      console.error(
        '방 조회 오류:',
        error.response?.status,
        error.response?.data,
        error,
      )

      set({
        error: getErrorMessage(
          error,
          '게임 정보를 불러오지 못했습니다.',
        ),
      })

      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useGameStore