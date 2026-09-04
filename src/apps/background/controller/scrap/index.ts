import { GetScrapTargetUsecase } from '@background/domain/scrap/usecase/GetScrapTargetUsecase';
import { SyncAccountScrapUsecase } from '@background/domain/scrap/usecase/SyncAccountScrapUsecase';
import { alarmManager, ALARM_NAMES } from '@background/alarm/AlarmManager';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ScrapController {
  constructor(
    @inject('SyncAccountScrapUsecase')
    private syncAccountScrapService: SyncAccountScrapUsecase,
    @inject('GetScrapTargetUsecase')
    private getScrapTargetService: GetScrapTargetUsecase,
  ) {}

  async start() {
    alarmManager.registerHandler(ALARM_NAMES.SCRAP, () => this.syncData());

    await alarmManager.ensureAlarm(ALARM_NAMES.SCRAP, {
      delayInMinutes: 1,
      periodInMinutes: 30,
    });
  }

  private async syncData() {
    const targetList = await this.getScrapTargetService.execute();

    for (const target of targetList) {
      const { actId, ltoken, ltuid } = target;
      await this.syncAccountScrapService.execute({
        actId,
        token: { ltoken, ltuid },
      });
    }
  }
}
