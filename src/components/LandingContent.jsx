import { useNavigate } from 'react-router-dom'

function LandingContent() {
  const navigate = useNavigate()

  return (
    <section className="flex flex-col items-center">
      <h1 className="text-7xl font-black tracking-tight">
        <span className="text-[#8B00FF]">Play</span>
        <span className="text-[#171329]">Bit</span>
      </h1>

      <p className="mt-8 text-lg font-medium text-[#8175A5]">
        작은 목표를 달성하고, 서로 경쟁하며 좋은 습관을 만들어보세요!
      </p>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => navigate('/rooms/create')}
          className="h-11 w-28 rounded-xl bg-[#8B00FF] font-semibold text-white shadow-md transition hover:bg-[#7700D4]"
        >
          방 만들기
        </button>

        <button
          type="button"
          onClick={() => navigate('/join-room')}
          className="h-11 w-32 rounded-xl border border-purple-200 bg-white font-semibold text-[#8B00FF] shadow-sm transition hover:bg-purple-50"
        >
          방 참여하기
        </button>
      </div>
    </section>
  )
}

export default LandingContent