import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router'
import useAuthStore from './stores/authStore'
import MobileShell from './components/MobileShell'

function App() {
  const checkAuth = useAuthStore(
    (state) => state.checkAuth,
  )
  const isLoading = useAuthStore(
    (state) => state.isLoading,
  )

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <MobileShell>
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
          <span className="pixel-title text-3xl font-black">PlayBit</span>
          <p className="text-xs font-bold text-[#4D5989]">로그인 상태 확인 중...</p>
        </div>
      </MobileShell>
    )
  }

  return <RouterProvider router={router} />
}

export default App
