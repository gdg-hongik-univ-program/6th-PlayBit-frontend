import axiosInstance from './axiosInstance'

export const googleLogin = async (idToken) => {
  const response = await axiosInstance.post('/api/auth/google', {
    idToken,
  })

  return response.data
}

export const getMe = async () => {
  const response = await axiosInstance.get('/api/auth/me')

  return response.data
}

export const logout = async () => {
  const response = await axiosInstance.post('/api/auth/logout')

  return response.data
}