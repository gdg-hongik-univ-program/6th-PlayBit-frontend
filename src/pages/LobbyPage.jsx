import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMemberStats } from '../api/memberApi'
import MobileShell from '../components/MobileShell'
import PixelMascot from '../components/PixelMascot'
import useAuthStore from '../stores/authStore'
import homeBg from '../assets/home-bg.jpg'
import settingIcon from '../assets/setting-icon.png'
import roomListIcon from '../assets/roomlist-icon.png'

import fireImg from '../assets/fire.png'
import starImg from '../assets/star.png'

const MASCOT_MESSAGES = [
  "오늘도 좋은 습관 하나\n만들어볼까요?",
  "작은 습관이 모여서\n큰 변화를 만들어요!",
  "오늘도 잊지 않고\n잘 찾아오셨네요!",
  "꾸준함은 절대\n배신하지 않아요!",
  "딱 5분만 해보는 건\n어떨까요?",
  "어제보다 오늘 더\n나아지고 있어요!",
  "시작이 반이에요!\n지금 바로 해볼까요?",
  "천 리 길도\n한 걸음부터 시작해요!",
  "포기하지 않는 당신이\n가장 멋집니다!",
  "매일매일 조금씩\n성장하고 있어요!"
]

function LobbyPage() {
  const navigate = useNavigate()
  const member = useAuthStore((state) => state.member)
  const [stats, setStats] = useState({
    totalMissionSuccess: 0,
    consecutiveMissionStreak: 0,
  })
  const [message] = useState(() => MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)])

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
    <MobileShell bgColor="bg-transparent">
      <main 
        className="flex min-h-dvh flex-col px-5 pb-8 pt-[60px] sm:h-full sm:min-h-0"
        style={{ backgroundImage: `url(${homeBg})`, backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }}
      >
        <header className="flex items-center justify-between w-full">
          <button type="button" onClick={() => navigate('/settings')} className="pixel-press flex h-10 w-10 items-center justify-center hover:opacity-80 transition-opacity" aria-label="환경 설정">
            <img src={settingIcon} alt="설정" className="h-full w-full object-contain" />
          </button>

          <h1 className="pixel-title text-2xl font-black">홈</h1>

          <button type="button" onClick={() => navigate('/rooms')} className="pixel-press flex h-10 w-10 items-center justify-center hover:opacity-80 transition-opacity" aria-label="방 목록">
            <img src={roomListIcon} alt="방 목록" className="h-full w-full object-contain" />
          </button>
        </header>
        
        <section className="mt-8 grid grid-cols-2 gap-5 px-6">
          <article className="pixel-card flex flex-col items-center p-5 text-center !bg-white/70 backdrop-blur-md">
            <img src={fireImg} alt="불꽃" className="h-[48px] w-[48px] object-contain" style={{ imageRendering: 'pixelated' }} />
            <p className="mt-2 text-[11px] font-bold text-[#626B89]">연속 달성</p>
            <strong className="pixel-title mt-1 block text-3xl">{stats.consecutiveMissionStreak}<span className="ml-1 text-sm">일</span></strong>
          </article>
          <article className="pixel-card flex flex-col items-center p-5 text-center !bg-white/70 backdrop-blur-md">
            <img src={starImg} alt="별" className="h-[48px] w-[48px] object-contain" style={{ imageRendering: 'pixelated' }} />
            <p className="mt-2 text-[11px] font-bold text-[#626B89]">총 달성 미션</p>
            <strong className="pixel-title mt-1 block text-3xl">{stats.totalMissionSuccess}<span className="ml-1 text-sm">개</span></strong>
          </article>
        </section>
        
        <section className="mt-auto mb-16 flex flex-col items-center text-center">
          <div className="pixel-card speech-bubble w-fit px-12 py-8 text-xl font-bold leading-relaxed whitespace-pre-wrap">
            {message}
          </div>
          <PixelMascot size="lg" className="mt-6 translate-y-8" />
        </section>
      </main>
    </MobileShell>
  )
}

export default LobbyPage
