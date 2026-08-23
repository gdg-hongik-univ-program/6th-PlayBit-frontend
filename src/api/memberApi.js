import axiosInstance from './axiosInstance'

export const updateNickname = async (nickname) => {
  const response = await axiosInstance.patch('/api/members/nickname', {
    nickname,
  })

  return response.data
}

export const getMemberStats = async () => {
  const response = await axiosInstance.get('/api/members/stats')

  return response.data
}
