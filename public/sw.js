self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}

  const title = data.title || 'PlayBit'

  const options = {
    body: data.body || '새로운 알림이 도착했습니다.',
    icon: '/icon.png',
    data: {
      url: data.url || '/',
    },
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})