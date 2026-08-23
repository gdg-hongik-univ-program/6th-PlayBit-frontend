import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateNickname } from '../api/memberApi'
import MobileShell from '../components/MobileShell'
import useAuthStore from '../stores/authStore'
import arrowIcon from '../assets/arrow-icon.png'
import Button from '../components/Button'

function NicknamePage() {
  const navigate = useNavigate()
  const member = useAuthStore((state) => state.member)
  const setMember = useAuthStore((state) => state.setMember)
  const [nickname, setNickname] = useState(member?.nickname || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleNicknameSubmit = async (event) => {
    event.preventDefault()
    const trimmedNickname = nickname.trim()
    if (!trimmedNickname) return

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      const response = await updateNickname(trimmedNickname)
      setMember(response?.data ?? { ...member, nickname: trimmedNickname })
      
      // If member already had a nickname, they were editing from settings.
      // After editing, go back to settings (or lobby). Let's go to lobby or -1.
      if (member?.nickname) {
        navigate('/settings', { replace: true })
      } else {
        navigate('/lobby', { replace: true })
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error?.message || error.message || '닉네임 설정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MobileShell bgColor="bg-white">
      <div className="flex min-h-dvh flex-col sm:min-h-full">
      <div className="safe-header flex w-full items-center justify-end px-5">
        {member?.nickname && (
          <button 
            type="button" 
            onClick={() => navigate('/settings')} 
            className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-80"
            aria-label="닫기"
          >
            <img src={arrowIcon} alt="닫기" className="h-full w-full object-contain scale-x-[-1]" />
          </button>
        )}
      </div>
      <form onSubmit={handleNicknameSubmit} className="safe-bottom flex flex-1 flex-col items-center px-5 pt-[clamp(24px,7dvh,60px)] min-[380px]:px-6">
        <h1 className="pixel-title text-center text-[clamp(24px,7vw,28px)] font-black text-[#211A35]">
          닉네임을 입력해주세요
        </h1>
        
        <input 
          id="nickname" 
          className="pixel-input mt-12 w-full text-center text-xl" 
          value={nickname} 
          onChange={(event) => setNickname(event.target.value.slice(0, 10))} 
          placeholder="바나나 치" 
          autoFocus 
        />
        
        <p className="mt-4 text-xs font-normal text-gray-500">
          공백 제외 2~10자 이내 (특수문자 불가)
        </p>
        
        <Button 
          type="submit" 
          disabled={nickname.trim().length < 2 || isSubmitting} 
          className="mt-8"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </Button>
        
        {errorMessage && (
          <div className="mt-4 flex flex-col w-full justify-center items-center gap-2">
            <p className="text-[#E45353] text-sm font-normal text-center pixel-title">
              {errorMessage.includes('이미 사용') || errorMessage.includes('중복') || errorMessage.includes('409')
                ? '이미 사용 중인 닉네임입니다.'
                : errorMessage}
            </p>
          </div>
        )}
      </form>
      </div>
    </MobileShell>
  )
}

export default NicknamePage
