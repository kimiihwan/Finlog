# 💎 Finlog - Clean Minimalist Smart Financial Tracker

트렌디하고 세련된 미니멀 모노톤(Clean Slate & Monotone) UI 디자인 시스템이 적용된 스마트 가계부 웹 애플리케이션입니다.

---

## 🐘 DBeaver 원격 접속용 PostgreSQL DB 실시간 연동 (v1.6.0)

다운로드받을 필요 없이 내 가계부에서 거래를 등록할 때마다 **원격 클라우드 PostgreSQL DB**에 즉시 저장되어, DBeaver에서 `SELECT * FROM transactions;` 엔터 한 번으로 실시간 분석이 가능합니다.

### 💡 DBeaver 원격 연결 3단계 (Supabase / GCP Cloud SQL)
1. [Supabase 공식 사이트 (supabase.com)](https://supabase.com/) 접속 ➔ 회원가입 후 **New Project** 생성 (무료)
2. **Project Settings ➔ API**에서 `Project URL`과 `anon public key`를 복사하여 가계부 웹의 **`설정 & Direct DB`** 탭에 입력!
3. DBeaver에서 **New Connection ➔ PostgreSQL** 선택 후, Supabase **Project Settings ➔ Database**에 표시된 `Host`, `Port (5432)`, `Database (postgres)`, `User`, `Password`를 입력하면 **DBeaver에서 실시간 쿼리 가능!**

---

## 📜 버전 변경 이력 (Changelog)

### 🐘 v1.6.0 (2026-08-30) - DBeaver Direct SQL Integration
- **✨ [NEW] DBeaver 원격 실시간 접속용 PostgreSQL DB Client 지원**:
  - Supabase / GCP Cloud SQL(PostgreSQL) 원격 DB 실시간 읽기/쓰기 Client 엔진 통합.
  - 가계부 작성 시 클라우드 PostgreSQL `transactions` 테이블에 데이터 자동 저장.
  - 사이드바 상태등 `PostgreSQL DB ON` 연동 정보 지원.

### ☁️ v1.5.0 (2026-08-30) - GCP Cloud Hosting Release
- **✨ GCP Firebase Hosting 원클릭 구글 서버 배포 지원**.

### 🎨 v1.4.0 (2026-08-30) - Clean Minimalist Redesign
- **✨ AI 양산형 전형적 글래스모피즘 색상 제거**: 토스/Vercel 스타일 미니멀 차콜 모노톤 테마 개편.

### 🚀 v1.3.0 (2026-08-30) - Cloud DB Integration Release
- **✨ GCP Firebase Cloud Firestore 실시간 연동 지원**.
