const resolveImageUrl = (imageUrl) => {
  if (!imageUrl || /^(https?:|blob:|data:)/i.test(imageUrl)) {
    return imageUrl
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) return imageUrl

  return `${baseUrl.replace(/\/$/, '')}/${imageUrl.replace(/^\//, '')}`
}

function EvidenceSection({ title, imageUrl, comment }) {
  const resolvedImageUrl = resolveImageUrl(imageUrl)

  return (
    <section className="mt-5">
      <h3 className="text-xs font-black">{title}</h3>
      {resolvedImageUrl ? (
        <img
          src={resolvedImageUrl}
          alt={`${title} 사진`}
          className="mt-2 max-h-80 w-full rounded-xl bg-[#F1F2F6] object-contain"
        />
      ) : (
        <div className="mt-2 flex min-h-36 items-center justify-center rounded-xl bg-[#F1F2F6] px-4 text-center text-xs font-bold text-[#7B8299]">
          서버 응답에 사진 주소가 없습니다.
        </div>
      )}
      <p className="mt-4 text-xs font-black">인증 코멘트</p>
      <div className="mt-2 min-h-11 rounded-xl border border-[#E1E4F0] px-3 py-3 text-xs">
        {comment || '작성된 코멘트가 없습니다.'}
      </div>
    </section>
  )
}

function MissionEvidence({ mission, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#10131E]/55">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="미션 인증 기록"
        className="max-h-[92dvh] w-full max-w-[430px] overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl"
      >
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-[#CBD0DB]" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-[#6978BF]">
              미션 인증 기록 확인
            </p>
            <h2 className="pixel-title mt-1 text-lg font-black">
              {mission.content}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl font-black"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <EvidenceSection
          title="인증 사진"
          imageUrl={mission.imageUrl}
          comment={mission.comment}
        />

        {(mission.sabotageImageUrl || mission.sabotageComment) && (
          <EvidenceSection
            title="사보타주 인증"
            imageUrl={mission.sabotageImageUrl}
            comment={mission.sabotageComment}
          />
        )}
      </section>
    </div>
  )
}

export default MissionEvidence
