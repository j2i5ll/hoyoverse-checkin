import type { CallCheckInApiUsecase } from '@background/domain/check-in/usecase/CallCheckInApiUsecase';
import type { GetCheckInListUsecase } from '@background/domain/check-in/usecase/GetCheckInListUsecase';

import { accountStore } from '@background/store/accountStore';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CheckInController {
  //https://developer.chrome.com/docs/extensions/mv3/service_workers/service-worker-lifecycle/#idle-shutdown
  private readonly TIMER_TIMEOUT = 25 * 1000;

  constructor(
    @inject('CallCheckInApiUsecase')
    private callCheckInApiService: CallCheckInApiUsecase,
    @inject('GetCheckInListUsecase')
    private getCheckInListUsecase: GetCheckInListUsecase,
  ) {}
  runCheckInInterval() {
    this.checkInAll();
    this.runCheckInTimer(this.TIMER_TIMEOUT);
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

  private runCheckInTimer(ms: number) {
    setTimeout(() => {
      this.checkInAll();
      this.runCheckInTimer(this.TIMER_TIMEOUT);
    }, ms);
  }
}
