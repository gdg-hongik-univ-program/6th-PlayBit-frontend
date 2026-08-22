import { connectRoomSSE } from '../../../../api/sseApi'

let roomSSEController = null

const isCurrentConnection = (controller) => {
  return (
    !controller.signal.aborted &&
    roomSSEController === controller
  )
}

const hasMissionEvidence = (mission) => {
  return (
    mission &&
    typeof mission === 'object' &&
    mission.position !== null &&
    mission.position !== undefined &&
    (
      mission.imageUrl ||
      mission.comment ||
      mission.sabotageImageUrl ||
      mission.sabotageComment ||
      mission.sabotagedByOpponent !== undefined
    )
  )
}

const getMissionEvidencesFromPayload = (payload) => {
  const singleCandidates = [
    payload?.mission,
    payload?.data?.mission,
    payload?.data?.data?.mission,
    payload?.result?.mission,
    payload?.data,
    payload,
  ]

  const arrayCandidates = [
    payload?.missions,
    payload?.room?.missions,
    payload?.data?.missions,
    payload?.data?.room?.missions,
    payload?.data?.data?.missions,
    payload?.data?.data?.room?.missions,
    payload?.result?.room?.missions,
  ]

  return [
    ...singleCandidates,
    ...arrayCandidates.flatMap(
      (missions) =>
        Array.isArray(missions)
          ? missions
          : [],
    ),
  ].filter(hasMissionEvidence)
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
    let refreshPromise = null

    const refreshCurrentRoom = () => {
      if (refreshPromise) {
        return refreshPromise
      }

      refreshPromise = get()
        .fetchRoom(entryCode, {
          showLoading: false,
          clearError: false,
        })
        .finally(() => {
          refreshPromise = null
        })

      return refreshPromise
    }

    connectRoomSSE({
      entryCode,
      signal: controller.signal,

      onOpen: async () => {
        if (!isCurrentConnection(controller)) {
          return
        }

        set({ error: null })

        /*
         * 최초 GET과 SSE 연결 사이에 두 번째 플레이어가 입장한 경우도
         * 현재 상태를 즉시 동기화합니다.
         */
        try {
          await refreshCurrentRoom()
        } catch (error) {
          console.error(
            '[SSE] 연결 직후 방 조회 실패:',
            error,
          )
        }
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
          await refreshCurrentRoom()

          /*
           * 방 조회의 MissionItem에는 인증 사진 URL이 없으므로,
           * SSE가 전달한 MissionDto가 있다면 조회 결과에 다시 합칩니다.
           */
          const missionEvidences =
            getMissionEvidencesFromPayload(payload)

          if (missionEvidences.length > 0) {
            set((state) => ({
              missions: state.missions.map(
                (mission) => {
                  const missionEvidence =
                    missionEvidences.find(
                      (evidence) =>
                        String(evidence.position) ===
                        String(mission.position),
                    )

                  return missionEvidence
                    ? {
                        ...mission,
                        ...missionEvidence,
                      }
                    : mission
                },
              ),
            }))
          }
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
