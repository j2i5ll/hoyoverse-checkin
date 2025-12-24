# 기여 가이드라인

Hoyoverse Check-in 프로젝트에 기여해 주셔서 감사합니다! 🎉

## 🚀 빠른 시작

1. **Repository Fork**

   ```bash
   # GitHub에서 Fork 버튼 클릭
   ```

2. **로컬에 Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/hoyo-checkin.git
   cd hoyo-checkin
   ```

3. **의존성 설치**

   ```bash
   npm install
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Git

### Chrome Extension 로드

1. `npm run dev` 실행
2. Chrome에서 `chrome://extensions` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `dist` 디렉토리 선택

## 📝 기여 프로세스

### 1. Issue 생성 또는 확인

- 새로운 기능이나 버그 수정을 위해 먼저 Issue를 생성하거나 확인해 주세요
- 중복된 작업을 피하기 위해 기존 Issue를 검토해 주세요

### 2. Branch 생성

```bash
git checkout -b feature/amazing-feature
# 또는
git checkout -b fix/bug-fix
```

**Branch 명명 규칙:**

- `feature/기능명` - 새로운 기능
- `fix/버그명` - 버그 수정
- `docs/문서명` - 문서 수정
- `refactor/리팩토링명` - 코드 리팩토링

### 3. 코드 작성

- **코딩 스타일**: ESLint와 Prettier 설정을 따라주세요
- **커밋 메시지**: 아래 규칙을 따라주세요

**커밋 메시지 규칙:**

```
type(scope): description

예시:
feat(popup): add notification settings
fix(background): resolve check-in failure issue
docs(readme): update installation guide
```

**Type 종류:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 패키지 매니저 등

### 4. 테스트

```bash
# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 빌드 테스트
npm run build
```

### 5. Pull Request 생성

1. Fork한 repository에 push

   ```bash
   git push origin feature/amazing-feature
   ```

2. GitHub에서 Pull Request 생성
3. PR 템플릿에 따라 설명 작성

## 🏗️ 프로젝트 구조

```
src/
├── apps/
│   ├── background/          # 백그라운드 서비스 워커
│   │   ├── domain/         # 도메인 로직 (Clean Architecture)
│   │   ├── service/        # 서비스 구현체
│   │   └── controller/     # 컨트롤러
│   └── front/
│       ├── popup/          # 팝업 페이지
│       ├── options/        # 설정 페이지
│       └── content/        # 콘텐츠 스크립트
├── shared/                 # 공통 유틸리티 및 API
└── types/                  # 타입 정의
```

## 📋 코딩 규칙

### TypeScript

- 모든 새로운 코드는 TypeScript로 작성
- `any` 타입 사용 금지 (불가피한 경우 `unknown` 사용)
- 적절한 타입 정의 필수

### React

- Functional Component 사용
- Custom Hook 활용
- Props는 interface로 정의

### Clean Architecture

- Domain, Service, Controller 계층 구분
- Port-Adapter 패턴 준수
- 의존성 주입 활용 (tsyringe)

### 스타일링

- Tailwind CSS 사용
- Radix UI 컴포넌트 활용
- 반응형 디자인 고려

## 🐛 버그 리포트

버그를 발견하셨나요? 다음 정보를 포함해서 Issue를 생성해 주세요:

- **브라우저 정보** (Chrome 버전)
- **확장 프로그램 버전**
- **재현 단계**
- **예상 동작**
- **실제 동작**
- **스크린샷** (가능한 경우)

## 💡 기능 제안

새로운 기능을 제안하고 싶으시면:

1. 먼저 기존 Issue에서 중복 확인
2. 기능의 필요성과 사용 사례 설명
3. 가능한 구현 방법 제시
4. UI/UX 목업 (선택사항)

## 🌍 번역 기여

다국어 지원을 위한 번역 기여도 환영합니다!

**지원 언어:**

- 한국어 (ko)
- 영어 (en)
- 일본어 (ja)
- 중국어 번체 (zh_TW)

번역 파일 위치: `src/_locales/[언어코드]/messages.json`

## 🤝 행동 강령

모든 기여자는 [행동 강령](CODE_OF_CONDUCT.md)을 준수해야 합니다.

## 📞 문의

질문이나 도움이 필요하시면:

- **Issue 생성**: 기술적 문제나 제안
- **이메일**: j2i5ll.dev@gmail.com
- **Discussions**: 일반적인 질문이나 아이디어 공유

---

다시 한번 기여해 주셔서 감사합니다! 🚀
