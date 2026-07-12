import useGameStore from '../stores/gameStore'

function BoardCell({
  entryCode,
  mission,
  players,
  myRole,
  isMyTurn,
  disabled,
}) {
  const handleCompleteMission = useGameStore(
    (state) => state.handleCompleteMission,
  )

  const handleSabotageMission = useGameStore(
    (state) => state.handleSabotageMission,
  )

  const completedPlayer = players.find(
    (player) => player.memberId === mission.completedByMemberId,
  )

  const mark = completedPlayer?.role ?? null
  const isCompleted = mission.completedByMemberId !== null
  const isMyCompletedCell = completedPlayer?.role === myRole

  const isOpponentCompletedCell =
    isCompleted && completedPlayer && completedPlayer.role !== myRole

  const canComplete = !disabled && isMyTurn && !isCompleted

  const canSabotage =
    !disabled && !isMyTurn && isOpponentCompletedCell && !mission.sabotaged

  const onComplete = () => {
    handleCompleteMission(entryCode, mission.position)
  }

  const onSabotage = () => {
    handleSabotageMission(entryCode, mission.position)
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
            <span className="text-2xl font-black text-[#8B00F5]">{mark}</span>
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

        {mission.sabotaged && (
          <span className="rounded-full bg-[#FFF1F1] px-2 py-1 text-center text-xs font-semibold text-[#E05252]">
            사보타주 사용됨
          </span>
        )}

        {canComplete && (
          <button
            type="button"
            onClick={onComplete}
            className="h-9 rounded-xl bg-[#8B00F5] text-xs font-bold text-white transition hover:bg-[#7700D4]"
          >
            미션 완료
          </button>
        )}

        {canSabotage && (
          <button
            type="button"
            onClick={onSabotage}
            className="h-9 rounded-xl bg-[#211A35] text-xs font-bold text-white transition hover:bg-[#33284F]"
          >
            사보타주 -6시간
          </button>
        )}
      </div>
    </article>
  )
}

export default BoardCell