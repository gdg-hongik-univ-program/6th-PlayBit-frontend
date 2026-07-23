import axiosInstance from "./axiosInstance";

const getMemberId = () => {
  const memberId = localStorage.getItem("uuid");

  if (!memberId) {
    throw new Error("localStorage에 uuid가 없습니다.");
  }

  return memberId;
};

/**
 * 미션 완료
 * PATCH /api/rooms/{entryCode}/missions/{position}
 */
export const completeMission = async (entryCode, position) => {
  if (!entryCode) {
    throw new Error("entryCode가 필요합니다.");
  }

  if (position === undefined || position === null) {
    throw new Error("position이 필요합니다.");
  }

  const memberId = getMemberId();

  const response = await axiosInstance.patch(
    `/api/rooms/${entryCode}/missions/${position}`,
    null,
    {
      headers: {
        "X-Member-Id": memberId,
      },
    },
  );

  return response.data.data;
};

/**
 * 상대방 미션 사보타주
 * PATCH /api/rooms/{entryCode}/missions/{position}/sabotage
 */
export const sabotageMission = async (entryCode, position) => {
  if (!entryCode) {
    throw new Error("entryCode가 필요합니다.");
  }

  if (position === undefined || position === null) {
    throw new Error("position이 필요합니다.");
  }

  const memberId = getMemberId();

  const response = await axiosInstance.patch(
    `/api/rooms/${entryCode}/missions/${position}/sabotage`,
    null,
    {
      headers: {
        "X-Member-Id": memberId,
      },
    },
  );

  return response.data.data;
};