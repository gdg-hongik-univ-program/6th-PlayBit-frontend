import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',

    // ngrok 무료 터널의 브라우저 경고 페이지 건너뛰기
    'ngrok-skip-browser-warning': 'true',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const uuid = localStorage.getItem('uuid')

    if (uuid) {
      config.headers['X-Member-Id'] = uuid
    }

    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance