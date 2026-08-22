import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMemberStats } from '../api/memberApi'
import MobileShell from '../components/MobileShell'
import PixelMascot from '../components/PixelMascot'
import useAuthStore from '../stores/authStore'

function LobbyPage() {
  const navigate = useNavigate()
  const member = useAuthStore((state) => state.member)
  const [stats, setStats] = useState({
    totalMissionSuccess: 0,
    consecutiveMissionStreak: 0,
  })

  useEffect(() => {
    getMemberStats()
      .then((response) => {
        if (response.success && response.data) {
          setStats(response.data)
        }
      })
      .catch((error) => {
        console.error('회원 통계 조회 실패:', error)
      })
  }, [])

  return (
    <MobileShell>
      <main className="flex min-h-dvh flex-col px-5 pb-8 pt-6">
        <header className="flex items-center justify-between">
          <button type="button" onClick={() => navigate('/settings')} className="pixel-press flex h-10 w-10 items-center justify-center rounded-xl bg-white/55 text-xl" aria-label="환경 설정">⚙</button>
          <button type="button" onClick={() => navigate('/rooms')} className="pixel-press flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#45517F] bg-white text-xl" aria-label="방 목록">↔</button>
        </header>
        <section className="mt-8 text-center">
          <div className="pixel-card mx-auto w-fit px-5 py-3 text-xs font-black">오늘도 좋은 습관 하나<br />만들어볼까요?</div>
          <PixelMascot size="lg" className="mx-auto mt-3" />
          <h1 className="pixel-title mt-3 text-2xl font-black">안녕, {member?.nickname ?? '플레이어'}!</h1>
        </section>
        <section className="mt-auto grid grid-cols-2 gap-3">
          <article className="pixel-card p-5 text-center"><span className="text-3xl">🔥</span><p className="mt-2 text-[11px] font-bold text-[#626B89]">연속 달성</p><strong className="pixel-title mt-1 block text-3xl">{stats.consecutiveMissionStreak}<span className="ml-1 text-sm">일</span></strong></article>
          <article className="pixel-card p-5 text-center"><span className="text-3xl">⭐</span><p className="mt-2 text-[11px] font-bold text-[#626B89]">총 달성 미션</p><strong className="pixel-title mt-1 block text-3xl">{stats.totalMissionSuccess}<span className="ml-1 text-sm">개</span></strong></article>
        </section>
        <button type="button" onClick={() => navigate('/rooms')} className="pixel-button mt-5 w-full">게임방 보러가기</button>
      </main>
    </MobileShell>
  )
}

export default LobbyPage
