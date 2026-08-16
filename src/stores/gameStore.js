import { create } from 'zustand'
import { connectRoomSSE } from '../api/sseApi'

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

  // SSE 연결 상태
  sseStatus: 'DISCONNECTED',
}

/*
 * fetchEventSource 연결 종료를 위한 컨트롤러입니다.
 * Zustand 상태가 아니라 모듈 변수로 관리합니다.
 */
let roomSSEController = null

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
   * FINISHED 응답 등에 myMemberId가 없으면
   * 이전 상태를 유지합니다.
   *
   * 서버가 myMemberId: null을 명시하면
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
      : previousState.turnStartedAt ??
        null,

    turnDeadline: hasOwn(
      roomData,
      'turnDeadline',
    )
      ? roomData.turnDeadline
      : previousState.turnDeadline ??
        null,

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

  /**
   * 특정 방의 SSE 스트림에 연결합니다.
   *
   * SSE payload에는 전체 방 데이터가 아니라
   * { message: "MISSION_COMPLETED" } 형태의
   * 변경 알림만 들어옵니다.
   *
   * 따라서 이벤트 수신 후 fetchRoom을 호출하여
   * 최신 방 상태를 다시 가져옵니다.
   */
  connectRoomEvents: (entryCode) => {
    const memberId =
      localStorage.getItem('uuid')

    if (!entryCode) {
      console.error(
        '[SSE] entryCode가 없습니다.',
      )

      return
    }

    if (!memberId) {
      console.error(
        '[SSE] localStorage에 uuid가 없습니다.',
      )

      set({
        sseStatus: 'DISCONNECTED',
      })

      return
    }

    /*
     * 기존 연결이 있다면 먼저 종료합니다.
     */
    if (roomSSEController) {
      roomSSEController.abort()
      roomSSEController = null
    }

    const controller =
      new AbortController()

    roomSSEController = controller

    set({
      sseStatus: 'CONNECTING',
    })

    connectRoomSSE({
      entryCode,
      memberId,
      signal: controller.signal,

      onOpen: () => {
        /*
         * 이미 다른 연결로 교체된 경우
         * 이전 연결의 콜백은 무시합니다.
         */
        if (
          roomSSEController !== controller
        ) {
          return
        }

        set({
          sseStatus: 'CONNECTED',
          error: null,
        })
      },

      /*
       * SSE 명세:
       *
       * event: room-update
       * data: { "message": "MISSION_COMPLETED" }
       */
      onRoomUpdate: async (
        payload,
      ) => {
        if (
          controller.signal.aborted ||
          roomSSEController !== controller
        ) {
          return
        }

        console.log(
          '[SSE] 방 변경 알림:',
          payload?.message,
        )

        try {
          /*
           * SSE는 변경 사실만 알려주므로
           * 최신 방 상태를 GET으로 다시 조회합니다.
           *
           * showLoading: false로 호출하여
           * 화면 전체 로딩이 깜빡이지 않도록 합니다.
           */
          await get().fetchRoom(
            entryCode,
            {
              showLoading: false,
              clearError: false,
            },
          )
        } catch (error) {
          console.error(
            '[SSE] 이벤트 수신 후 방 조회 실패:',
            error,
          )
        }
      },

      onError: () => {
        if (
          controller.signal.aborted ||
          roomSSEController !== controller
        ) {
          return
        }

        set({
          sseStatus: 'DISCONNECTED',
        })
      },
    }).catch((error) => {
      /*
       * 페이지 이동 등으로 abort한 경우는
       * 정상 종료이므로 오류로 처리하지 않습니다.
       */
      if (controller.signal.aborted) {
        return
      }

      console.error(
        '[SSE] 연결 실행 오류:',
        error,
      )

      if (
        roomSSEController === controller
      ) {
        roomSSEController = null

        set({
          sseStatus: 'DISCONNECTED',
        })
      }
    })
  },

  /**
   * 현재 SSE 연결을 종료합니다.
   */
  disconnectRoomEvents: () => {
    if (roomSSEController) {
      roomSSEController.abort()
      roomSSEController = null
    }

    set({
      sseStatus: 'DISCONNECTED',
    })
  },

  resetRoomState: () => {
    if (roomSSEController) {
      roomSSEController.abort()
      roomSSEController = null
    }

    set({
      ...initialState,
    })
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
   * options.showLoading
   * - true: 일반 조회, 로딩 상태 표시
   * - false: SSE 갱신용 조회, 로딩 상태 숨김
   *
   * options.clearError
   * - true: 조회 시작 시 기존 오류 제거
   * - false: SSE 갱신 중 기존 오류 상태 유지
   */
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
          isLoading: true,
          ...(clearError
            ? { error: null }
            : {}),
        })
      } else if (clearError) {
        set({
          error: null,
        })
      }

      const data =
        await getRoom(entryCode)

      const previousState = get()

      set({
        ...applyRoomData(
          data,
          previousState,
          entryCode,
        ),

        /*
         * SSE 갱신 조회에서는 기존 로딩 상태를
         * 강제로 바꾸지 않습니다.
         */
        ...(showLoading
          ? { isLoading: false }
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

      /*
       * 일반 조회 실패는 사용자 화면에 표시합니다.
       * SSE 백그라운드 갱신 실패는 콘솔에만 남깁니다.
       */
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
        set({
          isLoading: false,
        })
      }
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
    image,
    comment,
  ) => {
    try {
      set({
        isLoading: true,
        error: null,
      })

      await completeMissionApi(
        entryCode,
        position,
        image,
        comment,
      )

      /*
       * 내 화면은 PATCH 직후 바로 갱신합니다.
       * 상대 화면은 SSE room-update 이벤트를 받은 뒤
       * fetchRoom을 호출하여 갱신됩니다.
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
    image,
    comment,
  ) => {
    try {
      set({
        isLoading: true,
        error: null,
      })

      await sabotageMissionApi(
        entryCode,
        position,
        image,
        comment,
      )

      /*
       * 내 화면은 PATCH 직후 바로 갱신합니다.
       * 상대 화면은 SSE room-update 이벤트를 받은 뒤
       * fetchRoom을 호출하여 갱신됩니다.
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
