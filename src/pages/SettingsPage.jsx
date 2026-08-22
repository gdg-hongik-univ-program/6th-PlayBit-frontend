import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateNickname } from '../api/memberApi'
import MobileShell from '../components/MobileShell'
import NotificationButton from '../components/NotificationButton'
import PageHeader from '../components/PageHeader'
import useGameStore from '../features/game/model/gameStore'
import useAuthStore from '../stores/authStore'

function SettingsPage() {
  const navigate = useNavigate()
  const member = useAuthStore((state) => state.member)
  const setMember = useAuthStore((state) => state.setMember)
  const logout = useAuthStore((state) => state.logout)
  const resetRoomState = useGameStore((state) => state.resetRoomState)
  const [isEditing, setIsEditing] = useState(false)
  const [nickname, setNickname] = useState(member?.nickname ?? '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const value = nickname.trim()
    if (value.length < 2) return
    try {
      setIsSaving(true)
      const response = await updateNickname(value)
      setMember(response?.data ?? { ...member, nickname: value })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    resetRoomState()
    navigate('/', { replace: true })
  }

  return (
    <MobileShell>
      <PageHeader title="환경 설정" onBack={() => navigate('/lobby')} />
      <main className="space-y-8 px-5 pb-10 pt-4">
        <section>
          <p className="mb-3 text-[11px] font-black text-[#4E587B]">프로필</p>
          <div className="pixel-card flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3DCA8] text-xl">🙂</span>
            <div className="min-w-0 flex-1">
              {isEditing ? <input className="pixel-input h-10 min-h-10" value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 10))} autoFocus /> : <><p className="font-black">{member?.nickname}</p><p className="truncate text-[10px] text-[#78809A]">{member?.email ?? 'Google 계정'}</p></>}
            </div>
            <button type="button" onClick={isEditing ? handleSave : () => setIsEditing(true)} disabled={isSaving} className="text-sm font-black">{isEditing ? '저장' : '✎'}</button>
          </div>
        </section>
        <section>
          <p className="mb-3 text-[11px] font-black text-[#4E587B]">일반 설정</p>
          <div className="pixel-card divide-y divide-[#DDE2F4] overflow-hidden">
            <button type="button" onClick={() => navigate('/tutorial')} className="flex w-full items-center justify-between p-4 text-sm font-black"><span>튜토리얼 다시 보기</span><span>→</span></button>
            <div className="flex items-center justify-between p-4 text-sm font-black"><span>알림 받기</span><NotificationButton compact /></div>
          </div>
        </section>
        <section>
          <p className="mb-3 text-[11px] font-black text-[#4E587B]">계정 및 정보</p>
          <div className="pixel-card divide-y divide-[#DDE2F4] overflow-hidden">
            <button type="button" onClick={handleLogout} className="w-full p-4 text-left text-sm font-black">로그아웃</button>
            <button type="button" disabled className="w-full p-4 text-left text-sm font-black text-[#A14A4A] opacity-60">탈퇴하기</button>
          </div>
        </section>
      </main>
    </MobileShell>
  )
}

export default SettingsPage
