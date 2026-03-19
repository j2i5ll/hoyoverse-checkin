# 계정 등록 완료 후 결과 피드백 전달

## 문제

계정 등록(게임 선택 → 등록) 성공 후 `?h=true` 플래그를 제거하면서 `window.location.replace()`로 페이지가 이동된다. 이로 인해 `AddedAccountCard`가 렌더링되기 전에 페이지가 리셋되어 사용자에게 등록 성공 피드백이 전달되지 않는다.

## 제약 조건

- `?h=true` 플래그 제거를 위한 페이지 이동은 반드시 유지
- 페이지 이동 후에도 등록 성공 상태를 전달할 수 있어야 함

## 접근법

`chrome.storage.session`을 사용하여 등록 결과를 페이지 이동 전에 저장하고, 이동 후 content script가 읽어서 표시한다.

Content script는 `chrome.storage.session`에 직접 접근할 수 없으므로, 기존 `MessageType.GetStorage`/`SetStorage` 메시지 패턴(`area: 'session'`)을 통해 background service worker를 경유한다. 이 인프라는 이미 구현되어 있다.

선택 이유:
- 프로젝트의 기존 `chrome.storage` + messenger 패턴과 일관성
- 브라우저 세션 종료 시 자동 삭제 (별도 정리 불필요)
- 외부 사이트(Hoyolab) storage 오염 없음
- `manifest.json`의 `"storage"` 퍼미션이 session도 포함하므로 별도 변경 불필요

## 데이터 흐름

```
등록 성공 (onSuccess)
    │
    ├─ await requestMessage({ type: SetStorage, data: { area: 'session', key: 'registrationResult', value: { count: N } } })
    ├─ window.location.replace(removeRegistrationFlag())  ← 반드시 await 후 실행
    │
    ▼
페이지 이동 후 content script 재로드
    │
    ├─ app.tsx 마운트 시 requestMessage({ type: GetStorage, data: { area: 'session', key: 'registrationResult' } })
    ├─ 값이 있으면 → AddedAccountCard 표시
    ├─ useEffect에서 SetStorage로 null 저장하여 삭제 (일회성)
    └─ 5초 후 자동 닫힘 (기존 동작 유지)
```

주의: storage 쓰기(`SetStorage`)가 완료된 후에 페이지 이동이 실행되어야 한다. `requestMessage`는 async이므로 반드시 `await` 해야 한다.

## 저장 형태

- key: `registrationResult`
- value: `{ count: number }`
- 삭제: `SetStorage`에 `value: null`로 처리 (별도 `RemoveStorage` 불필요)

## AddedAccountCard 수정

현재 `count <= 1`일 때 `email`을 사용하는 분기가 있으나, session storage에는 count만 저장한다. `AddedAccountCard`를 수정하여 항상 count 기반 메시지(`t('content.accounts_added', { count })`)를 사용하도록 통일한다. `email` prop은 optional로 변경.

## 변경 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/apps/front/content/tooltip/components/LoginUserTooltip.tsx` | `onSuccess`에서 `setAddResult` → `requestMessage(SetStorage)` 후 페이지 이동. `addResult` state 및 `AddedAccountCard` import 제거 |
| `src/apps/front/content/tooltip/app.tsx` | 마운트 시 `requestMessage(GetStorage)`로 session storage 읽기 → 결과 있으면 `AddedAccountCard` 렌더링. `useEffect`에서 읽기 후 삭제 |
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

- 여러 탭에서 동시 등록 시 session storage가 공유되어 다른 탭에서 결과를 읽을 수 있음 (발생 확률 매우 낮음)
- 전체 실패(count=0)일 경우에도 피드백이 표시됨 — 이 경우 mutation의 `throwOnError: true`에 의해 ErrorBoundary가 처리하므로 onSuccess에 도달하지 않음
