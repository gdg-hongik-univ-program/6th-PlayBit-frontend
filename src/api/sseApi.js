import {
  fetchEventSource,
} from '@microsoft/fetch-event-source'

export const connectRoomSSE = ({
  entryCode,
  signal,
  onOpen,
  onRoomUpdate,
  onError,
}) => {
  if (!entryCode) {
    throw new Error(
      'SSE 연결에 필요한 entryCode가 없습니다.',
    )
  }

  const url =
    '/api/rooms/' +
    `${encodeURIComponent(entryCode)}/subscribe`

  return fetchEventSource(url, {
    method: 'GET',
    credentials: 'include',

    headers: {
      /*
       * ngrok 무료 경고 페이지 우회
       */
      'ngrok-skip-browser-warning':
        'true',
    },

    signal,

    /*
     * 탭이 비활성화돼도 연결 유지
     */
    openWhenHidden: true,

    async onopen(response) {
      const contentType =
        response.headers.get(
          'content-type',
        )

      if (!response.ok) {
        let responseBody
        
        try {
          responseBody =
            await response.text()
        } catch {
          responseBody =
            '응답 본문을 읽지 못했습니다.'
        }

        console.error(
          'SSE 서버 오류 응답:',
          {
            status:
              response.status,
            body: responseBody,
          },
        )

        throw new Error(
          `SSE 연결 실패: ${response.status}`,
        )
      }

      if (
        !contentType?.includes(
          'text/event-stream',
        )
      ) {
        throw new Error(
          `SSE 응답 형식 오류: ${contentType}`,
        )
      }

      console.log(
        'SSE 연결 성공:',
        entryCode,
      )

      await onOpen?.()
    },

    onmessage(event) {
      if (!event.data) {
        return
      }

      const eventName =
        event.event || 'message'
      let payload

      try {
        payload = JSON.parse(event.data)
      } catch {
        payload = {
          eventName,
          message: event.data,
        }
      }

      /*
       * 백엔드가 named event(room-update) 또는 기본 message 중
       * 어느 형식으로 보내더라도 방 상태를 다시 조회합니다.
       */
      onRoomUpdate?.({
        ...payload,
        eventName,
      })
    },

    onclose() {
      if (signal?.aborted) {
        return
      }

      console.log(
        'SSE 연결이 종료되어 재연결합니다:',
        entryCode,
      )

      throw new Error(
        'SSE 연결이 예기치 않게 종료되었습니다.',
      )
    },

    onerror(error) {
      /*
       * 페이지 이동으로 직접 종료한 경우
       */
      if (signal?.aborted) {
        return
      }

      console.error(
        'SSE 연결 오류:',
        error,
      )

      onError?.(error)

      /*
       * 일시적인 네트워크 오류는 3초 후 재연결합니다.
       */
      return 3000
    },
  })
}
