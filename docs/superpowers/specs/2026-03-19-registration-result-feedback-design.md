# 계정 등록 완료 후 결과 피드백 전달

## 문제

계정 등록(게임 선택 → 등록) 성공 후 `?h=true` 플래그를 제거하면서 `window.location.replace()`로 페이지가 이동된다. 이로 인해 `AddedAccountCard`가 렌더링되기 전에 페이지가 리셋되어 사용자에게 등록 성공 피드백이 전달되지 않는다.

## 제약 조건

- `?h=true` 플래그 제거를 위한 페이지 이동은 반드시 유지
- 페이지 이동 후에도 등록 성공 상태를 전달할 수 있어야 함

## 접근법

`chrome.storage.session`을 사용하여 등록 결과를 페이지 이동 전에 저장하고, 이동 후 content script가 읽어서 표시한다.

선택 이유:
- 프로젝트의 기존 `chrome.storage` 패턴과 일관성
- 브라우저 세션 종료 시 자동 삭제 (별도 정리 불필요)
- 외부 사이트(Hoyolab) storage 오염 없음
- `manifest.json`의 `"storage"` 퍼미션이 session도 포함하므로 별도 변경 불필요

## 데이터 흐름

```
등록 성공 (onSuccess)
    │
    ├─ chrome.storage.session.set({ registrationResult: { count: N } })
    ├─ window.location.replace(removeRegistrationFlag())
    │
    ▼
페이지 이동 후 content script 재로드
    │
    ├─ app.tsx에서 chrome.storage.session.get('registrationResult')
    ├─ 값이 있으면 → AddedAccountCard 표시
    ├─ 표시 즉시 chrome.storage.session.remove('registrationResult') (일회성)
    └─ 5초 후 자동 닫힘 (기존 동작 유지)
```

## 저장 형태

- key: `registrationResult`
- value: `{ count: number }`
- email은 저장하지 않음 (count > 1일 때 이미 email 미사용)

## 변경 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/apps/front/content/tooltip/components/LoginUserTooltip.tsx` | `onSuccess`에서 `setAddResult` → `chrome.storage.session.set` 후 페이지 이동. `addResult` state 및 `AddedAccountCard` import 제거 |
| `src/apps/front/content/tooltip/app.tsx` | 마운트 시 session storage 읽기 → 결과 있으면 `AddedAccountCard` 렌더링 |
| `src/apps/front/content/tooltip/components/tooltip-body/AddedAccountCard.tsx` | 변경 없음 (기존 그대로 재사용) |

## app.tsx 분기 순서

```
1. registrationResult 있음 → AddedAccountCard (5초 후 자동 닫힘)
2. hasRegistrationFlag() 없음 → RegistrationPrompt
3. loginStatus === 'login' → LoginUserTooltip
4. loginStatus === 'logout' → LogoutUserTooltip
```
