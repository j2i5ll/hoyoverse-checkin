import type { Usecase } from '@background/common/usecase';
import type {
  ScrapGameDataInput,
  ScrapGameDataOutput,
} from '@background/domain/scrap/port/ScrapGameDataPort';
import getGameRecordCard from '@src/shared/api/getGameRecordCard';
import { TokenType } from '@src/types';

/*
export interface ScrapGameDataUsecase
  extends Usecase<ScrapGameDataInput, Promise<ScrapGameDataOutput>> {}
  */
export abstract class ScrapGameDataUsecase
  implements Usecase<ScrapGameDataInput, Promise<ScrapGameDataOutput>>
{
  abstract execute(input: ScrapGameDataInput): Promise<ScrapGameDataOutput>;
  protected async getGameRecordCard({
    token,
    gameId,
  }: {
    token: TokenType;
    gameId: number;
  }) {
    const gameCard = await getGameRecordCard({
      token,
      gameId,
    });
    return gameCard;
  }
}
