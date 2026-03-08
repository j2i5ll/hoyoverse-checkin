import type { CallCheckInApiUsecase } from '@background/domain/check-in/usecase/CallCheckInApiUsecase';
import type { GetCheckInListUsecase } from '@background/domain/check-in/usecase/GetCheckInListUsecase';

import { accountStore } from '@background/store/accountStore';
import { alarmManager, ALARM_NAMES } from '@background/alarm/AlarmManager';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CheckInController {
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
      periodInMinutes: 1,
    });
  }

  async checkInAll() {
    const checkInList = await this.getCheckInListUsecase.execute();
    if (checkInList.length === 0) {
      return;
    }
    const checkInResultList =
      await this.callCheckInApiService.execute(checkInList);
    accountStore.updateLastCheckIn(checkInResultList);
  }
}
