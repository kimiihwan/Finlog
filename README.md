# 💎 Finlog - Glassmorphic Smart Financial Tracker

트렌디하고 세련된 글래스모피즘(Glassmorphism) UI 디자인 시스템이 적용된 스마트 가계부 웹 애플리케이션입니다.

---

## 🚀 빠른 시작 (지금 바로 사용하기)

현재 Node.js나 Git 환경이 준비되어 있지 않아도 **즉시 브라우저에서 실행**할 수 있도록 준비되어 있습니다.

1. `e:\projects\Finlog` 폴더로 이동합니다.
2. `index.html` 파일 혹은 [index.html](file:///e:/projects/Finlog/index.html)을 더블 클릭하여 크롬(Chrome)이나 엣지(Edge) 브라우저로 엽니다.
3. 실시간으로 수입/지출 내역을 입력하고 글래스모픽 대시보드 및 지출 비율 차트를 확인해 보세요!

---

## 🛠️ 해결해야 할 문제 및 액션 가이드

### 1. Git 명령어 오류 해결 (`git init` 에러 해결)
> `git : 'git' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다.`

#### 💡 해결 방법
컴퓨터에 **Git 프로그램**이 설치되지 않았거나 PATH 설정이 필요한 상태입니다.
1. [Git 공식 다운로드 사이트 (git-scm.com)](https://git-scm.com/downloads)에 접속합니다.
2. **Windows용 Git (64-bit Git for Windows Setup)**을 다운로드하여 설치합니다 (모든 옵션은 기본값대로 Next를 눌러 진행).
3. **중요**: 설치 완료 후 사용 중인 **VS Code 또는 PowerShell 창을 완전히 종료한 후 다시 엽니다.**
4. 이제 다음 명령어가 정상 실행됩니다:
   ```bash
   git init
   git add .
   git commit -m "feat: Finlog 가계부 초안 작성 완료"
   git branch -M main
   git remote add origin https://github.com/사용자아이디/Finlog.git
   git push -u origin main
   ```

---

### 2. Node.js 설치 가이드 (개발 환경 구축)
Vite, React, 모바일 앱(React Native/Capacitor), PC 앱(Electron/Tauri) 패키징을 위해 Node.js가 필요합니다.
1. [Node.js 공식 사이트 (nodejs.org)](https://nodejs.org/)에 접속합니다.
2. **LTS (Long Term Support)** 버전을 다운로드하고 설치합니다.
3. 설치 후 터미널을 다시 켜고 `node -v` 및 `npm -v` 명령어로 확인합니다.

---

### 3. GCP (Google Cloud Platform) 데이터베이스 연동 준비
가계부 데이터를 내 내 컴퓨터뿐 아니라 **모바일/모든 기기에서 실시간 동기화**하기 위한 최선의 선택:

- **GCP Firebase Firestore DB (추천)**:
  - [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
  - '웹 앱 추가' 후 발급받은 `apiKey`, `projectId` 정보 추가
  - 앱 내 `설정 & GCP 연동` 탭에서 입력 시 자동 구동

---

## 📱 앱 & PC 프로그램으로의 향후 확장 로드맵
- **모바일 앱 확장**: `@capacitor/core` 및 `@capacitor/cli`를 이용하여 iOS/Android 앱으로 즉시 빌드
- **PC 프로그램 확장**: `Electron` 또는 `Tauri`로 노션(Notion) 같은 데스크톱 가계부 프로그램으로 빌드
