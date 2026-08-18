import { create } from 'zustand'
import { initialGameState } from './initialGameState'
import { createMissionSlice } from './slices/missionSlice'
import { createRealtimeSlice } from './slices/realtimeSlice'
import { createRoomSlice } from './slices/roomSlice'

const useGameStore = create((set, get) => ({
  ...initialGameState,
  ...createRoomSlice(set, get),
  ...createMissionSlice(set, get),
  ...createRealtimeSlice(set, get),
}))

export default useGameStore
