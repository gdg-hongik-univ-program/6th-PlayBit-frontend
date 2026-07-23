import BoardCell from './BoardCell'

function GameBoard({
  entryCode,
  missions,
  players,
  disabled = false,
}) {
  const sortedMissions = [...missions].sort(
    (a, b) => Number(a.position) - Number(b.position),
  )

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#302842]">
            미션 보드
          </h2>

          <p className="mt-1 text-xs text-[#8175A5]">
            빈 칸을 선택해 미션을 완료하세요.
          </p>
        </div>

        <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#8B00F5]">
          3 × 3
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sortedMissions.map((mission) => (
          <BoardCell
            key={mission.position}
            entryCode={entryCode}
            mission={mission}
            players={players}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  )
}

export default GameBoard