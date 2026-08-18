import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router'
import useAuthStore from './stores/authStore'

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
    return <div>로그인 상태를 확인하는 중...</div>
  }

  return <RouterProvider router={router} />
}

export default App
