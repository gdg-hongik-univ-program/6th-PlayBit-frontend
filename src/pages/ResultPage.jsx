import { useEffect, useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import useGameStore from "../stores/gameStore";

const RESULT_INFO = {
  win: {
    icon: "🏆",
    title: "승리!",
    description:
      "가로, 세로 또는 대각선으로 미션 3개를 완성했습니다.",
    headerStyle:
      "bg-gradient-to-r from-[#8B00FF] to-[#B44CFF]",
  },

  lose: {
    icon: "💀",
    title: "패배",
    description:
      "상대가 가로, 세로 또는 대각선으로 미션 3개를 완성했습니다.",
    headerStyle:
      "bg-gradient-to-r from-[#332B46] to-[#171329]",
  },

  draw: {
    icon: "🤝",
    title: "무승부",
    description:
      "보드가 모두 채워졌지만 아무도 한 줄을 완성하지 못했습니다.",
    headerStyle:
      "bg-gradient-to-r from-[#6B7280] to-[#374151]",
  },
};

const isSameMember = (
  firstMemberId,
  secondMemberId,
) => {
  if (
    firstMemberId === null ||
    firstMemberId === undefined ||
    secondMemberId === null ||
    secondMemberId === undefined
  ) {
    return false;
  }

  return (
    String(firstMemberId) ===
    String(secondMemberId)
  );
};

const countCompletedMissions = (
  missions,
  memberId,
) => {
  if (
    memberId === null ||
    memberId === undefined
  ) {
    return 0;
  }

  return missions.filter((mission) =>
    isSameMember(
      mission.completedByMemberId,
      memberId,
    ),
  ).length;
};

function ResultPage() {
  const { entryCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const room = useGameStore(
    (state) => state.room,
  );

  const missions = useGameStore(
    (state) => state.missions,
  );

  const players = useGameStore(
    (state) => state.players,
  );

  const myMemberId = useGameStore(
    (state) => state.myMemberId,
  );

  const winnerMemberId = useGameStore(
    (state) => state.winnerMemberId,
  );

  const status = useGameStore(
    (state) => state.status,
  );

  const isLoading = useGameStore(
    (state) => state.isLoading,
  );

  const error = useGameStore(
    (state) => state.error,
  );

  const fetchRoom = useGameStore(
    (state) => state.fetchRoom,
  );

  const resetRoomState = useGameStore(
    (state) => state.resetRoomState,
  );

  /*
   * GamePage에서 navigate로 전달한 값입니다.
   * 서버 조회가 끝나기 전 임시값으로만 사용합니다.
   */
  const navigationState =
    location.state ?? {};

  /*
   * 새로고침 시 Store의 myMemberId가 사라질 수 있으므로
   * localStorage의 uuid를 보조값으로 사용합니다.
   */
  const effectiveMyMemberId =
    myMemberId ??
    localStorage.getItem("uuid");

  useEffect(() => {
    if (!entryCode) {
      return;
    }

    fetchRoom(entryCode).catch(() => {
      // 오류 내용은 gameStore에서 저장합니다.
    });
  }, [entryCode, fetchRoom]);

  const opponentPlayer = useMemo(() => {
    if (
      effectiveMyMemberId === null ||
      effectiveMyMemberId === undefined
    ) {
      return null;
    }

    return (
      players.find(
        (player) =>
          !isSameMember(
            player.memberId,
            effectiveMyMemberId,
          ),
      ) ?? null
    );
  }, [players, effectiveMyMemberId]);

  /*
   * 현재 Store가 이 방의 FINISHED 정보를 가지고 있는지
   * 확인합니다.
   */
  const hasServerResult =
    status === "FINISHED" &&
    String(room?.entryCode) ===
      String(entryCode);

  /*
   * 최종 승패는 location.state보다
   * 서버의 winnerMemberId를 우선합니다.
   */
  const result = useMemo(() => {
    if (hasServerResult) {
      if (
        winnerMemberId === null ||
        winnerMemberId === undefined
      ) {
        return "draw";
      }

      return isSameMember(
        winnerMemberId,
        effectiveMyMemberId,
      )
        ? "win"
        : "lose";
    }

    return navigationState.result ?? null;
  }, [
    hasServerResult,
    winnerMemberId,
    effectiveMyMemberId,
    navigationState.result,
  ]);

  const calculatedPlayerMissionCount =
    countCompletedMissions(
      missions,
      effectiveMyMemberId,
    );

  const calculatedOpponentMissionCount =
    countCompletedMissions(
      missions,
      opponentPlayer?.memberId,
    );

  /*
   * 서버에서 missions를 받은 경우 계산값을 사용하고,
   * 아직 조회 전이라면 navigate state 값을 사용합니다.
   */
  const playerMissionCount =
    missions.length > 0
      ? calculatedPlayerMissionCount
      : navigationState.playerMissionCount ??
        0;

  const opponentMissionCount =
    missions.length > 0
      ? calculatedOpponentMissionCount
      : navigationState.opponentMissionCount ??
        0;

  const currentResult =
    RESULT_INFO[result] ??
    RESULT_INFO.draw;

  const isWin = result === "win";
  const isLose = result === "lose";
  const isDraw = result === "draw";

  /*
   * 기존 방에는 이미 게임 결과가 저장되어 있으므로
   * 새로운 게임을 하려면 새 방 생성 페이지로 이동합니다.
   */
  const handleRestart = () => {
    resetRoomState();

    navigate("/create-room", {
      replace: true,
    });
  };

  const handleGoHome = () => {
    resetRoomState();

    navigate("/", {
      replace: true,
    });
  };

  if (isLoading && !result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F0FF]">
        <p className="font-semibold text-[#302842]">
          게임 결과를 불러오는 중입니다...
        </p>
      </main>
    );
  }

  if (error && !result) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F0FF] px-6">
        <p className="text-center font-semibold text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={handleGoHome}
          className="rounded-xl bg-[#8B00FF] px-5 py-3 font-bold text-white"
        >
          메인으로 돌아가기
        </button>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F0FF] px-6">
        <p className="font-semibold text-[#302842]">
          종료된 게임 결과를 찾을 수 없습니다.
        </p>

        <button
          type="button"
          onClick={handleGoHome}
          className="rounded-xl bg-[#8B00FF] px-5 py-3 font-bold text-white"
        >
          메인으로 돌아가기
        </button>
      </main>
    );
  }

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
              missionCount={
                playerMissionCount
              }
              status={
                isDraw
                  ? "draw"
                  : isWin
                    ? "winner"
                    : "loser"
              }
            />

            <ResultCard
              title="상대"
              missionCount={
                opponentMissionCount
              }
              status={
                isDraw
                  ? "draw"
                  : isLose
                    ? "winner"
                    : "loser"
              }
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

function ResultCard({
  title,
  missionCount,
  status,
}) {
  const isWinner =
    status === "winner";

  const isDraw =
    status === "draw";

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