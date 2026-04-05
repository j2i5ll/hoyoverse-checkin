# 출석체크 중복 호출 방지 및 순차 호출 딜레이 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 서비스 워커 재시작 시 `checkInAll()`의 중복 실행을 방지하고, API 호출 사이에 1~2초 랜덤 딜레이를 추가한다.

**Architecture:** `CheckInController`에 인메모리 `isRunning` guard를 추가하여 동시 실행을 차단한다. `CallCheckInApiService`의 순차 루프에 랜덤 딜레이를 삽입한다.

**Tech Stack:** TypeScript, Jest (ts-jest)

---

### Task 1: CheckInController — isRunning guard 추가

**Files:**
- Modify: `src/apps/background/controller/check-in/index.ts`
- Create: `src/apps/background/controller/check-in/index.spec.ts`

- [ ] **Step 1: 테스트 작성**

```typescript
// src/apps/background/controller/check-in/index.spec.ts
import { CheckInController } from './index';

const mockExecuteCheckIn = jest.fn();
const mockExecuteGetList = jest.fn();
const mockUpdateLastCheckIn = jest.fn();

jest.mock('@background/store/accountStore', () => ({
  accountStore: { updateLastCheckIn: (...args: unknown[]) => mockUpdateLastCheckIn(...args) },
}));

jest.mock('@background/alarm/AlarmManager', () => ({
  alarmManager: {
    registerHandler: jest.fn(),
    ensureAlarm: jest.fn(),
  },
  ALARM_NAMES: { CHECK_IN: 'checkin-interval' },
}));

function createController() {
  return new (CheckInController as any)(
    { execute: mockExecuteCheckIn },
    { execute: mockExecuteGetList },
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CheckInController.checkInAll', () => {
  it('출첵 대상이 있으면 API를 호출하고 결과를 저장한다', async () => {
    const targets = [{ actId: 'act1', ltuid: 'uid1', ltoken: 'tok1', checkInAPIUrl: 'url1' }];
    const results = [{ actId: 'act1', ltuid: 'uid1', retCode: 0, lastCheckInMessage: undefined }];
    mockExecuteGetList.mockResolvedValue(targets);
    mockExecuteCheckIn.mockResolvedValue(results);

    const controller = createController();
    await controller.checkInAll();

    expect(mockExecuteGetList).toHaveBeenCalledTimes(1);
    expect(mockExecuteCheckIn).toHaveBeenCalledWith(targets);
    expect(mockUpdateLastCheckIn).toHaveBeenCalledWith(results);
  });

  it('출첵 대상이 없으면 API를 호출하지 않는다', async () => {
    mockExecuteGetList.mockResolvedValue([]);

    const controller = createController();
    await controller.checkInAll();

    expect(mockExecuteCheckIn).not.toHaveBeenCalled();
  });

  it('이미 실행 중이면 중복 호출을 스킵한다', async () => {
    let resolveFirst: () => void;
    const firstCallPromise = new Promise<void>((resolve) => { resolveFirst = resolve; });

    mockExecuteGetList.mockImplementation(() => firstCallPromise.then(() => [{ actId: 'act1', ltuid: 'uid1', ltoken: 'tok1', checkInAPIUrl: 'url1' }]));
    mockExecuteCheckIn.mockResolvedValue([]);

    const controller = createController();

    const call1 = controller.checkInAll();
    const call2 = controller.checkInAll(); // 중복 호출

    resolveFirst!();
    await Promise.all([call1, call2]);

    expect(mockExecuteGetList).toHaveBeenCalledTimes(1);
  });

  it('실행 중 에러가 발생해도 다음 호출이 가능하다', async () => {
    mockExecuteGetList.mockRejectedValueOnce(new Error('network error'));
    mockExecuteGetList.mockResolvedValueOnce([]);

    const controller = createController();

    await controller.checkInAll().catch(() => {});
    await controller.checkInAll();

    expect(mockExecuteGetList).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

`moduleNameMapper`에 `@background/*` 매핑이 없으면 import 에러가 발생할 수 있다. 아래 Step 3에서 jest config를 먼저 수정한다.

Run: `npx jest src/apps/background/controller/check-in/index.spec.ts --no-cache`
Expected: FAIL — `checkInAll`에 guard가 없으므로 "이미 실행 중이면 중복 호출을 스킵한다" 테스트 실패

- [ ] **Step 3: jest.config.json에 경로 alias 추가 (필요 시)**

```json
{
  "moduleNameMapper": {
    "^@background/(.*)$": "<rootDir>/src/apps/background/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@apps/(.*)$": "<rootDir>/src/apps/$1",
    "^src/(.*)$": "<rootDir>/src/$1"
  }
}
```

- [ ] **Step 4: isRunning guard 구현**

`src/apps/background/controller/check-in/index.ts`를 아래와 같이 수정:

```typescript
@injectable()
export class CheckInController {
  private isRunning = false;

  constructor(
    @inject('CallCheckInApiUsecase')
    private callCheckInApiService: CallCheckInApiUsecase,
    @inject('GetCheckInListUsecase')
    private getCheckInListUsecase: GetCheckInListUsecase,
  ) {}

  async start() {
    alarmManager.registerHandler(ALARM_NAMES.CHECK_IN, () => this.checkInAll());

    this.checkInAll().catch((error) => {
      console.error('[CheckInController] 즉시 실행 checkInAll 실패:', error);
    });

    await alarmManager.ensureAlarm(ALARM_NAMES.CHECK_IN, {
      periodInMinutes: 30,
    });
  }

  async checkInAll() {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      const checkInList = await this.getCheckInListUsecase.execute();
      if (checkInList.length === 0) {
        return;
      }
      const checkInResultList =
        await this.callCheckInApiService.execute(checkInList);
      accountStore.updateLastCheckIn(checkInResultList);
    } finally {
      this.isRunning = false;
    }
  }
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx jest src/apps/background/controller/check-in/index.spec.ts --no-cache`
Expected: PASS (4 tests)

- [ ] **Step 6: 커밋**

```bash
git add src/apps/background/controller/check-in/index.ts src/apps/background/controller/check-in/index.spec.ts jest.config.json
git commit -m "feat: checkInAll 중복 실행 방지를 위한 isRunning guard 추가"
```

---

### Task 2: CallCheckInApiService — 호출 간 랜덤 딜레이 추가

**Files:**
- Modify: `src/apps/background/service/check-in/CallCheckInApiService.ts`
- Create: `src/apps/background/service/check-in/CallCheckInApiService.spec.ts`

- [ ] **Step 1: 테스트 작성**

```typescript
// src/apps/background/service/check-in/CallCheckInApiService.spec.ts
import { CallCheckInApiService } from './CallCheckInApiService';

jest.mock('@src/shared/utils/http', () => ({
  httpWithCookie: jest.fn(),
}));
jest.mock('@src/shared/utils/url', () => ({
  getUrlLocale: () => 'ko-kr',
}));
jest.mock('@background/i18n', () => ({
  i18n: { t: (key: string) => key },
}));
jest.mock('@src/shared/utils/sentry', () => ({
  captureApiException: jest.fn(),
}));
jest.mock('@src/shared/ga', () => ({
  ga: { fireEvent: jest.fn() },
}));

import { httpWithCookie } from '@src/shared/utils/http';

const mockHttpWithCookie = httpWithCookie as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('CallCheckInApiService 호출 간 딜레이', () => {
  it('2개 이상의 대상이 있을 때 첫 번째 호출 후 딜레이가 발생한다', async () => {
    mockHttpWithCookie.mockResolvedValue({ retcode: 0, message: 'ok', data: { gt_result: {} } });

    const service = new CallCheckInApiService();
    const targets = [
      { actId: 'act1', checkInAPIUrl: 'https://api/sign', ltoken: 'tok1', ltuid: 'uid1' },
      { actId: 'act2', checkInAPIUrl: 'https://api/sign', ltoken: 'tok2', ltuid: 'uid2' },
    ];

    const executePromise = service.execute(targets);

    // 첫 번째 호출은 즉시 실행됨
    await jest.advanceTimersByTimeAsync(0);
    expect(mockHttpWithCookie).toHaveBeenCalledTimes(1);

    // 딜레이 경과 후 두 번째 호출
    await jest.advanceTimersByTimeAsync(2000);
    expect(mockHttpWithCookie).toHaveBeenCalledTimes(2);

    await executePromise;
  });

  it('대상이 1개일 때 딜레이 없이 즉시 실행된다', async () => {
    mockHttpWithCookie.mockResolvedValue({ retcode: 0, message: 'ok', data: { gt_result: {} } });

    const service = new CallCheckInApiService();
    const targets = [
      { actId: 'act1', checkInAPIUrl: 'https://api/sign', ltoken: 'tok1', ltuid: 'uid1' },
    ];

    await service.execute(targets);

    expect(mockHttpWithCookie).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx jest src/apps/background/service/check-in/CallCheckInApiService.spec.ts --no-cache`
Expected: FAIL — 아직 딜레이 로직이 없으므로 두 번째 호출이 즉시 실행됨

- [ ] **Step 3: 딜레이 구현**

`src/apps/background/service/check-in/CallCheckInApiService.ts`의 `execute` 메서드 내 루프에 딜레이를 추가하고, `delay` private 메서드를 추가:

```typescript
async execute(
  checkInTargetList: CallCheckInApiInput,
): Promise<CallCheckInApiOutput[]> {
  const checkInResultList = [];
  for (const checkInTarget of checkInTargetList) {
    if (checkInResultList.length > 0) {
      await this.delay(1000, 2000);
    }
    // ... 기존 API 호출 로직 (변경 없음)
  }
  return checkInResultList;
}

private delay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx jest src/apps/background/service/check-in/CallCheckInApiService.spec.ts --no-cache`
Expected: PASS (2 tests)

- [ ] **Step 5: 전체 테스트 통과 확인**

Run: `npx jest --no-cache`
Expected: PASS (6 tests, 2 suites)

- [ ] **Step 6: 커밋**

```bash
git add src/apps/background/service/check-in/CallCheckInApiService.ts src/apps/background/service/check-in/CallCheckInApiService.spec.ts
git commit -m "feat: 출석체크 API 호출 간 1~2초 랜덤 딜레이 추가"
```
