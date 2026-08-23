<div align="center">
  <br />
  <img src="./src/assets/poster.png" width="480" alt="PlayBit 로고" />
  <h1>🎮 PlayBit - Frontend</h1>
  <p><strong>친구와 함께 게임처럼 완성하는 습관</strong></p>
  <br />
</div>

> **PlayBit**는 두 명의 사용자가 3×3 게임 보드의 미션을 수행하며 경쟁하는
> 모바일 중심의 실시간 습관 형성 서비스입니다.
>
> 미션을 사진과 코멘트로 인증해 칸을 획득하고, 먼저 한 줄을 완성하면 승리합니다.

---

## ✨ 핵심 기능 (Core Features)

### 1. 🚪 게임 방 생성 및 참가

- 카테고리와 방 이름을 선택해 방 생성
- 입장 코드를 이용한 방 참가
- 참여 중인 방 목록 조회 및 방 나가기

### 2. 🎲 실시간 3×3 게임

- 두 명의 플레이어가 참여하는 턴 기반 게임
- 게임 시작 시 미션이 배치된 3×3 보드 제공
- SSE(Server-Sent Events)를 이용한 방 상태, 턴, 보드 실시간 동기화
- 대기 상태에서 이벤트 수신이 지연될 경우 상태 재조회

### 3. 📷 미션 수행 및 인증

- 빈 칸을 눌러 미션 상세 정보 확인
- 사진과 코멘트를 첨부해 미션 완료 인증
- 인증 완료 시 해당 미션 칸 획득
- 완료된 칸을 눌러 인증 사진과 코멘트 조회

### 4. ⚡ 사보타주

- 상대방 차례에 완료된 미션을 대상으로 사보타주 인증
- 사진과 코멘트를 이용한 사보타주 수행
- 인증 결과를 게임 보드에 반영

### 5. 🏆 결과 및 기록

- 한 줄을 먼저 완성한 플레이어의 승리 처리
- 게임 결과 화면 제공
- 연속 달성 일수와 완료한 미션 수 확인

### 6. 📱 모바일 환경 지원

- 모바일 화면에 맞춘 반응형 레이아웃
- 모바일 브라우저의 Safe Area 및 동적 뷰포트 대응
- Service Worker와 Web Push 기반 알림 지원

---

## ⚙ 기술 스택 (Tech Stack)

| 구분 | 기술 |
| --- | --- |
| Language & Framework | JavaScript, React 19, Vite 8 |
| Styling | Tailwind CSS 4, CSS |
| State Management | Zustand 5 |
| Data Fetching | Axios |
| Routing | React Router 7 |
| Utilities | Service Worker, Web Push |
| Code Quality | ESLint |

---

## 📂 프로젝트 구조 (Project Structure)

```text
playbit/
├─ public/                     # 정적 파일 및 Service Worker
├─ src/
│  ├─ api/                    # 도메인별 백엔드 API 요청
│  ├─ assets/                 # 이미지, 캐릭터, 로고
│  ├─ components/             # 공통 UI 컴포넌트
│  ├─ features/
│  │  └─ game/
│  │     ├─ model/            # 게임 데이터 변환 및 정규화
│  │     └─ slices/           # 방, 미션, 실시간 상태 로직
│  ├─ pages/                  # 라우트 단위 화면
│  ├─ routes/                 # 라우팅 및 접근 제어
│  ├─ services/               # 인증, SSE, 알림 서비스
│  ├─ stores/                 # Zustand 전역 상태
│  ├─ App.jsx
│  └─ main.jsx
├─ eslint.config.js
├─ package.json
├─ vercel.json
└─ vite.config.js
```

## 📌 GitHub Convention

### Commit Convention

| 태그 | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `design` | UI 및 스타일 변경 |
| `refactor` | 기능 변화 없는 코드 구조 개선 |
| `chore` | 빌드, 설정, 패키지 등 기타 작업 |

### Branch Convention

- `main`: 배포 가능한 안정 버전
- `develop`: 기능 통합 및 검증 브랜치
- `feat/*`: 기능 개발
- `fix/*`: 버그 수정
- `refactor/*`: 리팩터링
- `hotfix/*`: 운영 환경의 긴급 수정
