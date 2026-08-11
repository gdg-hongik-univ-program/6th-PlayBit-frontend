import axiosInstance from './axiosInstance'

export const savePushSubscription = async (subscription) => {
  const response = await axiosInstance.post(
    '/api/subscriptions',
    subscription,
  )

  return response.data
}

