# 계정 등록 결과 피드백 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 계정 등록 완료 후 페이지 이동을 거쳐도 사용자에게 등록 성공 피드백을 표시한다.

**Architecture:** `sessionStorage`에 등록 결과를 저장 → 페이지 이동 → content script 재로드 시 읽어서 `AddedAccountCard` 표시 후 삭제.

**Tech Stack:** React, sessionStorage (Web API), i18next

**Spec:** `docs/superpowers/specs/2026-03-19-registration-result-feedback-design.md`

---

### Task 1: AddedAccountCard에서 email 의존성 제거

**Files:**
- Modify: `src/apps/front/content/tooltip/components/tooltip-body/AddedAccountCard.tsx`

- [ ] **Step 1: email prop 제거, count 기반 메시지로 통일**

전체 파일 변경:

```tsx
import { WithTranslation, withTranslation } from 'react-i18next';
import { ToggleTooltipContext } from '../../provider/toggleTooltip';
import { useContext } from 'react';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';

interface AddedAccountBodyProps extends WithTranslation {
  count?: number;
}

function AddedAccountCard({ t, count = 1 }: AddedAccountBodyProps) {
  const { setIsTooltipShow } = useContext(ToggleTooltipContext);
  setTimeout(() => setIsTooltipShow(false), 5000);

  const message = t('content.accounts_added', { count });

  return (
    <TooltipLayout
      content={
        <>
          <div className="description">
            <div dangerouslySetInnerHTML={{ __html: message }}></div>
            <div>{t('content.check_automatically_in_browser')}</div>
          </div>
          <div className="absolute bottom-0 left-0 h-[4px] animate-timer bg-foreground"></div>
        </>
      }
    />
  );
}
export default withTranslation()(AddedAccountCard);
```

변경 요약:
- `email` prop 완전 제거 (interface에서 삭제)
- `count > 1 ? ... : t('content.email_added', { email })` 분기 → `t('content.accounts_added', { count })`로 통일

- [ ] **Step 2: 빌드 확인**

Run: `npm run type-check`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/apps/front/content/tooltip/components/tooltip-body/AddedAccountCard.tsx
git commit -m "Refactor: AddedAccountCard에서 email 의존성 제거, count 기반 메시지로 통일"
```

---

### Task 2: LoginUserTooltip에서 sessionStorage 저장 후 페이지 이동

**Files:**
- Modify: `src/apps/front/content/tooltip/components/LoginUserTooltip.tsx`

sessionStorage key는 Task 3에서 상수로 정의하지만, 같은 리터럴 값 `'__hoyo_checkin_registration_result'`을 사용한다.

- [ ] **Step 1: onSuccess 핸들러를 sessionStorage 기반으로 변경하고 dead code 제거**

변경 사항 (diff 형태):

1. `useState` import에서 `useState` 제거 (다른 곳에서 사용하지 않음). `useMemo`는 `registeredKeys`에서 사용하므로 유지:
   ```tsx
   import { useMemo } from 'react';
   ```

2. `AddedAccountCard` import 제거:
   ```tsx
   // 삭제: import AddedAccountCard from './tooltip-body/AddedAccountCard';
   ```

3. `addResult` state 제거:
   ```tsx
   // 삭제: const [addResult, setAddResult] = useState<number | false>(false);
   ```

4. `onSuccess` 핸들러에서 `setAddResult` → `sessionStorage.setItem`:
   ```tsx
   onSuccess: async (results) => {
     const successResults = results.filter((r) => r.success);
     for (const result of successResults) {
       if (result.checkInResult) {
         await updateLastCheckIn(result.checkInResult);
       }
     }
     sessionStorage.setItem(
       '__hoyo_checkin_registration_result',
       JSON.stringify({ count: successResults.length }),
     );
     window.location.replace(removeRegistrationFlag());
   },
   ```
   (`sessionStorage.setItem`은 동기 API이므로 race condition 없음)

5. `addResult !== false` 분기 제거:
   ```tsx
   // 삭제: if (addResult !== false) {
   // 삭제:   return <AddedAccountCard email={email} count={addResult} />;
   // 삭제: }
   ```

- [ ] **Step 2: 빌드 확인**

Run: `npm run type-check`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/apps/front/content/tooltip/components/LoginUserTooltip.tsx
git commit -m "Refactor: 등록 성공 시 sessionStorage에 결과 저장 후 페이지 이동"
```

---

### Task 3: app.tsx에서 sessionStorage 읽어 AddedAccountCard 표시

**Files:**
- Modify: `src/apps/front/content/tooltip/app.tsx`

- [ ] **Step 1: 마운트 시 sessionStorage에서 등록 결과를 읽고 분기 추가**

전체 파일 변경:

```tsx
import { useContext, useState } from 'react';
import '@front/external/assets/global.css';
import LoginUserTooltip from './components/LoginUserTooltip';
import '@src/shared/i18n';
import { ToggleTooltipContext } from './provider/toggleTooltip';
import LogoutUserTooltip from './components/LogoutUserTooltip';
import RegistrationPrompt from './components/RegistrationPrompt';
import AddedAccountCard from './components/tooltip-body/AddedAccountCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loginStatusQuery } from '@front/shared/queryOptions/queryies';
import { hasRegistrationFlag } from '@src/shared/utils/url';

const REGISTRATION_RESULT_KEY = '__hoyo_checkin_registration_result';

export default function App() {
  const { isTooltipShow } = useContext(ToggleTooltipContext);
  const queryClient = useQueryClient();
  const [registrationResult] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(REGISTRATION_RESULT_KEY);
    if (stored) {
      sessionStorage.removeItem(REGISTRATION_RESULT_KEY);
      try {
        return JSON.parse(stored).count ?? null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const { data: loginStatus } = useQuery({
    ...loginStatusQuery(queryClient),
  });

  if (!isTooltipShow) {
    return null;
  }

  if (registrationResult !== null) {
    return <AddedAccountCard count={registrationResult} />;
  }

  if (!hasRegistrationFlag()) {
    return <RegistrationPrompt />;
  }

  if (loginStatus === 'login') {
    return <LoginUserTooltip />;
  }
  if (loginStatus === 'logout') {
    return <LogoutUserTooltip />;
  }
  return null;
}
```

핵심:
- `useState` 초기화 함수에서 동기적으로 `sessionStorage.getItem` → `removeItem` 수행 (일회성 보장, 리렌더 시 재실행 안됨)
- `registrationResult` 분기가 `hasRegistrationFlag` 보다 먼저 와야 함 (`?h=true`가 제거된 상태이므로 순서가 바뀌면 `RegistrationPrompt`가 뜸)

- [ ] **Step 2: 빌드 확인**

Run: `npm run type-check`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/apps/front/content/tooltip/app.tsx
git commit -m "Feat: 페이지 이동 후 sessionStorage에서 등록 결과 읽어 피드백 표시"
```

---

### Task 4: 최종 검증

- [ ] **Step 1: 전체 빌드 확인**

Run: `npm run type-check && npm run build`
Expected: 에러 없음

- [ ] **Step 2: 수동 테스트 시나리오 확인**

1. Hoyolab 출첵 페이지 접속
2. 등록 프롬프트 → 확인 → 로그인
3. 게임 선택 → 등록
4. 페이지 이동 후 `AddedAccountCard`가 "N개의 계정이 추가되었습니다" 메시지와 함께 표시되는지 확인
5. 5초 후 자동으로 사라지는지 확인
6. 새로고침 시 다시 표시되지 않는지 확인 (일회성)
