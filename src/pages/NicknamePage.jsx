import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateNickname } from '../api/memberApi'
import MobileShell from '../components/MobileShell'
import useAuthStore from '../stores/authStore'
import nicknameTitleImg from '../assets/nickname-title.png'
import nicknameAlertImg from '../assets/nickname-alert.png'
import nicknameRestrictionImg from '../assets/nickname-restriction.png'
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
      <div className="relative h-[112px] w-full">
        {member?.nickname && (
          <button 
            type="button" 
            onClick={() => navigate('/settings')} 
            className="absolute right-5 top-[60px] flex h-9 w-9 items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="닫기"
          >
            <img src={arrowIcon} alt="닫기" className="h-full w-full object-contain scale-x-[-1]" />
          </button>
        )}
      </div>
      <form onSubmit={handleNicknameSubmit} className="flex flex-col items-center px-6 pt-[60px] pb-12 sm:min-h-0" style={{ minHeight: 'calc(100dvh - 4rem)' }}>
        <img src={nicknameTitleImg} alt="닉네임을 입력해주세요" className="w-[280px] object-contain" />
        
        <input 
          id="nickname" 
          className="pixel-input mt-12 w-full text-center text-xl" 
          value={nickname} 
          onChange={(event) => setNickname(event.target.value.slice(0, 10))} 
          placeholder="바나나 치" 
          autoFocus 
        />
        
        <img src={nicknameRestrictionImg} alt="제한 조건" className="mt-4 w-[280px] object-contain" />
        
        <Button 
          type="submit" 
          disabled={nickname.trim().length < 2 || isSubmitting} 
          className="mt-8"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </Button>
        
        {errorMessage && (
          <div className="mt-4 flex flex-col w-full justify-center items-center gap-2">
            {errorMessage.includes('이미 사용') || errorMessage.includes('중복') || errorMessage.includes('409') ? (
              <img src={nicknameAlertImg} alt="경고 메세지" className="w-[300px] object-contain" />
            ) : (
              <p className="text-[#9C3434] text-sm font-black text-center pixel-title">{errorMessage}</p>
            )}
          </div>
        )}
      </form>
    </MobileShell>
  )
}

export default NicknamePage
