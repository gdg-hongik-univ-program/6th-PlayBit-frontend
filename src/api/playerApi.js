import axiosInstance from './axiosInstance'

export const registerPlayerApi = async (entryCode) => {
  const response = await axiosInstance.post(
    `/api/rooms/${entryCode}/players`,
    {},
  )

  return response.data
}