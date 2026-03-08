import { GetScrapTargetUsecase } from '@background/domain/scrap/usecase/GetScrapTargetUsecase';
import { ScrapGameDataUsecase } from '@background/domain/scrap/usecase/ScrapGameDataUsecase';
import { GameActId, GameKey } from '@src/shared/constants/game';
import { alarmManager, ALARM_NAMES } from '@background/alarm/AlarmManager';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ScrapController {
  constructor(
    @inject('ZZZScrapGameDataUsecase')
    private zzzScrapGameDataService: ScrapGameDataUsecase,
    @inject('HSRScrapGameDataUsecase')
    private hsrScrapGameDataService: ScrapGameDataUsecase,
    @inject('GenshinScrapGameDataUsecase')
    private genshinScrapGameDataService: ScrapGameDataUsecase,
    @inject('GetScrapTargetUsecase')
    private getScrapTargetService: GetScrapTargetUsecase,
  ) {}

  async start() {
    alarmManager.registerHandler(ALARM_NAMES.SCRAP, () => this.syncData());

    await alarmManager.ensureAlarm(ALARM_NAMES.SCRAP, {
      delayInMinutes: 1,
      periodInMinutes: 1,
    });
  }

  private async syncData() {
    const targetList = await this.getScrapTargetService.execute();

    for (const target of targetList) {
      const { actId, ltoken, ltuid } = target;
      try {
        switch (actId) {
          case GameActId[GameKey.ZZZ]:
            await this.zzzScrapGameDataService.execute({
              token: { ltoken, ltuid },
            });
            break;
          case GameActId[GameKey.Starrail]:
            await this.hsrScrapGameDataService.execute({
              token: { ltoken, ltuid },
            });
            break;
          case GameActId[GameKey.Genshin]:
            await this.genshinScrapGameDataService.execute({
              token: { ltoken, ltuid },
            });
            break;
          case GameActId[GameKey.Honkai]:
            // TODO Nothing
            break;
          default:
            console.error(`[ScrapController] 잘못된 actId: ${actId}`);
            break;
        }
      } catch (error) {
        console.error(
          `[ScrapController] 스크랩 대상 실패 (actId: ${actId}, ltuid: ${ltuid}):`,
          error,
        );
      }
    }
  }
}
