# 계정 등록 시 즉각적인 1회 백그라운드 스크랩 실행 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 신규 계정 등록 시 해당 계정에 대해 즉시 1회 캐릭터/전적 데이터 스크랩을 백그라운드에서 순차적으로 실행한다.

**Architecture:**
- **Clean Architecture Pattern 준수**:
  - `domain/scrap/port/SyncAccountScrapPort.ts`
  - `domain/scrap/usecase/SyncAccountScrapUsecase.ts`
  - `service/scrap/SyncAccountScrapService.ts`
- **비동기 & 논블로킹 (Fire-and-forget)**: `AddAccountService`에서 계정 저장이 완료되면 UI 응답을 지연시키지 않고 백그라운드에서 스크랩을 비동기로 시작한다.
- **순차 큐 (Sequential Queue)**: 한 번에 여러 게임 계정이 등록될 때 호요랩 API Rate Limit(429) 및 동시 요청 충돌을 방지하기 위해 `SyncAccountScrapService` 내부 Promise 큐를 활용해 순차 실행한다.
- **신규 계정 전용**: 이미 저장소에 존재하는 계정일 경우 스크랩을 건너뛴다.

**Tech Stack:** TypeScript, tsyringe, Jest (ts-jest)

---

### Task 1: `accountStore.addAccount` 신규 등록 여부 반환 수정

**Files:**
- Modify: `src/apps/background/store/accountStore.ts`
- Create: `src/apps/background/store/accountStore.spec.ts`

- [x] **Step 1: `accountStore.spec.ts` 테스트 작성**
  - `addAccount` 호출 시 신규 계정이면 `true`를 반환하고 목록에 추가되는지 검증
  - 이미 동일한 `ltoken`과 `actId`를 가진 계정이 존재하면 `false`를 반환하고 목록이 변경되지 않는지 검증
  - `save()` 호출 누락 없이 비동기 저장(`await this.save(accountList)`)되는지 확인

- [x] **Step 2: `accountStore.ts` 구현 수정**
  - `addAccount` 메서드가 이미 존재하는 경우 `false` 반환
  - 새로 추가된 경우 `await this.save(accountList)` 후 `true` 반환하도록 수정

---

### Task 2: `SyncAccountScrapPort` 및 `SyncAccountScrapUsecase` 정의

**Files:**
- Create: `src/apps/background/domain/scrap/port/SyncAccountScrapPort.ts`
- Create: `src/apps/background/domain/scrap/usecase/SyncAccountScrapUsecase.ts`

- [x] **Step 1: `SyncAccountScrapPort.ts` 작성**
  ```typescript
  import { TokenType } from '@src/types';

  export type SyncAccountScrapInput = {
    actId: string;
    token: TokenType;
  };

  export type SyncAccountScrapOutput = {
    success: boolean;
  };
  ```

- [x] **Step 2: `SyncAccountScrapUsecase.ts` 작성**
  ```typescript
  import type { Usecase } from '@background/common/usecase';
  import type {
    SyncAccountScrapInput,
    SyncAccountScrapOutput,
  } from '../port/SyncAccountScrapPort';

  export interface SyncAccountScrapUsecase
    extends Usecase<SyncAccountScrapInput, Promise<SyncAccountScrapOutput>> {}
  ```

---

### Task 3: `SyncAccountScrapService` 구현 (순차 큐 및 게임별 디스패치)

**Files:**
- Create: `src/apps/background/service/scrap/SyncAccountScrapService.ts`
- Create: `src/apps/background/service/scrap/SyncAccountScrapService.spec.ts`

- [x] **Step 1: `SyncAccountScrapService.spec.ts` 테스트 작성**
  - 원신(`GameActId[GameKey.Genshin]`) 전달 시 `genshinScrapGameDataService.execute`가 호출되는지 검증
  - 스타레일(`GameActId[GameKey.Starrail]`) 전달 시 `hsrScrapGameDataService.execute`가 호출되는지 검증
  - ZZZ(`GameActId[GameKey.ZZZ]`) 전달 시 `zzzScrapGameDataService.execute`가 호출되는지 검증
  - 미지원 게임(예: 붕괴3rd 또는 잘못된 actId) 전달 시 아무 스크랩 서비스도 호출되지 않고 정상 종료되는지 검증
  - 동시에 여러 계정 스크랩이 요청되었을 때 순차적으로 차례대로 실행되는지 검증
  - 특정 게임 스크랩 중 에러가 발생해도 전체 큐가 멈추지 않고 다음 스크랩이 정상 진행되는지 검증

- [x] **Step 2: `SyncAccountScrapService.ts` 구현**
  - `@injectable()` 클래스 작성
  - 생성자에서 `ZZZScrapGameDataUsecase`, `HSRScrapGameDataUsecase`, `GenshinScrapGameDataUsecase` 주입
  - 인스턴스 내부 `private queue: Promise<void> = Promise.resolve();` 선언
  - `execute({ actId, token })`:
    - 큐에 작업을 체이닝하여 순차 처리
    - `actId`에 따른 게임별 서비스 분기 호출
    - `try-catch`로 감싸 에러 발생 시 `console.error` 로깅 및 안전한 실패 처리
    - `execute` 자체는 즉시 `{ success: true }`를 반환하거나 큐 작업을 반환할 수 있도록 구성 (단, 호출처가 `await`하지 않아도 안전하게 동작)

---

### Task 4: DI 컨테이너 등록 (`dependency.ts`)

**Files:**
- Modify: `src/apps/background/dependency.ts`

- [x] **Step 1: DI 등록 추가**
  - `SyncAccountScrapUsecase` 토큰으로 `SyncAccountScrapService`를 등록 (순차 큐 상태 공유를 위해 싱글톤 고려 또는 인스턴스 등록)
  ```typescript
  import { SyncAccountScrapService } from './service/scrap/SyncAccountScrapService';
  // ...
  DIContainer.registerSingleton('SyncAccountScrapUsecase', SyncAccountScrapService);
  ```

---

### Task 5: `AddAccountService`에 신규 계정 1회 스크랩 트리거 연동

**Files:**
- Modify: `src/apps/background/service/account/AddAccountService.ts`
- Create: `src/apps/background/service/account/AddAccountService.spec.ts`

- [x] **Step 1: `AddAccountService.spec.ts` 작성**
  - `addAccount`가 `true`(신규 계정)를 반환했을 때 `syncAccountScrapService.execute`가 해당 `actId` 및 `token`으로 호출되는지 검증
  - `addAccount`가 `false`(이미 등록된 계정)를 반환했을 때 `syncAccountScrapService.execute`가 호출되지 않는지 검증
  - `syncAccountScrapService.execute` 호출 시 에러가 발생해도 `AddAccountService.execute`의 성공 응답(`{ success: true }`)에 영향을 주지 않는지 검증

- [x] **Step 2: `AddAccountService.ts` 수정**
  - `@inject('SyncAccountScrapUsecase') private syncAccountScrapService: SyncAccountScrapUsecase` 주입
  - `const isAdded = await accountStore.addAccount(...)`
  - `if (isAdded)` 조건 만족 시:
    ```typescript
    this.syncAccountScrapService
      .execute({ actId, token: { ltoken, ltuid } })
      .catch((err) => console.error('[AddAccountService] 스크랩 실행 에러:', err));
    ```
  - 즉시 `{ success: true }` 반환

---

### Task 6: `ScrapController` 리팩터링 및 전체 빌드/테스트 검증

**Files:**
- Modify: `src/apps/background/controller/scrap/index.ts`

- [x] **Step 1: `ScrapController` 리팩터링**
  - `ScrapController`의 `syncData()` 내 `switch (actId)` 중복 로직을 `SyncAccountScrapUsecase` 호출로 교체
  - 코드 중복 제거 및 단일 스크랩 로직의 단일 책임화

- [x] **Step 2: 전체 테스트 및 빌드 검증**
  - `npm run test` 실행하여 모든 단위 테스트 통과 확인
  - `npm run build` 실행하여 TypeScript 컴파일 및 Vite 번들링 정상 완료 확인
