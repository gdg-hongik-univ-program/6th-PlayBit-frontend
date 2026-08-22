import { useEffect, useState } from 'react'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

function MissionPhoto({ mission, mode, isOpen, onClose, onComplete }) {
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [comment, setComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const clearPhoto = () => {
    setPhotoFile(null)
    setPreviewUrl(null)
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    setErrorMessage('')
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('JPG, JPEG, PNG 파일만 업로드할 수 있어요.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('사진은 최대 10MB까지 업로드할 수 있어요.')
      event.target.value = ''
      return
    }
    setPhotoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleComplete = async () => {
    if (!photoFile) {
      setErrorMessage('인증 사진을 먼저 선택해주세요.')
      return
    }
    try {
      setIsSubmitting(true)
      setErrorMessage('')
      await onComplete?.({ photoFile, comment: comment.trim() })
      clearPhoto()
      setComment('')
    } catch (error) {
      setErrorMessage(error?.message || '미션 인증에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    clearPhoto()
    setComment('')
    setErrorMessage('')
    onClose?.()
  }

  if (!isOpen) return null

  const isSabotage = mode === 'sabotage'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#10131E]/55">
      <section className="max-h-[92dvh] w-full max-w-[430px] overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-[#CBD0DB]" />
        <div className="flex items-start justify-between"><div><p className={`text-[10px] font-black ${isSabotage ? 'text-[#D65353]' : 'text-[#6978BF]'}`}>{isSabotage ? '사보타주 인증' : '미션 인증'}</p><h2 className="pixel-title mt-1 text-lg font-black">{mission?.content ?? '미션'}</h2></div><button type="button" onClick={handleClose} disabled={isSubmitting} className="text-2xl font-black">×</button></div>
        <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#A9B8EE] bg-[#F6F7FF] p-4 text-center">
          {previewUrl ? <img src={previewUrl} alt="선택한 인증 사진 미리보기" className="max-h-56 w-full rounded-xl object-contain" /> : <><span className="text-3xl">▣</span><strong className="mt-3 text-xs">{isSabotage ? '사진으로 사보타주를 인증해주세요' : '사진으로 미션을 인증해주세요'}</strong><span className="mt-1 text-[9px] text-[#7B8299]">JPG, JPEG, PNG / 최대 10MB</span></>}
          <input type="file" accept="image/jpeg,image/png" onChange={handlePhotoChange} className="sr-only" />
        </label>
        <label htmlFor="missionComment" className="mt-5 block text-xs font-black">인증 한마디</label>
        <textarea id="missionComment" value={comment} onChange={(event) => setComment(event.target.value.slice(0, 100))} className="mt-2 min-h-20 w-full resize-none rounded-xl border-2 border-[#E1E4F0] bg-[#F8F9FC] p-3 text-xs outline-none focus:border-[#7183D1]" placeholder="미션을 완수한 한마디를 남겨주세요." />
        {errorMessage && <p className="mt-3 text-xs font-bold text-[#B24949]">{errorMessage}</p>}
        <button type="button" onClick={handleComplete} disabled={!photoFile || isSubmitting} className="pixel-button mt-5 w-full">{isSubmitting ? '인증 중...' : isSabotage ? '사보타주 인증 완료' : '미션 인증 완료'}</button>
      </section>
    </div>
  )
}

export default MissionPhoto
