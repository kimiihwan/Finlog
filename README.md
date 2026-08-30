# 💎 Finlog - Clean Minimalist Smart Financial Tracker

트렌디하고 세련된 미니멀 모노톤(Clean Slate & Monotone) UI 디자인 시스템이 적용된 스마트 가계부 웹 애플리케이션입니다.

---

## ☁️ GCP Firebase 클라우드 DB 연동 가이드

1. [GCP Firebase Console (console.firebase.google.com)](https://console.firebase.google.com/) 접속 ➔ 구글 로그인 후 **'프로젝트 추가'** (`Finlog`)
2. **`</>` (웹 앱)** 클릭 ➔ 앱 이름 등록 후 화면에 나타나는 `firebaseConfig` 복사
3. 가계부 웹페이지의 **`설정 & Cloud DB`** 탭에서 `apiKey`와 `projectId` 입력 ➔ **'구글 DB 연동'** 클릭!

---

## 📜 버전 변경 이력 (Changelog)

### 🎨 v1.4.0 (2026-08-30) - Clean Minimalist Redesign
- **✨ [NEW] AI 양산형 전형적 글래스모피즘 템플릿 색상 완전 탈피**:
  - 알록달록한 네온/핑크 번짐 블러 배경(`ambient-glow`)을 모두 제거.
  - 토스(Toss), 스트라이프(Stripe), Vercel 스타일의 **미니멀 모노톤 차콜 & 슬레이트 테마 (`#0b0e14`, `#121824`, `#6366f1`)** 개편.
  - 카테고리 컬러 및 보더 라인을 차분하고 깔끔한 모노크롬 핀테크 파스텔 톤으로 재정의.
  - 사이드바 및 UI 버전 배지 `v1.4.0`으로 갱신.

### 🚀 v1.3.0 (2026-08-30) - Cloud DB Integration Release
- **✨ GCP Firebase Cloud Firestore 실시간 연동 지원**: 백엔드 서버 없이 구글 DB 실시간 동기화.

### 🚀 v1.2.0 (2026-08-30) - Data Modeling & DB Release
- **✨ DB SQL Dump 내보내기**: PostgreSQL / SQLite / GCP Cloud SQL 호환 `.sql` 추출.

### 🚀 v1.1.0 (2026-08-29) - Minor Release
- **✨ 엑셀/CSV 내보내기 & 불러오기** / **고정 지출 및 정기 구독 관리 탭**.

### 🌟 v1.0.0 (2026-08-29) - Initial Release
- **✨ 최초 글래스모픽 웹 가계부 초안 작성**: 대시보드, SVG 도넛 차트, 거래 내역 CRUD.
