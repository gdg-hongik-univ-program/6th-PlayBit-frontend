function MissionHistoryModal({
  mission,
  isOpen,
  onClose,
}) {
  if (!isOpen || !mission) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6">
        {/* 상단 */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#8B00F5]">
              미션 인증 내역
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#302842]">
              {mission.content}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500"
          >
            ×
          </button>
        </div>

        {/* 미션 완료 인증 사진 */}
        {mission.imageUrl && (
          <div>
            <p className="mb-2 text-sm font-bold text-[#302842]">
              미션 완료 인증
            </p>

            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={mission.imageUrl}
                alt="미션 완료 인증"
                className="h-[280px] w-full object-cover"
              />
            </div>

            {mission.comment && (
              <div className="mt-3 rounded-2xl bg-gray-50 px-4 py-3">
                <p className="text-sm leading-6 text-[#302842]">
                  {mission.comment}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 사보타주 인증 */}
        {mission.sabotageImageUrl && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-bold text-[#E05252]">
              사보타주 인증
            </p>

            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={mission.sabotageImageUrl}
                alt="사보타주 인증"
                className="h-[280px] w-full object-cover"
              />
            </div>

            {mission.sabotageComment && (
              <div className="mt-3 rounded-2xl bg-[#FFF1F1] px-4 py-3">
                <p className="text-sm leading-6 text-[#302842]">
                  {mission.sabotageComment}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-12 w-full rounded-2xl bg-[#302842] font-bold text-white"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default MissionHistoryModal