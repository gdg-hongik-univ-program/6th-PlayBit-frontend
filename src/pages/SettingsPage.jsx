import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateNickname } from '../api/memberApi'
import MobileShell from '../components/MobileShell'
import NotificationButton from '../components/NotificationButton'
import PageHeader from '../components/PageHeader'
import useGameStore from '../features/game/model/gameStore'
import useAuthStore from '../stores/authStore'

import arrowIcon from '../assets/arrow-icon.png'
import studyImg from '../assets/study.png'

function SettingsPage() {
  const navigate = useNavigate()
  const member = useAuthStore((state) => state.member)
  const setMember = useAuthStore((state) => state.setMember)
  const logout = useAuthStore((state) => state.logout)
  const resetRoomState = useGameStore((state) => state.resetRoomState)
  const handleLogout = async () => {
    await logout()
    resetRoomState()
    navigate('/', { replace: true })
  }

  return (
    <MobileShell bgColor="bg-white">
      <PageHeader 
        title="환경 설정" 
        action={
          <button type="button" onClick={() => navigate('/lobby')} aria-label="닫기" className="flex h-9 w-9 items-center justify-center hover:opacity-80 transition-opacity">
            <img src={arrowIcon} alt="닫기" className="h-full w-full object-contain scale-x-[-1]" />
          </button>
        } 
      />
      <main className="space-y-12 px-5 pb-10 pt-8 text-[#171717]">
        <section>
          <h2 className="mb-6 border-b border-gray-200 pb-4 pixel-title text-2xl font-black">프로필</h2>
          <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3C496]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-8 w-8">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold">{member?.nickname}</p>
              <p className="truncate text-sm text-gray-500 mt-1">{member?.email ?? 'Google 계정'}</p>
            </div>
            <button type="button" onClick={() => navigate('/nickname')} className="p-2 transition-transform hover:scale-110 hover:opacity-80">
              <img src={studyImg} alt="닉네임 수정" className="h-9 w-9 object-contain" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-6 border-b border-gray-200 pb-4 pixel-title text-2xl font-black">기타</h2>
          <div className="space-y-6 border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between text-lg font-normal">
              <span>알림 받기</span>
              <NotificationButton compact />
            </div>
            <button type="button" onClick={() => navigate('/tutorial')} className="flex w-full items-center justify-between text-lg font-normal hover:opacity-70 transition-opacity">
              <span>튜토리얼 다시 보기</span>
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-6 border-b border-gray-200 pb-4 pixel-title text-2xl font-black">계정 및 정보</h2>
          <div className="space-y-6 border-b border-gray-200 pb-6">
            <button type="button" onClick={handleLogout} className="w-full text-left text-lg font-normal hover:opacity-70 transition-opacity">로그아웃</button>
            <button type="button" disabled className="w-full text-left text-lg font-normal text-gray-300 cursor-not-allowed decoration-gray-300 decoration-solid underline-offset-4">탈퇴하기</button>
          </div>
        </section>
      </main>
    </MobileShell>
  )
}

export default SettingsPage
