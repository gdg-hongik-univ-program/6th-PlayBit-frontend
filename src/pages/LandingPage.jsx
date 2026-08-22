import { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { googleLogin } from '../api/authApi'
import { updateNickname } from '../api/memberApi'
import MobileShell from '../components/MobileShell'
import PixelMascot from '../components/PixelMascot'
import TutorialSlides from '../components/TutorialSlides'
import useAuthStore from '../stores/authStore'

function LandingPage() {
  const navigate = useNavigate()
  const member = useAuthStore((state) => state.member)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setMember = useAuthStore((state) => state.setMember)
  const [mode, setMode] = useState(() =>
    isAuthenticated && member?.nickname === null
      ? 'tutorial'
      : 'login',
  )
  const [nickname, setNickname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isAuthenticated && member?.nickname) {
      navigate('/lobby', { replace: true })
    }
  }, [isAuthenticated, member, navigate])

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setErrorMessage('')
      const idToken = credentialResponse.credential
      if (!idToken) throw new Error('Google 로그인 정보를 가져오지 못했습니다.')
      const response = await googleLogin(idToken)
      const loggedInMember = response.data
      setMember(loggedInMember)
      if (loggedInMember.nickname) {
        navigate('/lobby', { replace: true })
      } else {
        setMode('tutorial')
      }
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      setErrorMessage(error.response?.data?.error?.message || error.message || 'Google 로그인에 실패했습니다.')
    }
  }

  const handleNicknameSubmit = async (event) => {
    event.preventDefault()
    const trimmedNickname = nickname.trim()
    if (!trimmedNickname) return

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      const response = await updateNickname(trimmedNickname)
      setMember(response?.data ?? { ...member, nickname: trimmedNickname })
      navigate('/lobby', { replace: true })
    } catch (error) {
      setErrorMessage(error.response?.data?.error?.message || '닉네임 설정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (mode === 'tutorial' && isAuthenticated) {
    return <MobileShell><TutorialSlides onComplete={() => setMode('nickname')} /></MobileShell>
  }

  if (mode === 'nickname' && isAuthenticated) {
    return (
      <MobileShell>
        <form onSubmit={handleNicknameSubmit} className="flex min-h-dvh flex-col px-6 pb-10 pt-24">
          <span className="text-xs font-black text-[#485587]">WELCOME, PLAYER!</span>
          <h1 className="pixel-title mt-3 text-3xl font-black">닉네임을 정해주세요</h1>
          <p className="mt-3 text-sm leading-6 text-[#4C5575]">친구가 알아볼 수 있는 이름이면 좋아요. 2~10자로 입력해주세요.</p>
          <PixelMascot size="md" className="mx-auto my-10" />
          <label htmlFor="nickname" className="mb-2 text-xs font-black">닉네임</label>
          <input id="nickname" className="pixel-input" value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 10))} placeholder="바나나 치" autoFocus />
          {errorMessage && <p className="mt-3 rounded-xl bg-[#525E8C] px-4 py-3 text-xs font-bold text-white">⚠ {errorMessage}</p>}
          <button type="submit" disabled={nickname.trim().length < 2 || isSubmitting} className="pixel-button mt-auto w-full">{isSubmitting ? '저장 중...' : '저장하기'}</button>
        </form>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <main className="flex min-h-dvh flex-col items-center px-6 pb-12 pt-24 text-center">
        <p className="text-xs font-black tracking-[0.28em] text-[#4D5989]">HABIT TIC-TAC-TOE</p>
        <h1 className="pixel-title mt-3 text-5xl font-black tracking-[-0.12em]">PlayBit</h1>
        <PixelMascot size="lg" className="mt-12" />
        <p className="mt-6 break-keep text-sm font-bold leading-6 text-[#394260]">친구와 미션을 인증하고<br />세 칸을 먼저 완성해보세요.</p>
        <div className="mt-auto flex w-full flex-col items-center gap-4">
          <div className="w-full overflow-hidden rounded-xl bg-white p-1 shadow-[0_4px_0_#4A5687]">
            <GoogleLogin width="260" onSuccess={handleGoogleSuccess} onError={() => setErrorMessage('Google 로그인에 실패했습니다.')} />
          </div>
          {errorMessage && <p className="text-xs font-bold text-[#9C3434]">{errorMessage}</p>}
          <p className="text-[10px] text-[#596486]">계속하면 서비스 이용약관에 동의한 것으로 간주합니다.</p>
        </div>
      </main>
    </MobileShell>
  )
}

export default LandingPage
