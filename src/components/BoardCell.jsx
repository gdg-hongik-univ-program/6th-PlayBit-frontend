import { useState } from 'react'
import useGameStore from '../features/game/model/gameStore'
import MissionDetailModal from './MissionDetailModal'
import MissionEvidence from './MissionEvidence'
import MissionPhoto from './MissionPhoto'

function BoardCell({
  entryCode,
  mission,
  players,
  disabled = false,
}) {
  const completeMission = useGameStore((state) => state.completeMission)
  const sabotageMission = useGameStore((state) => state.sabotageMission)
  const myMemberId = useGameStore((state) => state.myMemberId)
  const currentTurnMemberId = useGameStore((state) => state.currentTurnMemberId)
  const currentTurnSabotaged = useGameStore((state) => state.currentTurnSabotaged)
  const status = useGameStore((state) => state.status)
  const isMissionSubmitting = useGameStore((state) => state.isMissionSubmitting)
  const [activeModal, setActiveModal] = useState(null)
  const [photoMode, setPhotoMode] = useState(null)

  const completedByMemberId = mission.completedByMemberId
  const isCompleted = completedByMemberId !== null && completedByMemberId !== undefined
  const completedPlayer = players.find(
    (player) => String(player.memberId) === String(completedByMemberId),
  )
  const mark = completedPlayer?.role ?? null
  const isOpponentCompletedCell =
    isCompleted &&
    myMemberId !== null &&
    myMemberId !== undefined &&
    String(completedByMemberId) !== String(myMemberId)
  const isMyTurn =
    myMemberId !== null &&
    myMemberId !== undefined &&
    currentTurnMemberId !== null &&
    currentTurnMemberId !== undefined &&
    String(currentTurnMemberId) === String(myMemberId)
  const isAlreadySabotaged =
    mission.sabotagedByOpponent ?? mission.sabotaged ?? false
  const isInteractionDisabled =
    disabled || isMissionSubmitting || status !== 'PLAYING'
  const canComplete = !isInteractionDisabled && isMyTurn && !isCompleted
  const canSabotage =
    !isInteractionDisabled &&
    currentTurnMemberId !== null &&
    currentTurnMemberId !== undefined &&
    !isMyTurn &&
    isOpponentCompletedCell &&
    !isAlreadySabotaged &&
    !currentTurnSabotaged

  const openPhoto = (mode) => {
    setPhotoMode(mode)
    setActiveModal('photo')
  }

  const closePhoto = () => {
    setPhotoMode(null)
    setActiveModal(null)
  }

  const handlePhotoComplete = async ({ photoFile, comment }) => {
    if (photoMode === 'complete') {
      await completeMission(entryCode, mission.position, photoFile, comment)
    }

    if (photoMode === 'sabotage') {
      await sabotageMission(entryCode, mission.position, photoFile, comment)
    }

    closePhoto()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setActiveModal('detail')}
        className={`relative aspect-square rounded-xl border-2 p-2 text-center shadow-[0_3px_0_rgba(57,68,113,0.2)] ${
          isCompleted
            ? 'border-[#5163B4] bg-white'
            : 'border-white/80 bg-[#F7F8FF]/85'
        }`}
        aria-label={`미션 ${Number(mission.position) + 1}: ${mission.content}`}
      >
        <span className="absolute left-2 top-1 text-[9px] font-black text-[#717A98]">
          {Number(mission.position) + 1}
        </span>
        {mark ? (
          <strong
            className={`pixel-title text-4xl ${
              mark === 'O' ? 'text-[#D96255]' : 'text-[#6879CE]'
            }`}
          >
            {mark}
          </strong>
        ) : (
          <span className="line-clamp-3 text-[9px] font-black leading-3 text-[#59617E]">
            {mission.content}
          </span>
        )}
        {isAlreadySabotaged && (
          <span className="absolute bottom-1 right-1 text-xs">⚡</span>
        )}
      </button>

      {activeModal === 'detail' && (
        <MissionDetailModal
          mission={mission}
          isCompleted={isCompleted}
          canComplete={canComplete}
          canSabotage={canSabotage}
          isMyTurn={isMyTurn}
          onComplete={() => openPhoto('complete')}
          onSabotage={() => openPhoto('sabotage')}
          onViewEvidence={() => setActiveModal('evidence')}
          onClose={() => setActiveModal(null)}
        />
      )}

      <MissionPhoto
        mission={mission}
        mode={photoMode}
        isOpen={activeModal === 'photo'}
        onClose={closePhoto}
        onComplete={handlePhotoComplete}
      />

      <MissionEvidence
        mission={mission}
        isOpen={activeModal === 'evidence'}
        onClose={() => setActiveModal(null)}
      />
    </>
  )
}

export default BoardCell
