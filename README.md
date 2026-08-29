# 💎 Finlog - Glassmorphic Smart Financial Tracker

트렌디하고 세련된 글래스모피즘(Glassmorphism) UI 디자인 시스템이 적용된 스마트 가계부 웹 애플리케이션입니다.

---

## ☁️ GCP Firebase 클라우드 DB 연동 가이드 (3분 완성)

Finlog는 백엔드 서버 구축 없이 **GCP Firebase Cloud Firestore DB**와 바로 연결되어, **스마트폰/노트북/어디서 접속하든 실시간으로 데이터가 동기화**됩니다.

### 💡 키 발급 및 입력 3단계
1. [GCP Firebase Console (console.firebase.google.com)](https://console.firebase.google.com/) 접속 ➔ 구글 로그인 후 **'프로젝트 추가'** (`Finlog`)
2. **`</>` (웹 앱)** 클릭 ➔ 앱 이름 등록 후 화면에 나타나는 `firebaseConfig` 복사
3. 내가 띄운 가계부 웹페이지의 **`설정 & Cloud DB`** 탭으로 들어가 `apiKey`와 `projectId`를 입력하고 **'구글 DB 연동'** 버튼 클릭!

---

## 🗄️ DB 스키마 & 데이터 모델링 (AI Modeling Ready)

| 컬럼명 | 데이터 타입 | 설명 | AI 모델링 활용 예시 |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` (PK) | 고정 유일 식별자 | 거래별 Unique Key |
| `date` | `DATE` | 거래 일자 (`YYYY-MM-DD`) | 월별/요일별 시계열 지출 변화 예측 |
| `type` | `VARCHAR(16)` | 수입 (`income`) / 지출 (`expense`) | 타겟 라벨링 |
| `category` | `VARCHAR(32)` | 지출/수입 카테고리 | 다중 클래스 분류 |
| `memo` | `TEXT` | 거래 세부 내역 / 상호명 | NLP 텍스트 클러스터링 및 카테고리 자동 분류 |
| `amount` | `NUMERIC(12,2)` | 거래 금액 | 회귀 분석 (Regression), 지출액 예측 |
| `payment_method` | `VARCHAR(64)` | 결제 수단 | 결제 패턴 특성 |

---

## 📜 버전 변경 이력 (Changelog)

### 🚀 v1.3.0 (2026-08-30) - Cloud DB Integration Release
- **✨ [NEW] GCP Firebase Cloud Firestore 실시간 연동**:
  - Firebase SDK v10 통합 및 클라우드 DB 실시간 수신(`onSnapshot`) / 자동 생성 / 삭제 연동.
  - 구글 DB 연결 시 사이드바 상단 상태등 `GCP Firestore ON` 라이브 갱신.
- **✨ UI & 설정 탭 갱신**:
  - Firebase Config 키 입력 및 연동 해제(로컬 모드 복귀) 컨트롤 지원.
  - 사이드바 및 UI 버전 배지 `v1.3.0`으로 갱신.

### 🚀 v1.2.0 (2026-08-30) - Data Modeling & DB Release
- **✨ DB SQL Dump 내보내기**: PostgreSQL / SQLite / GCP Cloud SQL 호환 `.sql` 생성.

### 🚀 v1.1.0 (2026-08-29) - Minor Release
- **✨ 엑셀/CSV 내보내기 & 불러오기** / **고정 지출 및 정기 구독 관리 탭**.

### 🌟 v1.0.0 (2026-08-29) - Initial Release
- **✨ 최초 글래스모픽 웹 가계부 초안 작성**: 대시보드, SVG 도넛 차트, 거래 내역 CRUD.
