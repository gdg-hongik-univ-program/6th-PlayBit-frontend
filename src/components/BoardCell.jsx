import useGameStore from '../stores/gameStore'

function BoardCell({
  entryCode,
  mission,
  players,
  disabled = false,
}) {
  const completeMission = useGameStore(
    (state) => state.completeMission,
  )

  const sabotageMission = useGameStore(
    (state) => state.sabotageMission,
  )

  const myMemberId = useGameStore(
    (state) => state.myMemberId,
  )

  const currentTurnMemberId = useGameStore(
    (state) => state.currentTurnMemberId,
  )

  const currentTurnSabotaged = useGameStore(
    (state) => state.currentTurnSabotaged,
  )

  const status = useGameStore(
    (state) => state.status,
  )

  const isLoading = useGameStore(
    (state) => state.isLoading,
  )

  const completedByMemberId =
    mission.completedByMemberId

  const isCompleted =
    completedByMemberId !== null &&
    completedByMemberId !== undefined

  const completedPlayer = players.find(
    (player) =>
      String(player.memberId) ===
      String(completedByMemberId),
  )

  const mark = completedPlayer?.role ?? null

  /*
   * 현재 사용자가 완료한 칸인지 확인
   */
  const isMyCompletedCell =
    isCompleted &&
    myMemberId !== null &&
    myMemberId !== undefined &&
    String(completedByMemberId) ===
      String(myMemberId)

  /*
   * 상대방이 완료한 칸인지 확인
   */
  const isOpponentCompletedCell =
    isCompleted &&
    myMemberId !== null &&
    myMemberId !== undefined &&
    String(completedByMemberId) !==
      String(myMemberId)

  /*
   * 현재 내 턴인지 확인
   */
  const isMyTurn =
    myMemberId !== null &&
    myMemberId !== undefined &&
    currentTurnMemberId !== null &&
    currentTurnMemberId !== undefined &&
    String(currentTurnMemberId) ===
      String(myMemberId)

  /*
   * 백엔드 명세의 필드명은
   * sabotagedByOpponent입니다.
   *
   * 기존 sabotaged 필드도 임시 호환합니다.
   */
  const isAlreadySabotaged =
    mission.sabotagedByOpponent ??
    mission.sabotaged ??
    false

  /*
   * 게임 진행 중이 아니거나
   * API 요청 중이면 모든 상호작용을 막습니다.
   */
  const isInteractionDisabled =
    disabled ||
    isLoading ||
    status !== 'PLAYING'

  /*
   * 미션 완료 조건
   *
   * 1. 게임 진행 중
   * 2. 내 턴
   * 3. 아직 완료되지 않은 빈칸
   */
  const canComplete =
    !isInteractionDisabled &&
    isMyTurn &&
    !isCompleted

  /*
   * 사보타주 조건
   *
   * 1. 게임 진행 중
   * 2. 현재 턴이 존재함
   * 3. 상대방 턴
   * 4. 상대방이 완료한 칸
   * 5. 아직 사보타주되지 않은 칸
   * 6. 이번 턴에 사보타주를 사용하지 않음
   */
  const canSabotage =
    !isInteractionDisabled &&
    currentTurnMemberId !== null &&
    currentTurnMemberId !== undefined &&
    !isMyTurn &&
    isOpponentCompletedCell &&
    !isAlreadySabotaged &&
    !currentTurnSabotaged

  const onComplete = async () => {
    if (!canComplete) {
      return
    }

    try {
      await completeMission(
        entryCode,
        mission.position,
      )
    } catch (error) {
      console.error(
        '미션 완료 요청 실패:',
        error,
      )
    }
  }

  const onSabotage = async () => {
    if (!canSabotage) {
      return
    }

    try {
      await sabotageMission(
        entryCode,
        mission.position,
      )
    } catch (error) {
      console.error(
        '사보타주 요청 실패:',
        error,
      )
    }
  }

  return (
    <article
      className={`flex min-h-[150px] flex-col justify-between rounded-2xl border p-4 transition ${
        isCompleted
          ? 'border-[#D8C8FF] bg-[#F7F4FF]'
          : 'border-[#E6DEF8] bg-white hover:border-[#8B00F5]'
      }`}
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEE8FF] text-xs font-black text-[#8B00F5]">
            {mission.position + 1}
          </span>

          {mark && (
            <span className="text-2xl font-black text-[#8B00F5]">
              {mark}
            </span>
          )}
        </div>

        <p className="break-keep text-sm font-semibold leading-5 text-[#302842]">
          {mission.content}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {isMyCompletedCell && (
          <span className="rounded-full bg-[#EEE8FF] px-2 py-1 text-center text-xs font-semibold text-[#8B00F5]">
            내가 완료
          </span>
        )}

        {isAlreadySabotaged && (
          <span className="rounded-full bg-[#FFF1F1] px-2 py-1 text-center text-xs font-semibold text-[#E05252]">
            사보타주 사용됨
          </span>
        )}

        {canComplete && (
          <button
            type="button"
            onClick={onComplete}
            disabled={isLoading}
            className="h-9 rounded-xl bg-[#8B00F5] text-xs font-bold text-white transition hover:bg-[#7700D4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? '처리 중...'
              : '미션 완료'}
          </button>
        )}

        {canSabotage && (
          <button
            type="button"
            onClick={onSabotage}
            disabled={isLoading}
            className="h-9 rounded-xl bg-[#211A35] text-xs font-bold text-white transition hover:bg-[#33284F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? '처리 중...'
              : '사보타주 -6시간'}
          </button>
        )}
      </div>
    </article>
  )
}

export default BoardCell