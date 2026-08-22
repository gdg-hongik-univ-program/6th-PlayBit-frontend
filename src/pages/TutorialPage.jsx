import { useNavigate } from 'react-router-dom'
import MobileShell from '../components/MobileShell'
import TutorialSlides from '../components/TutorialSlides'

function TutorialPage() {
  const navigate = useNavigate()
  return <MobileShell><TutorialSlides onComplete={() => navigate('/lobby', { replace: true })} /></MobileShell>
}

export default TutorialPage
