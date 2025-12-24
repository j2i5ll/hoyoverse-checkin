# Hoyoverse Check-in

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/gbmplbdmlkcemkcocjoklgoajgbfilnf)](https://chromewebstore.google.com/detail/hoyoverse-check-in/gbmplbdmlkcemkcocjoklgoajgbfilnf?hl=ko&pli=1)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/gbmplbdmlkcemkcocjoklgoajgbfilnf)](https://chromewebstore.google.com/detail/hoyoverse-check-in/gbmplbdmlkcemkcocjoklgoajgbfilnf?hl=ko&pli=1)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/gbmplbdmlkcemkcocjoklgoajgbfilnf)](https://chromewebstore.google.com/detail/hoyoverse-check-in/gbmplbdmlkcemkcocjoklgoajgbfilnf?hl=ko&pli=1)

Hoyoverse Check-in을 이용하면 브라우저에서 **자동 출석체크**와 **게임 자원 회복 시간**을 확인할 수 있습니다!

## ✨ 주요 기능

### 🎯 자동 출석체크

- 브라우저가 켜져있다면 자동으로 출석체크를 수행
- 지원 게임:
  - **원신** (Genshin Impact)
  - **붕괴: 스타레일** (Honkai: Star Rail)
  - **붕괴3rd** (Honkai Impact 3rd)
  - **젠레스 존 제로** (Zenless Zone Zero)

### ⚡ 자원 회복 시간 조회

- 실시간 자원 상태 및 회복 시간 추적
- 지원 게임:
  - **원신** - 레진(Resin) 회복 시간
  - **붕괴: 스타레일** - 개척력(Trailblaze Power) 회복 시간
  - **젠레스 존 제로** - 배터리(Battery) 회복 시간

### 👥 다중 계정 지원

- 하나의 게임에 여러 계정을 동시에 등록 가능
- 계정별 개별 관리 및 출석체크

### 🔒 개인정보 보호

- **로그인 정보를 수집하지 않음**
- 모든 토큰은 사용자의 브라우저에만 저장
- 서버로 개인정보 전송 없음

### 🌍 다국어 지원

- 한국어 (Korean)
- 영어 (English)
- 일본어 (Japanese)
- 중국어 번체 (Traditional Chinese)

### 🌙 기타 기능

- 다크모드 지원
- [LaQoos](https://laqoos.com) 통계 연동
- 알림 기능

## 🏗️ 기술 스택

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Architecture**: Clean Architecture Pattern
- **State Management**: Zustand
- **Internationalization**: i18next

## 📁 프로젝트 구조

```
src/
├── apps/
│   ├── background/          # 백그라운드 서비스 워커
│   │   ├── domain/         # 도메인 로직 (usecase, port)
│   │   ├── service/        # 서비스 구현체
│   │   └── controller/     # 컨트롤러 (메시징, 출석체크 등)
│   └── front/
│       ├── popup/          # 팝업 페이지
│       ├── options/        # 설정 페이지
│       └── content/        # 콘텐츠 스크립트
├── shared/                 # 공통 유틸리티 및 API
└── types/                  # 타입 정의
```

## 🚀 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 모드 실행

```bash
npm run dev
```

개발 모드 실행 후:

1. 브라우저에서 `chrome://extensions` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `dist` 디렉토리 선택

### 빌드

```bash
npm run build
```

### 타입 체크

```bash
npm run type-check
```

### 린트

```bash
npm run lint
```

## 📥 설치 방법

### Chrome 웹 스토어에서 설치

[Chrome 웹 스토어](https://chromewebstore.google.com/detail/hoyoverse-check-in/gbmplbdmlkcemkcocjoklgoajgbfilnf?hl=ko&pli=1)에서 직접 설치할 수 있습니다.

### 수동 설치

1. [Releases](../../releases) 페이지에서 최신 버전 다운로드
2. zip 파일 압축 해제
3. Chrome에서 `chrome://extensions` 접속
4. "개발자 모드" 활성화
5. "압축해제된 확장 프로그램을 로드합니다" 클릭
6. 압축 해제된 폴더 선택

## 📝 사용 방법

1. **계정 등록**: 각 게임의 출석체크 사이트에 접속하여 계정을 등록
2. **자동 출석**: 브라우저가 실행 중일 때 자동으로 출석체크 수행
3. **자원 확인**: 팝업에서 실시간 자원 상태 및 회복 시간 확인
4. **설정 관리**: 옵션 페이지에서 알림, 다크모드 등 설정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🔗 관련 링크

- [Chrome 웹 스토어](https://chromewebstore.google.com/detail/hoyoverse-check-in/gbmplbdmlkcemkcocjoklgoajgbfilnf?hl=ko&pli=1)
- [LaQoos 통계 사이트](https://laqoos.com)
- [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

## 📧 문의

개발자: j2i5ll.dev@gmail.com

---
