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
    <section className="px-4 py-8">
      <div className="grid grid-cols-3 mx-auto w-[300px] h-[300px]">
        {sortedMissions.map((mission, index) => (
          <BoardCell
            key={mission.position}
            index={index}
            entryCode={entryCode}
            mission={mission}
            players={players}
            disabled={disabled}
          />
        ))}

        {Array.from(
          { length: emptyCellCount },
          (_, i) => {
            const index = sortedMissions.length + i;
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
              <div
                key={`empty-${i}`}
                className={`flex items-center justify-center ${borderClass}`}
                aria-label="미션 준비 중"
              />
            )
          }
        )}
      </div>
    </section>
  )
}

export default GameBoard
