import {
  fetchEventSource,
} from '@microsoft/fetch-event-source'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL

export const connectRoomSSE = ({
  entryCode,
  signal,
  onOpen,
  onRoomUpdate,
  onError,
}) => {
  if (!API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL이 설정되지 않았습니다.',
    )
  }

  if (!entryCode) {
    throw new Error(
      'SSE 연결에 필요한 entryCode가 없습니다.',
    )
  }

  const baseUrl =
    API_BASE_URL.endsWith('/')
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL

  const url =
    `${baseUrl}/api/rooms/` +
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

      onOpen?.()
    },

    onmessage(event) {
  if (!event.data) {
    return
  }

  let payload

  try {
    payload = JSON.parse(event.data)
  } catch {
    console.log(
      'SSE 문자열 메시지 수신:',
      {
        eventName:
          event.event || 'message',
        message: event.data,
      },
    )

    return
  }

  if (event.event !== 'room-update') {
    return
  }

  onRoomUpdate?.(payload)
},

    onclose() {
      console.log(
        'SSE 연결 종료:',
        entryCode,
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
       * 500 등의 오류에서 무한 재연결 방지
       */
      throw error
    },
  })
}
