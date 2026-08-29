# 💎 Finlog - Glassmorphic Smart Financial Tracker

트렌디하고 세련된 글래스모피즘(Glassmorphism) UI 디자인 시스템이 적용된 스마트 가계부 웹 애플리케이션입니다.

---

## 🗄️ DB 스키마 & 데이터 모델링 (AI Modeling Ready)

Finlog는 차후 **머신러닝 / 시계열 예측(Time-Series) / 소비 패턴 모델링**에 즉시 데이터를 활용할 수 있도록 정규화된 DB 테이블 구조(PostgreSQL, SQLite, GCP Cloud SQL 호환)로 디자인되어 있습니다.

### `transactions` 테이블 스키마 (데이터베이스 구조)

| 컬럼명 | 데이터 타입 | 설명 | AI 모델링 활용 예시 |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` (PK) | 고정 유일 식별자 | 거래별 Unique Key |
| `date` | `DATE` | 거래 일자 (`YYYY-MM-DD`) | 월별/요일별/시계열 지출 변화 예측 |
| `type` | `VARCHAR(16)` | 수입 (`income`) / 지출 (`expense`) | 타겟 라벨링 (Target Category) |
| `category` | `VARCHAR(32)` | 지출/수입 카테고리 | 다중 클래스 분류 (Multi-class Classification) |
| `memo` | `TEXT` | 거래 세부 내역 / 상호명 | NLP 텍스트 클러스터링 및 자동 카테고리 분류 |
| `amount` | `NUMERIC(12,2)` | 거래 금액 | 회귀 분석 (Regression), 지출액 예측 |
| `payment_method` | `VARCHAR(64)` | 결제 수단 | 결제 패턴 특성 (Feature Engineering) |
| `created_at` | `TIMESTAMP` | 데이터 생성 시각 | 타임스탬프 로깅 |

---

## 📜 버전 변경 이력 (Changelog)

### 🚀 v1.2.0 (2026-08-30) - Data Modeling & DB Release
- **✨ [NEW] DB SQL Dump 내보내기 기능 추가**:
  - PostgreSQL / SQLite / GCP Cloud SQL 호환 `.sql` 스크립트 자동 생성 기능 (`exportToSQL()`).
  - 데이터 분석 및 AI 모델 학습용 데이터셋 정형화.
- **✨ [NEW] 데이터베이스 모델링 지원 UI**:
  - 상단 헤더 및 설정 탭에 **'SQL Dump'** 내보내기 버튼 추가.
  - 사이드바 버전 표시 `v1.2.0`으로 갱신.

### 🚀 v1.1.0 (2026-08-29) - Minor Release
- **✨ 엑셀/CSV 내보내기 & 불러오기 기능**: UTF-8 BOM 지원 CSV 저장 및 일괄 복원.
- **✨ 고정 지출 / 정기 구독 관리 탭**: 월세/넷플릭스 등 정기 결제 당월 반영.

### 🌟 v1.0.0 (2026-08-29) - Initial Release
- **✨ 최초 글래스모픽 웹 가계부 초안 작성**: 대시보드, SVG 도넛 차트, 거래 내역 CRUD.

---

## 🚀 빠른 시작

1. [index.html](file:///e:/projects/Finlog/index.html)을 더블 클릭하여 브라우저에서 실행합니다.
2. 상단 **'SQL Dump'** 또는 **'CSV'** 버튼을 누르면 DB 저장용 데이터를 파일로 즉시 추출할 수 있습니다.
