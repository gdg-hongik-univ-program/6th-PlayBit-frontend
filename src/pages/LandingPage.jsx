import { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

import { googleLogin } from '../api/authApi'
import { updateNickname } from '../api/memberApi'
import useAuthStore from '../stores/authStore'

function LandingPage() {
  const navigate = useNavigate()

  const member = useAuthStore((state) => state.member)
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  )
  const setMember = useAuthStore((state) => state.setMember)

  const [nickname, setNickname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // member 상태를 보고 바로 계산
  const isNicknameStep =
    isAuthenticated && member?.nickname === null

  // 기존 회원이면 바로 로비로 이동
  useEffect(() => {
    if (isAuthenticated && member?.nickname) {
      navigate('/lobby', { replace: true })
    }
  }, [isAuthenticated, member, navigate])

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setErrorMessage('')

      const idToken = credentialResponse.credential

      if (!idToken) {
        setErrorMessage(
          'Google 로그인 정보를 가져오지 못했습니다.',
        )
        return
      }

      const response = await googleLogin(idToken)
      const loggedInMember = response.data

      // authStore 갱신
      setMember(loggedInMember)

      // 기존 회원
      if (loggedInMember.nickname !== null) {
        navigate('/lobby', { replace: true })
      }

      // nickname === null이면
      // member 상태가 바뀌면서 isNicknameStep이 자동으로 true가 됨
    } catch (error) {
      console.error('Google 로그인 실패:', error)

      setErrorMessage(
        error.response?.data?.error?.message ||
          'Google 로그인에 실패했습니다.',
      )
    }
  }

  const handleNicknameSubmit = async (event) => {
    event.preventDefault()

    const trimmedNickname = nickname.trim()

    if (!trimmedNickname) {
      setErrorMessage('닉네임을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const response = await updateNickname(trimmedNickname)

      if (response?.data) {
        setMember(response.data)
      } else {
        setMember({
          ...member,
          nickname: trimmedNickname,
        })
      }

      navigate('/lobby', { replace: true })
    } catch (error) {
      console.error('닉네임 설정 실패:', error)

      setErrorMessage(
        error.response?.data?.error?.message ||
          '닉네임 설정에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#F8F5FF]
        flex
        items-center
        justify-center
        px-6
      "
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <h1 className="text-6xl font-bold text-[#8B00FF]">
          PlayBit
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          친구와 함께 습관을 게임처럼 만들어보세요
        </p>

        {!isNicknameStep ? (
          <div className="mt-10">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setErrorMessage(
                  'Google 로그인에 실패했습니다.',
                )
              }}
            />
          </div>
        ) : (
          <form
            onSubmit={handleNicknameSubmit}
            className="mt-10 flex w-full flex-col items-center gap-4"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                사용할 닉네임을 정해주세요
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                게임에서 다른 플레이어에게 표시되는 이름입니다.
              </p>
            </div>

            <input
              type="text"
              value={nickname}
              onChange={(event) =>
                setNickname(event.target.value)
              }
              placeholder="닉네임 입력"
              maxLength={20}
              disabled={isSubmitting}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                outline-none
                focus:border-[#8B00FF]
              "
            />

            <button
              type="submit"
              disabled={!nickname.trim() || isSubmitting}
              className="
                w-full
                rounded-xl
                bg-[#8B00FF]
                px-4
                py-3
                font-semibold
                text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSubmitting ? '설정 중...' : '시작하기'}
            </button>
          </form>
        )}

        {errorMessage && (
          <p className="mt-4 text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    </main>
  )
}

export default LandingPage