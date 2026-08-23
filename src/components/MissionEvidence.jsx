import closeIcon from '../assets/close-icon.png'

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl || /^(https?:|blob:|data:)/i.test(imageUrl)) {
    return imageUrl
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) return imageUrl

  return `${baseUrl.replace(/\/$/, '')}/${imageUrl.replace(/^\//, '')}`
}

function EvidenceSection({ title, imageUrl, comment, timestamp }) {
  const resolvedImageUrl = resolveImageUrl(imageUrl)
  
  const formatTime = (isoString) => {
    if (!isoString) return ''
    try {
      const date = new Date(isoString)
      return date.toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    } catch (e) {
      return ''
    }
  }

  return (
    <section className="mt-5">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-xs font-normal">{title}</h3>
        {timestamp && <span className="text-[10px] text-[#7B8299]">{formatTime(timestamp)}</span>}
      </div>
      {resolvedImageUrl ? (
        <div className="flex justify-center rounded-xl bg-[#E5FAF7] border border-[#96E4D6] p-2">
          <img
            src={resolvedImageUrl}
            alt={`${title} 사진`}
            className="max-h-80 w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex min-h-36 items-center justify-center rounded-xl border border-[#96E4D6] bg-[#E5FAF7] px-4 text-center text-xs font-normal text-[#00D0B3]">
          서버 응답에 사진 주소가 없습니다.
        </div>
      )}
      <p className="mt-4 text-xs font-normal">인증 코멘트</p>
      <div className="mt-2 min-h-11 rounded-xl border-2 border-[#E1E4F0] bg-[#F8F9FB] px-3 py-3 text-xs text-gray-700">
        {comment || '작성된 코멘트가 없습니다.'}
      </div>
    </section>
  )
}

function MissionEvidence({ mission, mode, isOpen, onClose }) {
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
            <p className={`pixel-title text-3xl font-normal ${mode === 'sabotage' ? 'text-[#D65353]' : 'text-[#00D0B3]'}`}>
              {mode === 'sabotage' ? '사보타주 인증' : '미션 인증'}
            </p>
            <h2 className="mt-2 text-lg font-normal text-gray-700">
              {mission.content}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center transition-transform hover:scale-105 active:scale-95"
            aria-label="닫기"
          >
            <img src={closeIcon} alt="닫기" className="h-full w-full object-contain" />
          </button>
        </div>

        {mode === 'complete' && (
          <EvidenceSection
            title="인증 사진"
            imageUrl={mission.imageUrl}
            comment={mission.comment}
            timestamp={mission.completedAt}
          />
        )}

        {mode === 'sabotage' && (mission.sabotageImageUrl || mission.sabotageComment) && (
          <EvidenceSection
            title="사보타주 인증"
            imageUrl={mission.sabotageImageUrl}
            comment={mission.sabotageComment}
            timestamp={mission.sabotagedAt || mission.sabotageCreatedAt}
          />
        )}
      </section>
    </div>
  )
}

export default MissionEvidence
