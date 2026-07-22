import { create } from 'zustand'

import {
  createRoom,
  updateRoomCategory,
  getRoom,
} from '../api/roomApi'

import {
  completeMission as completeMissionApi,
  sabotageMission as sabotageMissionApi,
} from '../api/missionApi'

import { registerPlayer } from '../services/playerService'

const initialState = {
  room: null,
  categories: [],
  missions: [],
  players: [],

  currentTurnMemberId: null,
  currentTurnNumber: null,
  turnStartedAt: null,
  turnDeadline: null,
  currentTurnSabotaged: false,

  // 기존 컴포넌트에서 O 또는 X로 사용
  turn: null,

  myMemberId: null,
  myRole: null,

  winnerMemberId: null,
  status: 'IDLE',

  isLoading: false,
  error: null,
}

const getErrorMessage = (
  error,
  defaultMessage,
) => {
  const responseError =
    error.response?.data?.error

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
 * 객체에 특정 필드가 존재하는지 확인합니다.
 *
 * 값이 null인 경우와
 * 필드 자체가 없는 경우를 구분하기 위해 사용합니다.
 */
const hasOwn = (object, key) => {
  return Object.prototype.hasOwnProperty.call(
    object,
    key,
  )
}

/**
 * GET /api/rooms/{entryCode} 응답을
 * Zustand 상태 구조로 변환합니다.
 *
 * 다음 두 응답 구조를 모두 처리합니다.
 *
 * 1. 방 정보가 최상위에 있는 경우
 * 2. 방 정보가 data.room 내부에 있는 경우
 */
const applyRoomData = (
  data,
  previousState,
  fallbackEntryCode = null,
) => {
  const previousRoom = previousState.room

  const roomData = data.room ?? data

  const players =
    data.players ??
    roomData.players ??
    previousState.players ??
    []

  const missions =
    data.missions ??
    roomData.missions ??
    previousState.missions ??
    []

  /*
   * myMemberId가 응답 최상위 또는 room 내부에
   * 존재하는지 확인합니다.
   */
  const hasTopLevelMyMemberId = hasOwn(
    data,
    'myMemberId',
  )

  const hasRoomMyMemberId = hasOwn(
    roomData,
    'myMemberId',
  )

  const hasMyMemberId =
    hasTopLevelMyMemberId ||
    hasRoomMyMemberId

  const responseMyMemberId =
    hasTopLevelMyMemberId
      ? data.myMemberId
      : roomData.myMemberId

  /*
   * FINISHED 응답 등에 myMemberId가 없다면
   * 이전 상태를 유지합니다.
   *
   * 서버가 myMemberId: null을 반환하면
   * 관전자이므로 null로 저장합니다.
   */
  const myMemberId = hasMyMemberId
    ? responseMyMemberId
    : previousState.myMemberId ?? null

  const myPlayer =
    myMemberId !== null &&
    myMemberId !== undefined
      ? players.find(
          (player) =>
            String(player.memberId) ===
            String(myMemberId),
        )
      : null

  const myRole =
    hasMyMemberId && myMemberId === null
      ? null
      : myPlayer?.role ??
        previousState.myRole ??
        null

  /*
   * currentTurnMemberId가 응답에 없으면
   * 이전 상태를 유지합니다.
   *
   * 서버가 명시적으로 null을 반환한 경우에는
   * null을 저장합니다.
   */
  const hasCurrentTurnMemberId = hasOwn(
    roomData,
    'currentTurnMemberId',
  )

  const currentTurnMemberId =
    hasCurrentTurnMemberId
      ? roomData.currentTurnMemberId
      : previousState.currentTurnMemberId ??
        null

  const currentTurnPlayer =
    currentTurnMemberId !== null &&
    currentTurnMemberId !== undefined
      ? players.find(
          (player) =>
            String(player.memberId) ===
            String(currentTurnMemberId),
        )
      : null

  const responseStatus =
    roomData.status ??
    previousState.status ??
    'IDLE'

  const winnerMemberId =
    responseStatus === 'PLAYING'
      ? null
      : hasOwn(roomData, 'winnerMemberId')
        ? roomData.winnerMemberId
        : previousState.winnerMemberId ??
          null

  return {
    room: {
      roomId:
        roomData.roomId ??
        previousRoom?.roomId ??
        null,

      entryCode:
        roomData.entryCode ??
        fallbackEntryCode ??
        previousRoom?.entryCode ??
        null,

      status:
        roomData.status ??
        previousRoom?.status ??
        'IDLE',

      category:
        roomData.category ??
        previousRoom?.category ??
        null,
    },

    missions,
    players,

    currentTurnMemberId,

    currentTurnNumber: hasOwn(
      roomData,
      'currentTurnNumber',
    )
      ? roomData.currentTurnNumber
      : previousState.currentTurnNumber ??
        null,

    turnStartedAt: hasOwn(
      roomData,
      'turnStartedAt',
    )
      ? roomData.turnStartedAt
      : previousState.turnStartedAt ?? null,

    turnDeadline: hasOwn(
      roomData,
      'turnDeadline',
    )
      ? roomData.turnDeadline
      : previousState.turnDeadline ?? null,

    currentTurnSabotaged: hasOwn(
      roomData,
      'currentTurnSabotaged',
    )
      ? roomData.currentTurnSabotaged
      : previousState.currentTurnSabotaged ??
        false,

    // 현재 턴 memberId를 O 또는 X로 변환
    turn:
      currentTurnPlayer?.role ?? null,

    myMemberId,
    myRole,

    winnerMemberId,

    status: responseStatus,
  }
}

const useGameStore = create((set, get) => ({
  ...initialState,

  clearError: () => {
    set({
      error: null,
    })
  },

  resetRoomState: () => {
    set({
      ...initialState,
    })
  },

  setRoomState: (
    data,
    fallbackEntryCode = null,
  ) => {
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
   * 방 생성
   *
   * POST /api/rooms
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
        currentTurnNumber: null,
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
      set({
        isLoading: false,
      })
    }
  },

  /**
   * 카테고리 설정
   *
   * PATCH /api/rooms/{entryCode}/category
   *
   * 응답 data가 빈 객체이므로
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
      set({
        isLoading: false,
      })
    }
  },

  /**
   * 방 참여
   */
  enterRoom: async (entryCode) => {
    try {
      set({
        isLoading: true,
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
      set({
        isLoading: false,
      })
    }
  },

  /**
   * 방 정보 조회
   *
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
      set({
        isLoading: false,
      })
    }
  },

  /**
   * 미션 완료
   *
   * PATCH /api/rooms/{entryCode}/missions/{position}
   */
  completeMission: async (
    entryCode,
    position,
  ) => {
    try {
      set({
        isLoading: true,
        error: null,
      })

      await completeMissionApi(
        entryCode,
        position,
      )

      /*
       * PATCH 응답에는 전체 missions와 players가
       * 포함되지 않으므로 방 정보를 다시 조회합니다.
       */
      const roomData =
        await getRoom(entryCode)

      const previousState = get()

      set(
        applyRoomData(
          roomData,
          previousState,
          entryCode,
        ),
      )

      return roomData
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
      set({
        isLoading: false,
      })
    }
  },

  /**
   * 미션 사보타주
   *
   * PATCH
   * /api/rooms/{entryCode}/missions/{position}/sabotage
   */
  sabotageMission: async (
    entryCode,
    position,
  ) => {
    try {
      set({
        isLoading: true,
        error: null,
      })

      await sabotageMissionApi(
        entryCode,
        position,
      )

      /*
       * 사보타주 응답에는 변경된 미션 목록이
       * 포함되지 않으므로 방 정보를 다시 조회합니다.
       */
      const roomData =
        await getRoom(entryCode)

      const previousState = get()

      set(
        applyRoomData(
          roomData,
          previousState,
          entryCode,
        ),
      )

      return roomData
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
      set({
        isLoading: false,
      })
    }
  },
}))

export default useGameStore