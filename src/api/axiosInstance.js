import axios from 'axios'

const axiosInstance = axios.create({
  /*
   * 브라우저에는 항상 동일 출처 /api로 요청합니다.
   * 개발 환경은 Vite proxy, 배포 환경은 Vercel rewrite가
   * 실제 백엔드로 요청을 전달합니다.
   */
  baseURL: '',
  withCredentials: true,
  headers: {
    // ngrok 무료 터널의 브라우저 경고 페이지 건너뛰기
    'ngrok-skip-browser-warning': 'true',
  },
})

export default axiosInstance
