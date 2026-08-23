// src/stores/authStore.js

import { create } from 'zustand'
import { getMe, logout as logoutApi } from '../api/authApi'

const useAuthStore = create((set) => ({
  member: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      set({ isLoading: true })

      const response = await getMe()

      set({
        member: response.data,
        isAuthenticated: true,
      })
    } catch (error) {
      if (error.response?.status === 401) {
        set({
          member: null,
          isAuthenticated: false,
        })

        return
      }

      console.error('로그인 상태 확인 실패:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  setMember: (member) => {
    set({
      member,
      isAuthenticated: true,
    })
  },

  logout: async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error)
    } finally {
      set({
        member: null,
        isAuthenticated: false,
      })
    }
  },
}))

export default useAuthStore