import axiosInstance from "./axiosInstance";

export const createMember = async () => {
  const response = await axiosInstance.post("/api/members");

  if (!response.data.success) {
    throw new Error(
      response.data.error?.message || "멤버 등록에 실패했습니다."
    );
  }

  return response.data.data;
};