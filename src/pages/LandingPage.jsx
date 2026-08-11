import LandingContent from '../components/LandingContent'
import NotificationButton from '../components/NotificationButton'

function LandingPage() {
  return (
    <main
      className="
        relative
        min-h-screen
        bg-[#F8F5FF]
        flex
        items-center
        justify-center
      "
    >
      {/* 우측 상단 알림 버튼 */}
      <div className="absolute top-6 right-6">
        <NotificationButton />
      </div>

      <LandingContent />
    </main>
  )
}

export default LandingPage