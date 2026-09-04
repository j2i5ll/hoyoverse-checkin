import { inject, injectable } from 'tsyringe';
import { SyncAccountScrapUsecase } from '@background/domain/scrap/usecase/SyncAccountScrapUsecase';
import {
  SyncAccountScrapInput,
  SyncAccountScrapOutput,
} from '@background/domain/scrap/port/SyncAccountScrapPort';
import { ScrapGameDataUsecase } from '@background/domain/scrap/usecase/ScrapGameDataUsecase';
import { GameActId, GameKey } from '@src/shared/constants/game';
import { TokenType } from '@src/types';

@injectable()
export class SyncAccountScrapService implements SyncAccountScrapUsecase {
  private queue: Promise<void> = Promise.resolve();

  constructor(
    @inject('ZZZScrapGameDataUsecase')
    private zzzScrapGameDataService: ScrapGameDataUsecase,
    @inject('HSRScrapGameDataUsecase')
    private hsrScrapGameDataService: ScrapGameDataUsecase,
    @inject('GenshinScrapGameDataUsecase')
    private genshinScrapGameDataService: ScrapGameDataUsecase,
  ) {}

  async execute(input: SyncAccountScrapInput): Promise<SyncAccountScrapOutput> {
    const { actId, token } = input;

    const task = this.queue
      .then(async () => {
        await this.scrapGameData(actId, token);
      })
      .catch((error) => {
        console.error(
          `[SyncAccountScrapService] 스크랩 큐 처리 중 오류 발생 (actId: ${actId}):`,
          error,
        );
      });

    this.queue = task;
    await task;

    return { success: true };
  }

  private async scrapGameData(actId: string, token: TokenType): Promise<void> {
    try {
      switch (actId) {
        case GameActId[GameKey.ZZZ]:
          await this.zzzScrapGameDataService.execute({ token });
          break;
        case GameActId[GameKey.Starrail]:
          await this.hsrScrapGameDataService.execute({ token });
          break;
        case GameActId[GameKey.Genshin]:
          await this.genshinScrapGameDataService.execute({ token });
          break;
        case GameActId[GameKey.Honkai]:
          // 붕괴3rd는 현재 스크랩을 지원하지 않음
          break;
        default:
          console.warn(
            `[SyncAccountScrapService] 스크랩 미지원 대상 actId: ${actId}`,
          );
          break;
      }
    } catch (error) {
      console.error(
        `[SyncAccountScrapService] 스크랩 실패 (actId: ${actId}, ltuid: ${token.ltuid}):`,
        error,
      );
    }
  }
}
