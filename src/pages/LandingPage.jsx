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



  if (mode === 'tutorial' && isAuthenticated) {
    return <MobileShell><TutorialSlides onComplete={() => navigate('/nickname')} /></MobileShell>
  }

  return (
    <MobileShell bgColor="bg-[#00C8B3]">
      <main className="relative min-h-dvh w-full text-center sm:h-full sm:min-h-0">
        <div className="absolute left-[32px] top-[148px] flex h-[133px] w-[339px] items-center justify-center">
          <img src={logo} alt="PlayBit Logo" className="h-full w-full object-contain" style={{ imageRendering: 'pixelated' }} />
        </div>
        
        <div className="absolute left-[81px] top-[337px] flex h-[254px] w-[229px] items-center justify-center">
          <PixelMascot size="custom" className="h-full w-full" />
        </div>
        
        <div className="absolute left-[21px] top-[678px] flex w-[350px] flex-col items-center gap-4">
          <div className="flex w-full justify-center">
            <GoogleLogin
              width="350"
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
