import { useEffect, useState } from 'react'
import plusButtonImg from '../assets/plus-button.png'
import closeIcon from '../assets/close-icon.png'

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
      <section className="safe-bottom max-h-[92dvh] w-full max-w-[430px] overflow-y-auto rounded-t-[30px] bg-white p-4 shadow-2xl min-[380px]:p-5">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-[#CBD0DB]" />
        <div className="flex items-start justify-between"><div><p className={`pixel-title text-3xl font-normal ${isSabotage ? 'text-[#D65353]' : 'text-[#00D0B3]'}`}>{isSabotage ? '사보타주 인증' : '미션 인증'}</p><h2 className="mt-2 text-lg font-normal text-gray-700">{mission?.content ?? '미션'}</h2></div><button type="button" onClick={handleClose} disabled={isSubmitting} className="flex h-8 w-8 items-center justify-center transition-transform hover:scale-105 active:scale-95"><img src={closeIcon} alt="닫기" className="h-full w-full object-contain" /></button></div>
        <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#96E4D6] bg-[#E5FAF7] p-4 text-center">
          {previewUrl ? <img src={previewUrl} alt="선택한 인증 사진 미리보기" className="max-h-56 w-full rounded-xl object-contain" /> : <><strong className="text-xs font-normal">{isSabotage ? '사진으로 사보타주를 인증해주세요' : '사진으로 미션을 인증해주세요'}</strong><img src={plusButtonImg} alt="사진 추가" className="my-3 w-12 h-12 object-contain" /><span className="text-[9px] text-[#7B8299]">JPG, JPEG, PNG / 최대 10MB</span></>}
          <input type="file" accept="image/jpeg,image/png" onChange={handlePhotoChange} className="sr-only" />
        </label>
        <textarea id="missionComment" value={comment} onChange={(event) => setComment(event.target.value.slice(0, 100))} className="mt-6 min-h-20 w-full resize-none rounded-xl border-2 border-[#E1E4F0] bg-[#F8F9FB] p-3 text-xs outline-none focus:border-[#00D0B3]" placeholder="미션 완료 후기를 남겨주세요." />
        {errorMessage && <p className="mt-3 text-xs font-bold text-[#B24949]">{errorMessage}</p>}
        <button type="button" onClick={handleComplete} disabled={!photoFile || isSubmitting} className="pixel-button-mint mt-5 w-full">{isSubmitting ? '인증 중...' : isSabotage ? '사보타주 인증 완료' : '미션 인증 완료'}</button>
      </section>
    </div>
  )
}

export default MissionPhoto
