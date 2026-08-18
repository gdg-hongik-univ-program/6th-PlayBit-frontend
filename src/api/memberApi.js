import axiosInstance from './axiosInstance'

export const updateNickname = async (nickname) => {
  const response = await axiosInstance.patch('/api/members/nickname', {
    nickname,
  })

  return response.data
}
