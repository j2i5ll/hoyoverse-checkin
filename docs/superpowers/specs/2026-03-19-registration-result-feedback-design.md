# 계정 등록 완료 후 결과 피드백 전달

## 문제

계정 등록(게임 선택 → 등록) 성공 후 `?h=true` 플래그를 제거하면서 `window.location.replace()`로 페이지가 이동된다. 이로 인해 `AddedAccountCard`가 렌더링되기 전에 페이지가 리셋되어 사용자에게 등록 성공 피드백이 전달되지 않는다.

## 제약 조건

- `?h=true` 플래그 제거를 위한 페이지 이동은 반드시 유지
- 페이지 이동 후에도 등록 성공 상태를 전달할 수 있어야 함

## 접근법

`window.sessionStorage` (Web API)를 사용하여 등록 결과를 페이지 이동 전에 저장하고, 이동 후 content script가 읽어서 표시한다.

선택 이유:
- 동기 API (`setItem`/`getItem`) — message passing 불필요, 구현 단순
- 탭 스코프 격리 — 다른 탭에 영향 없음
- 같은 origin(act.hoyolab.com) 내 `location.replace()` 시 유지됨
- 탭 닫으면 자동 삭제 (별도 정리 불필요)

## 데이터 흐름

```
등록 성공 (onSuccess)
    │
    ├─ sessionStorage.setItem('__hoyo_checkin_registration_result', JSON.stringify({ count: N }))
    ├─ window.location.replace(removeRegistrationFlag())
    │
    ▼
페이지 이동 후 content script 재로드
    │
    ├─ app.tsx 마운트 시 sessionStorage.getItem('__hoyo_checkin_registration_result')
    ├─ 값이 있으면 → AddedAccountCard 표시
    ├─ 읽은 즉시 sessionStorage.removeItem() (일회성)
    └─ 5초 후 자동 닫힘 (기존 동작 유지)
```

## 저장 형태

- key: `__hoyo_checkin_registration_result`
- value: `JSON.stringify({ count: number })`
- 삭제: `sessionStorage.removeItem(key)`

## AddedAccountCard 수정

현재 `count <= 1`일 때 `email`을 사용하는 분기가 있으나, sessionStorage에는 count만 저장한다. `AddedAccountCard`를 수정하여 항상 count 기반 메시지(`t('content.accounts_added', { count })`)를 사용하도록 통일한다. `email` prop은 optional로 변경.

## 변경 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/apps/front/content/tooltip/components/LoginUserTooltip.tsx` | `onSuccess`에서 `setAddResult` → `sessionStorage.setItem` 후 페이지 이동. `addResult` state 및 `AddedAccountCard` import 제거 |
| `src/apps/front/content/tooltip/app.tsx` | 마운트 시 `sessionStorage.getItem`으로 읽기 → 결과 있으면 `AddedAccountCard` 렌더링 후 `removeItem` |
| `src/apps/front/content/tooltip/components/tooltip-body/AddedAccountCard.tsx` | `email` prop을 optional로 변경, count 기반 메시지로 통일 |

## app.tsx 분기 순서

```
1. registrationResult 있음 → AddedAccountCard (5초 후 자동 닫힘)
   ※ ?h=true가 제거된 상태이므로, 이 분기가 hasRegistrationFlag 체크보다 먼저 와야 함
2. hasRegistrationFlag() 없음 → RegistrationPrompt
3. loginStatus === 'login' → LoginUserTooltip
4. loginStatus === 'logout' → LogoutUserTooltip
```

## 알려진 제한사항

- Hoyolab 페이지의 `sessionStorage` namespace에 키가 하나 추가됨 (접두사 `__hoyo_checkin_`으로 충돌 방지)
- 전체 실패(count=0) 시 — mutation의 `throwOnError: true`에 의해 ErrorBoundary가 처리하므로 onSuccess에 도달하지 않음
