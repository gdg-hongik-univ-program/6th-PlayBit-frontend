# 향후 작업 예정 항목 (TODO)

## 1. 회원 탈퇴 기능 구현 (백엔드 연동)
- **백엔드 작업 필요**: 
  - `DELETE /api/members/me` (또는 유사한 엔드포인트) API 생성
  - DB에서 멤버 삭제 (Hard Delete시 연관 데이터 처리, 또는 Soft Delete 처리)
  - 사용 중인 토큰(Refresh Token 등) 무효화
- **프론트엔드 작업 필요**:
  - `SettingsPage.jsx`의 '탈퇴하기' 버튼 활성화 (`disabled` 제거)
  - 버튼 클릭 시 탈퇴 API 호출, 성공 시 프론트엔드 상태 초기화(로그아웃 처리) 및 초기 화면 이동 연결
