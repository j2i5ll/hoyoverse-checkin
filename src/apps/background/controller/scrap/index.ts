import { GetScrapTargetUsecase } from '@background/domain/scrap/usecase/GetScrapTargetUsecase';
import { ScrapGameDataUsecase } from '@background/domain/scrap/usecase/ScrapGameDataUsecase';
import { GameActId, GameKey } from '@src/shared/constants/game';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ScrapController {
  constructor(
    @inject('ZZZScrapGameDataUsecase')
    private zzzScrapGameDataService: ScrapGameDataUsecase,
    @inject('HSRScrapGameDataUsecase')
    private hsrScrapGameDataService: ScrapGameDataUsecase,
    @inject('GetScrapTargetUsecase')
    private getScrapTargetService: GetScrapTargetUsecase,
  ) {}
  private readonly intervalTime = 1000 * 60;

  private async syncData() {
    const targetList = await this.getScrapTargetService.execute();

    for (const target of targetList) {
      const { actId, ltoken, ltuid } = target;
      switch (actId) {
        case GameActId[GameKey.ZZZ]:
          await this.zzzScrapGameDataService.execute({
            token: {
              ltoken,
              ltuid,
            },
          });
          break;
        case GameActId[GameKey.Starrail]:
          await this.hsrScrapGameDataService.execute({
            token: {
              ltoken,
              ltuid,
            },
          });
          break;
        case GameActId[GameKey.Honkai]:
        case GameActId[GameKey.Genshin]:
          // TODO Nothing
          break;
        default:
          throw new Error(`Invalid actId : ${actId}`);
      }
    }
  }
  private runInterval() {
    setTimeout(async () => {
      await this.syncData();
      this.runInterval();
    }, this.intervalTime);
  }
  async run() {
    // 처음 시작시에는 10초 텀을 두고 시작.
    // 가능하면 출첵과 겹치는것을 피하기위해.
    setTimeout(async () => {
      await this.syncData();
      this.runInterval();
    }, 1000 * 10);
  }
}
