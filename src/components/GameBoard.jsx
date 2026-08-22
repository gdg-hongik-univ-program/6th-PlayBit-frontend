import BoardCell from './BoardCell'

const BOARD_SIZE = 9

function GameBoard({ entryCode, missions, players, disabled = false }) {
  const sortedMissions = [...missions].sort(
    (a, b) =>
      Number(a.position) - Number(b.position),
  )
  const emptyCellCount = Math.max(
    0,
    BOARD_SIZE - sortedMissions.length,
  )

  return (
    <section className="rounded-[24px] border-4 border-white/80 bg-[#DDE7C3] p-3 shadow-[0_7px_0_rgba(58,72,111,0.22)]">
      <div className="grid grid-cols-3 gap-2">
        {sortedMissions.map((mission) => (
          <BoardCell
            key={mission.position}
            entryCode={entryCode}
            mission={mission}
            players={players}
            disabled={disabled}
          />
        ))}

        {Array.from(
          { length: emptyCellCount },
          (_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square rounded-xl border-2 border-white/80 bg-[#F7F8FF]/85 shadow-[0_3px_0_rgba(57,68,113,0.2)]"
              aria-label="미션 준비 중"
            />
          ),
        )}
      </div>
    </section>
  )
}

export default GameBoard
