import { useState } from 'react'
import useGameStore from '../features/game/model/gameStore'
import MissionDetailModal from './MissionDetailModal'
import MissionEvidence from './MissionEvidence'
import MissionPhoto from './MissionPhoto'

function BoardCell({
  index,
  entryCode,
  mission,
  players,
  disabled = false,
}) {
  const completeMission = useGameStore((state) => state.completeMission)
  const sabotageMission = useGameStore((state) => state.sabotageMission)
  const myMemberId = useGameStore((state) => state.myMemberId)
  const myRole = useGameStore((state) => state.myRole)
  const currentTurnMemberId = useGameStore((state) => state.currentTurnMemberId)
  const currentTurnSabotaged = useGameStore((state) => state.currentTurnSabotaged)
  const status = useGameStore((state) => state.status)
  const isMissionSubmitting = useGameStore((state) => state.isMissionSubmitting)
  const [activeModal, setActiveModal] = useState(null)
  const [photoMode, setPhotoMode] = useState(null)

  const directRole =
    mission.completedByRole ??
    mission.ownerRole ??
    mission.playerRole ??
    mission.role ??
    null

  const completedByMemberId =
    mission.completedByMemberId ??
    mission.completedMemberId ??
    mission.ownerMemberId ??
    mission.completedBy ??
    mission.ownerId ??
    null

  const isCompleted = completedByMemberId !== null && completedByMemberId !== undefined || directRole !== null
  const completedPlayer = completedByMemberId !== null && completedByMemberId !== undefined ? players.find(
    (player) => String(player.memberId) === String(completedByMemberId),
  ) : null
  
  const rawMark = directRole ?? completedPlayer?.role ?? null
  const fallbackMark =
    !rawMark && completedByMemberId && myMemberId && String(completedByMemberId) !== String(myMemberId)
      ? myRole === 'X'
        ? 'O'
        : 'X'
      : null

  const finalMark = rawMark ?? fallbackMark
  const mark = finalMark ? finalMark.toUpperCase() : null
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

  const borderClasses = [
    'border-r-[4px] border-b-[4px]', // 0
    'border-r-[4px] border-b-[4px]', // 1
    'border-b-[4px]',                // 2
    'border-r-[4px] border-b-[4px]', // 3
    'border-r-[4px] border-b-[4px]', // 4
    'border-b-[4px]',                // 5
    'border-r-[4px]',                // 6
    'border-r-[4px]',                // 7
    '',                              // 8
  ]
  const borderClass = `border-black ${borderClasses[index] || ''}`

  return (
    <>
      <button
        type="button"
        onClick={() => setActiveModal('detail')}
        className={`relative flex items-center justify-center p-2 text-center transition-colors hover:bg-black/5 ${borderClass}`}
        aria-label={`미션 ${Number(mission.position) + 1}: ${mission.content}`}
      >
        {!mark && (
          <span className="absolute left-1 top-1 text-[8px] font-black text-gray-300">
            {Number(mission.position) + 1}
          </span>
        )}
        {mark ? (
          <strong
            className={`pixel-title text-5xl leading-none flex items-center justify-center ${
              mark === 'X' ? 'text-[#FF6B59]' : 'text-[#87B4FF]'
            }`}
            style={{ textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0px 3px 0 #000, 0px -3px 0 #000, 3px 0px 0 #000, -3px 0px 0 #000' }}
          >
            {mark}
          </strong>
        ) : (
          <span className="line-clamp-3 text-[10px] font-black leading-tight text-transparent">
            {/* hidden content to keep size or could remove */}
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
