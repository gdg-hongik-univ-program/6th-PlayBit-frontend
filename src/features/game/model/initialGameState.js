export const initialGameState = {
  room: null,
  missions: [],
  players: [],

  currentTurnMemberId: null,
  currentTurnNumber: null,
  turnDeadline: null,
  currentTurnSabotaged: false,

  myMemberId: null,
  myRole: null,

  winnerMemberId: null,
  status: 'IDLE',

  isRoomLoading: false,
  isMissionSubmitting: false,
  error: null,
}
