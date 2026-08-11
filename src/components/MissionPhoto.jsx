import { useEffect, useState } from 'react'

function MissionPhoto({
  mission,
  isOpen,
  onClose,
  onComplete,
}) {
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [comment, setComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  /*
   * 최대 사진 용량: 10MB
   */
  const MAX_FILE_SIZE = 10 * 1024 * 1024

  /*
   * 허용 파일 형식
   * jpg / jpeg는 브라우저에서 image/jpeg로 들어옴
   */
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
  ]

  /*
   * 선택한 사진의 미리보기 생성
   */
  useEffect(() => {
    if (!photoFile) {
      setPreviewUrl(null)
      return undefined
    }

    const url = URL.createObjectURL(photoFile)

    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [photoFile])

  /*
   * 사진 선택
   */
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]

    /*
     * 이전 에러 메시지 제거
     */
    setErrorMessage('')

    if (!file) {
      return
    }

    /*
     * jpg / jpeg / png 검사
     */
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage(
        'JPG, JPEG, PNG 파일만 업로드할 수 있어요.',
      )

      event.target.value = ''

      return
    }

    /*
     * 10MB 용량 검사
     */
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(
        '사진은 최대 10MB까지 업로드할 수 있어요.',
      )

      event.target.value = ''

      return
    }

    /*
     * 정상적인 사진이면 저장
     */
    setPhotoFile(file)
  }

  /*
   * 인증 완료 버튼
   */
  const handleComplete = async () => {
    if (!photoFile) {
      setErrorMessage(
        '인증 사진을 먼저 선택해주세요.',
      )
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      /*
       * 현재는 사진과 코멘트를 부모에게 전달
       *
       * 실제 API 연결 시
       * photoFile → image
       * comment → comment
       * 로 FormData에 담아 전송하면 됨
       */
      await onComplete?.({
        photoFile,
        comment: comment.trim(),
      })

      /*
       * 성공했을 경우 초기화
       */
      setPhotoFile(null)
      setComment('')
    } catch (error) {
      console.error(
        '미션 사진 인증 실패:',
        error,
      )

      setErrorMessage(
        error?.message ||
          '미션 인증에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /*
   * 모달 닫기
   */
  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    setPhotoFile(null)
    setComment('')
    setErrorMessage('')

    onClose?.()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6">

        {/* 상단 */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#8B00F5]">
              미션 인증
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#302842]">
              {mission?.content ?? '미션'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-2xl text-gray-500 disabled:opacity-40"
          >
            ×
          </button>
        </div>

        {/* 사진 선택 전 */}
        {!previewUrl ? (
          <label className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50 px-4 text-center">

            <div className="mb-3 text-4xl">
              📷
            </div>

            <p className="font-bold text-gray-800">
              사진으로 미션을 인증해주세요
            </p>

            <p className="mt-2 text-sm text-gray-500">
              JPG, JPEG, PNG / 최대 10MB
            </p>

            <span className="mt-5 rounded-xl bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
              사진 선택
            </span>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handlePhotoChange}
              disabled={isSubmitting}
              className="hidden"
            />
          </label>
        ) : (
          /* 사진 선택 후 */
          <div>
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={previewUrl}
                alt="미션 인증 사진 미리보기"
                className="h-[280px] w-full object-cover"
              />
            </div>

            <label className="mt-3 block cursor-pointer text-center text-sm font-bold text-purple-700">
              다른 사진 선택

              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handlePhotoChange}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* 인증 코멘트 */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="mission-comment"
              className="text-sm font-bold text-[#302842]"
            >
              인증 한마디
            </label>

            <span className="text-xs text-gray-400">
              {comment.length}/100
            </span>
          </div>

          <textarea
            id="mission-comment"
            value={comment}
            onChange={(event) =>
              setComment(
                event.target.value.slice(0, 100),
              )
            }
            disabled={isSubmitting}
            placeholder="미션을 어떻게 완료했는지 간단히 적어주세요."
            rows={3}
            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#302842] outline-none transition placeholder:text-gray-400 focus:border-[#8B00F5] focus:bg-white disabled:opacity-50"
          />
        </div>

        {/* 에러 메시지 */}
        {errorMessage && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">
            {errorMessage}
          </p>
        )}

        {/* 인증 버튼 */}
        <button
          type="button"
          onClick={handleComplete}
          disabled={!photoFile || isSubmitting}
          className="mt-6 h-12 w-full rounded-2xl bg-[#8B00F5] font-bold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting
            ? '인증 중...'
            : '인증하고 미션 완료'}
        </button>

      </div>
    </div>
  )
}

export default MissionPhoto