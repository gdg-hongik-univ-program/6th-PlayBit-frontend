import { useLocation, useNavigate } from "react-router-dom";

const RESULT_INFO = {
  win: {
    icon: "🏆",
    title: "승리!",
    description: "가로, 세로 또는 대각선으로 미션 3개를 완성했습니다.",
    headerStyle: "bg-gradient-to-r from-[#8B00FF] to-[#B44CFF]",
  },

  lose: {
    icon: "💀",
    title: "패배",
    description: "상대가 가로, 세로 또는 대각선으로 미션 3개를 완성했습니다.",
    headerStyle: "bg-gradient-to-r from-[#332B46] to-[#171329]",
  },

  draw: {
    icon: "🤝",
    title: "무승부",
    description: "보드가 모두 채워졌지만 아무도 한 줄을 완성하지 못했습니다.",
    headerStyle: "bg-gradient-to-r from-[#6B7280] to-[#374151]",
  },
};

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    result = "draw",
    playerMissionCount = 0,
    opponentMissionCount = 0,
  } = location.state || {};

  const currentResult = RESULT_INFO[result] || RESULT_INFO.draw;

  const isWin = result === "win";
  const isLose = result === "lose";
  const isDraw = result === "draw";

  const handleRestart = () => {
    navigate("/game", {
      replace: true,
    });
  };

  const handleGoHome = () => {
    navigate("/", {
      replace: true,
    });
  };

  const finalMessage = isWin
    ? `내가 ${playerMissionCount}개의 미션을 차지해 승리했습니다.`
    : isLose
      ? `상대가 ${opponentMissionCount}개의 미션을 차지해 승리했습니다.`
      : `나는 ${playerMissionCount}개, 상대는 ${opponentMissionCount}개의 미션을 차지했습니다.`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F5F0FF] via-white to-[#EEE6FF] px-4 py-10">
      <section className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_25px_70px_rgba(86,28,135,0.18)]">
        <div
          className={`px-6 py-12 text-center text-white ${currentResult.headerStyle}`}
        >
          <div className="mb-4 text-7xl">
            {currentResult.icon}
          </div>

          <p className="mb-2 text-sm font-bold tracking-[0.3em] text-white/70">
            GAME RESULT
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            {currentResult.title}
          </h1>

          <p className="mt-4 text-base text-white/80 md:text-lg">
            {currentResult.description}
          </p>
        </div>

        <div className="p-6 md:p-10">
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <ResultCard
              title="나"
              missionCount={playerMissionCount}
              status={isDraw ? "draw" : isWin ? "winner" : "loser"}
            />

            <ResultCard
              title="상대"
              missionCount={opponentMissionCount}
              status={isDraw ? "draw" : isLose ? "winner" : "loser"}
            />
          </div>

          <div className="mb-8 rounded-2xl bg-[#F8F5FC] px-5 py-5 text-center">
            <p className="text-sm font-semibold text-gray-500">
              최종 결과
            </p>

            <p className="mt-2 text-lg font-black text-[#171329]">
              {finalMessage}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRestart}
              className="flex-1 rounded-2xl bg-[#8B00FF] px-6 py-4 text-base font-black text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-[#7700DB]"
            >
              다시 플레이
            </button>

            <button
              type="button"
              onClick={handleGoHome}
              className="flex-1 rounded-2xl border-2 border-[#8B00FF] bg-white px-6 py-4 text-base font-black text-[#8B00FF] transition hover:bg-purple-50"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResultCard({ title, missionCount, status }) {
  const isWinner = status === "winner";
  const isDraw = status === "draw";

  return (
    <article
      className={`relative rounded-3xl border-2 p-6 ${
        isWinner
          ? "border-[#8B00FF] bg-purple-50"
          : isDraw
            ? "border-gray-400 bg-gray-50"
            : "border-gray-100 bg-gray-50"
      }`}
    >
      {isWinner && (
        <span className="absolute right-4 top-4 rounded-full bg-[#8B00FF] px-3 py-1 text-xs font-bold text-white">
          WINNER
        </span>
      )}

      {isDraw && (
        <span className="absolute right-4 top-4 rounded-full bg-gray-500 px-3 py-1 text-xs font-bold text-white">
          DRAW
        </span>
      )}

      <p className="text-sm font-bold text-gray-400">
        PLAYER
      </p>

      <h2 className="mt-1 text-2xl font-black text-[#171329]">
        {title}
      </h2>

      <div className="mt-6">
        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
          <span className="text-sm font-semibold text-gray-500">
            차지한 미션
          </span>

          <strong className="text-xl font-black text-[#171329]">
            {missionCount}개
          </strong>
        </div>
      </div>
    </article>
  );
}

export default ResultPage;