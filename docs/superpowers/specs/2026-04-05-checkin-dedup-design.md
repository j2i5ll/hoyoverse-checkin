# 출석체크 중복 호출 방지 및 순차 호출 딜레이

## 배경

Chrome MV3 서비스 워커가 체크인 알람에 의해 깨어날 때, `CheckInController.start()` 내 즉시 실행과 알람 핸들러가 `checkInAll()`을 동시에 호출하여 동일 계정에 대해 API가 중복 호출된다. 이로 인해 Hoyolab API에서 429(Too Many Requests) 에러가 발생한다.

## 문제 분석

서비스 워커 시작 시 실행 순서:

1. `checkInController.start()` → `this.checkInAll()` 즉시 실행 (fire & forget)
2. `alarmManager.init()` → 알람 리스너 등록
3. 알람 이벤트 처리 → 핸들러에서 `this.checkInAll()` 재실행

결과: 동일 계정에 대해 API가 동시에 두 번 호출됨.

## 변경 사항

### 1. CheckInController — 중복 실행 방지

`checkInAll()`에 `isRunning` 인메모리 플래그를 추가하여, 이미 실행 중이면 후속 호출을 스킵한다.

- `isRunning`은 인메모리 상태이므로 서비스 워커가 종료/재시작되면 `false`로 초기화된다.
- `try/finally`로 에러 발생 시에도 플래그가 해제되도록 보장한다.

**변경 파일:** `src/apps/background/controller/check-in/index.ts`

```typescript
export class CheckInController {
  private isRunning = false;

  async checkInAll() {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      const checkInList = await this.getCheckInListUsecase.execute();
      if (checkInList.length === 0) return;
      const checkInResultList = await this.callCheckInApiService.execute(checkInList);
      accountStore.updateLastCheckIn(checkInResultList);
    } finally {
      this.isRunning = false;
    }
  }
}
```

### 2. CallCheckInApiService — 호출 간 랜덤 딜레이

순차 API 호출 사이에 1000~2000ms 랜덤 딜레이를 추가하여 429 에러를 방어한다. 첫 번째 호출 전에는 딜레이를 적용하지 않는다.

**변경 파일:** `src/apps/background/service/check-in/CallCheckInApiService.ts`

```typescript
for (const checkInTarget of checkInTargetList) {
  if (checkInResultList.length > 0) {
    await this.delay(1000, 2000);
  }
  // 기존 API 호출 로직
}

private delay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

## 변경 범위

| 파일 | 변경 내용 |
|------|----------|
| `src/apps/background/controller/check-in/index.ts` | `isRunning` guard 추가 |
| `src/apps/background/service/check-in/CallCheckInApiService.ts` | 호출 간 랜덤 딜레이 추가 |
