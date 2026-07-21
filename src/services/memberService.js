import { createMember } from "../api/memberApi";

let initializePromise = null;

export const initializeMember = async () => {
  const savedUuid = localStorage.getItem("uuid");

  if (savedUuid) {
    return savedUuid;
  }

  if (!initializePromise) {
    initializePromise = createMember()
      .then((member) => {
        if (!member?.uuid) {
          throw new Error("회원 등록 응답에 uuid가 없습니다.");
        }

        localStorage.setItem("uuid", member.uuid);

        return member.uuid;
      })
      .catch((error) => {
        initializePromise = null;
        throw error;
      });
  }

  return initializePromise;
};