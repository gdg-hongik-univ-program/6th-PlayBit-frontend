function MissionDetailModal({
  mission,
  isCompleted,
  canComplete,
  canSabotage,
  isAlreadySabotaged,
  isMyTurn,
  onComplete,
  onSabotage,
  onViewEvidence,
  onClose,
}) {
  const unavailableMessage = isCompleted
    ? '완료된 미션의 인증 내역을 확인할 수 있어요.'
    : isMyTurn
      ? '사진을 첨부해 미션 완료를 인증해주세요.'
      : '상대 차례에는 완료된 상대 칸을 사보타주할 수 있어요.'

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#131622]/45 p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="미션 상세"
        className="w-full max-w-[350px] rounded-[26px] bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[11px] font-black">
          미션 {Number(mission.position) + 1}
        </p>
        <h2 className="pixel-title mt-2 text-lg font-black">
          {mission.content}
        </h2>
        <p className="mt-3 text-[11px] font-bold leading-5 text-[#737A91]">
          {unavailableMessage}
        </p>

        <div className="mt-5 space-y-2">
          {isCompleted ? (
            <button
              type="button"
              onClick={() => onViewEvidence('complete')}
              className="w-full rounded-xl bg-[#00D0B3] text-white transition-colors hover:opacity-90 px-4 py-3 text-sm font-black"
            >
              미션 인증 내역 보기
            </button>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              disabled={!canComplete}
              className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-45 transition-colors ${
                canComplete ? 'bg-[#00D0B3] text-white hover:opacity-90' : 'bg-[#E7E8EC]'
              }`}
            >
              미션 완료 인증하기
            </button>
          )}

          {isAlreadySabotaged ? (
            <button
              type="button"
              onClick={() => onViewEvidence('sabotage')}
              className="w-full rounded-xl bg-[#00D0B3] text-white transition-colors hover:opacity-90 px-4 py-3 text-sm font-black"
            >
              사보타주 인증 내역 보기
            </button>
          ) : (
            <button
              type="button"
              onClick={onSabotage}
              disabled={!canSabotage}
              className={`w-full rounded-xl px-4 py-3 text-sm font-black text-[#E45353] transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                canSabotage ? 'bg-[#00D0B3] hover:opacity-90' : 'bg-[#E7E8EC]'
              }`}
            >
              사보타주 인증하기
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#E7E8EC] px-4 py-3 text-sm font-black"
          >
            돌아가기
          </button>
        </div>
      </section>
    </div>
  )
}

export default MissionDetailModal
