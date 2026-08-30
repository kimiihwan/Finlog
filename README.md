# 💎 Finlog - Clean Minimalist Smart Financial Tracker

트렌디하고 세련된 미니멀 모노톤(Clean Slate & Monotone) UI 디자인 시스템이 적용된 스마트 가계부 웹 애플리케이션입니다.

---

## ☁️ GCP (Google Cloud Platform) 구글 서버 배포 가이드 (Firebase Hosting)

본 프로젝트에는 **GCP Firebase Cloud Hosting 설정(`firebase.json`)**이 포함되어 있어, 명령어 한 줄로 내 가계부 웹 애플리케이션을 구글 서버에 완전히 올리고 상시 운영 도메인을 발급받을 수 있습니다.

### 🚀 GCP 구글 서버로 원클릭 배포(Deploy) 명령어
VS Code 터미널에서 아래 2개 명령어를 실행합니다:

```bash
# 1) Firebase 구글 계정 로그인 (최초 1회)
npx firebase login

# 2) GCP 구글 클라우드 서버로 배포하기!
npx firebase deploy
```

배포가 완료되면 화면에 **`https://프로젝트아이디.web.app`** 도메인 주소가 표시되며, 24시간 항상 구글 클라우드 인프라에서 가계부가 구동됩니다.

---

## 📜 버전 변경 이력 (Changelog)

### ☁️ v1.5.0 (2026-08-30) - GCP Cloud Hosting Release
- **✨ [NEW] GCP Firebase Hosting 구글 서버 배포 시스템 구축**:
  - GCP 구글 클라우드 서버 배포용 `firebase.json` 및 `.firebaserc` 인프라 세팅.
  - `npx firebase deploy` 한 줄로 구글 도메인(`https://*.web.app`) 상시 배포 지원.
  - 버전 배지 `v1.5.0`으로 갱신.

### 🎨 v1.4.0 (2026-08-30) - Clean Minimalist Redesign
- **✨ AI 양산형 전형적 글래스모피즘 색상 제거**: 토스/Vercel 스타일 미니멀 차콜 모노톤 테마 개편.

### 🚀 v1.3.0 (2026-08-30) - Cloud DB Integration Release
- **✨ GCP Firebase Cloud Firestore 실시간 연동 지원**: 백엔드 서버 없이 구글 DB 실시간 동기화.

### 🚀 v1.2.0 (2026-08-30) - Data Modeling & DB Release
- **✨ DB SQL Dump 내보내기**: PostgreSQL / SQLite / GCP Cloud SQL 호환 `.sql` 추출.

### 🚀 v1.1.0 (2026-08-29) - Minor Release
- **✨ 엑셀/CSV 내보내기 & 불러오기** / **고정 지출 및 정기 구독 관리 탭**.

### 🌟 v1.0.0 (2026-08-29) - Initial Release
- **✨ 최초 글래스모픽 웹 가계부 초안 작성**: 대시보드, SVG 도넛 차트, 거래 내역 CRUD.
