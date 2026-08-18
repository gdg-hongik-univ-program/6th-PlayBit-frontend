import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    // ngrok 무료 터널의 브라우저 경고 페이지 건너뛰기
    'ngrok-skip-browser-warning': 'true',
  },
})

export default axiosInstance