import LandingContent from '../components/LandingContent';
import NotificationButton from '../components/NotificationButton'

function LandingPage() {
  return (
    <main
      className="
      min-h-screen
      bg-[#F8F5FF]
      flex
      items-center
      justify-center
      "
    >
      <NotificationButton />
      <LandingContent />
    </main>
  )
}

export default LandingPage