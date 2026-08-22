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
  const handleNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('이 브라우저는 알림 기능을 지원하지 않습니다.')
      return
    }

    if (!('serviceWorker' in navigator)) {
      alert('이 브라우저는 Service Worker를 지원하지 않습니다.')
      return
    }

    let permission = Notification.permission

    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission !== 'granted') {
      console.log('알림 권한이 허용되지 않았습니다.')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready

      let subscription =
        await registration.pushManager.getSubscription()

      if (!subscription) {
        const vapidPublicKey =
          import.meta.env.VITE_VAPID_PUBLIC_KEY

        subscription =
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              urlBase64ToUint8Array(vapidPublicKey),
          })
      }

      console.log('Push Subscription:', subscription)

      await savePushSubscription(subscription)

      console.log('Push 구독 서버 저장 성공')
    } catch (error) {
      console.error('Push 알림 등록 실패:', error)
    }
  }

  return (
    <button
        type="button"
        onClick={handleNotificationPermission}
        className={compact ?
          'rounded-full bg-[#63B86D] px-3 py-1 text-[10px] font-black text-white' : `
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
        {!compact && <span className="text-lg">🔔</span>}
        <span>{compact ? '설정' : '알림 받기'}</span>
    </button>
  )
}

export default NotificationButton
