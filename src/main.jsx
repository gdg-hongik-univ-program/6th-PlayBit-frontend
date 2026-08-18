import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')

      console.log('Service Worker 등록 성공:', registration)
    } catch (error) {
      console.error('Service Worker 등록 실패:', error)
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      >
        <App />
      </GoogleOAuthProvider>
  </StrictMode>
);