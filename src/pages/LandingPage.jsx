import { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { googleLogin } from '../api/authApi'

import MobileShell from '../components/MobileShell'
import PixelMascot from '../components/PixelMascot'
import TutorialSlides from '../components/TutorialSlides'
import useAuthStore from '../stores/authStore'
import logo from '../assets/logo.png'
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
  const [errorMessage, setErrorMessage] = useState('')
  const [googleButtonWidth, setGoogleButtonWidth] = useState(
    () => Math.min(350, window.innerWidth - 40),
  )

  useEffect(() => {
    if (isAuthenticated && member?.nickname) {
      navigate('/lobby', { replace: true })
    }
  }, [isAuthenticated, member, navigate])

  useEffect(() => {
    const updateGoogleButtonWidth = () => {
      setGoogleButtonWidth(
        Math.max(240, Math.min(350, window.innerWidth - 40)),
      )
    }

    window.addEventListener('resize', updateGoogleButtonWidth)

    return () => {
      window.removeEventListener('resize', updateGoogleButtonWidth)
    }
  }, [])

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



  if (mode === 'tutorial' && isAuthenticated) {
    return <MobileShell><TutorialSlides onComplete={() => navigate('/nickname')} /></MobileShell>
  }

  return (
    <MobileShell bgColor="bg-[#00C8B3]">
      <main className="safe-bottom flex min-h-dvh w-full flex-col items-center px-5 text-center sm:min-h-full">
        <div className="flex w-full max-w-[339px] items-center justify-center pt-[clamp(72px,15dvh,148px)]">
          <img src={logo} alt="PlayBit Logo" className="h-auto w-full object-contain" style={{ imageRendering: 'pixelated' }} />
        </div>
        
        <div className="mt-[clamp(36px,7dvh,56px)] flex h-[clamp(190px,30dvh,254px)] w-[min(58vw,229px)] items-center justify-center">
          <PixelMascot size="custom" className="h-full w-full" />
        </div>
        
        <div className="mt-auto flex w-full max-w-[350px] flex-col items-center gap-4 pt-10">
          <div className="flex w-full justify-center">
            <GoogleLogin
              width={String(googleButtonWidth)}
              shape="pill"
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMessage('Google 로그인에 실패했습니다.')}
            />
          </div>
          {errorMessage && <p className="text-xs font-bold text-[#9C3434]">{errorMessage}</p>}
        </div>
      </main>
    </MobileShell>
  )
}

export default LandingPage
