import axiosInstance from "./axiosInstance";

/**
 * 미션 완료
 * PATCH /api/rooms/{entryCode}/missions/{position}
 */
export const completeMission = async (entryCode, position, image, comment) => {
  if (!entryCode) {
    throw new Error("entryCode가 필요합니다.");
  }

  if (position === undefined || position === null) {
    throw new Error("position이 필요합니다.");
  }

  const formData = new FormData();

  formData.append("image", image);

  if (comment) {
    formData.append("comment", comment);
  }

  const response = await axiosInstance.patch(
    `/api/rooms/${entryCode}/missions/${position}`,
    formData,
  );

  return response.data.data;
};

/**
 * 상대방 미션 사보타주
 * PATCH /api/rooms/{entryCode}/missions/{position}/sabotage
 */
export const sabotageMission = async (entryCode, position, image, comment) => {
  if (!entryCode) {
    throw new Error("entryCode가 필요합니다.");
  }

  if (position === undefined || position === null) {
    throw new Error("position이 필요합니다.");
  }

  const formData = new FormData();

  formData.append("image", image);

  if (comment) {
    formData.append("comment", comment);
  }

  const response = await axiosInstance.patch(
    `/api/rooms/${entryCode}/missions/${position}/sabotage`,
    formData,
  );

  return response.data.data;
};
