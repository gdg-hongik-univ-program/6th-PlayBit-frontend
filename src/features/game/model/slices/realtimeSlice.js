import { connectRoomSSE } from '../../../../api/sseApi'

let roomSSEController = null

const isCurrentConnection = (controller) => {
  return (
    !controller.signal.aborted &&
    roomSSEController === controller
  )
}

export const createRealtimeSlice = (set, get) => ({
  connectRoomEvents: (entryCode) => {
    if (!entryCode) {
      console.error(
        '[SSE] entryCode가 없습니다.',
      )
      return
    }

    roomSSEController?.abort()

    const controller = new AbortController()
    roomSSEController = controller

    connectRoomSSE({
      entryCode,
      signal: controller.signal,

      onOpen: () => {
        if (!isCurrentConnection(controller)) {
          return
        }

        set({ error: null })
      },

      onRoomUpdate: async (payload) => {
        if (!isCurrentConnection(controller)) {
          return
        }

        console.log(
          '[SSE] 방 변경 알림:',
          payload?.message,
        )

        try {
          await get().fetchRoom(entryCode, {
            showLoading: false,
            clearError: false,
          })
        } catch (error) {
          console.error(
            '[SSE] 이벤트 수신 후 방 조회 실패:',
            error,
          )
        }
      },
    }).catch((error) => {
      if (controller.signal.aborted) {
        return
      }

      console.error(
        '[SSE] 연결 실행 오류:',
        error,
      )

      if (roomSSEController === controller) {
        roomSSEController = null
      }
    })
  },

  disconnectRoomEvents: () => {
    roomSSEController?.abort()
    roomSSEController = null
  },
})
