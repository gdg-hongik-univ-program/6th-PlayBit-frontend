import { useState, useEffect } from 'react'
import { savePushSubscription } from '../api/pushApi'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

function NotificationButton({ compact = false }) {
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setIsSubscribed(true)
          }
        })
      })
    }
  }, [])

  const handleNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('이 브라우저는 알림 기능을 지원하지 않습니다.')
      return
    }

    if (!('serviceWorker' in navigator)) {
      alert('이 브라우저는 Service Worker를 지원하지 않습니다.')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready

      if (isSubscribed) {
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          await subscription.unsubscribe()
        }
        setIsSubscribed(false)
        console.log('Push 구독 해지 성공')
        return
      }

      let permission = Notification.permission
      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }

      if (permission !== 'granted') {
        alert('알림 권한이 허용되지 않았습니다.')
        return
      }

      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
        
        if (!vapidPublicKey) {
          console.warn('VITE_VAPID_PUBLIC_KEY가 설정되지 않아 알림 구독을 임시로 활성화합니다.')
          setIsSubscribed(true)
          return
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        })
      }

      console.log('Push Subscription:', subscription)
      await savePushSubscription(subscription)
      setIsSubscribed(true)
      console.log('Push 구독 서버 저장 성공')
    } catch (error) {
      console.error('Push 설정 변경 실패:', error)
      alert('알림 설정 변경 중 오류가 발생했습니다.')
    }
  }

  return (
    <button
        type="button"
        onClick={handleNotificationPermission}
        className={compact ?
          `relative h-8 w-14 rounded-full transition-colors focus:outline-none ${isSubscribed ? 'bg-[#2ECC71]' : 'bg-gray-300'}` : `
            flex
            items-center
            justify-center
            gap-2
            min-w-[130px]
            h-12
            px-5
            rounded-xl

            bg-[#8B00FF]
            text-white
            font-bold
            text-sm

            shadow-[0_4px_0_#6500B8]
            border-2
            border-[#8B00FF]

            transition-all
            duration-150

            hover:bg-[#7A00E0]
            hover:-translate-y-0.5
            hover:shadow-[0_5px_0_#6500B8]

            active:translate-y-1
            active:shadow-none
        `}
    >
        {compact ? (
          <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${isSubscribed ? 'right-1 translate-x-0' : 'left-1 translate-x-0'}`} />
        ) : (
          <>
            <span className="text-lg">🔔</span>
            <span>{isSubscribed ? '알림 끄기' : '알림 받기'}</span>
          </>
        )}
    </button>
  )
}

export default NotificationButton
