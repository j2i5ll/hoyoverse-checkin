import type {
  ScrapGameDataInput,
  ScrapGameDataOutput,
} from '@background/domain/scrap/port/ScrapGameDataPort';
import { ScrapGameDataUsecase } from '@background/domain/scrap/usecase/ScrapGameDataUsecase';
import { GameActId, GameId } from '@src/shared/constants/game';
import { GameKey } from '@src/shared/constants/game';
import { httpBE } from '@src/shared/utils/http';
import { captureException } from '@src/shared/utils/sentry';
import { ScrapLang, TokenType } from '@src/types';
import { injectable } from 'tsyringe';
import { ga } from '@src/shared/ga';
import { accountStore } from '@background/store/accountStore';
import {
  getGenshinCharacters,
  getGenshinSpiralAbyss,
  getGenshinStygianOnslaught,
} from '@src/shared/api/getGenshinScrap';
import { RetryLaterError } from '@src/shared/errors/RetryLaterError';

type RecordDataProps = {
  token: TokenType;
  roleId: string;
  region: string;
  lang: ScrapLang;
};

@injectable()
export class GenshinScrapGameDataService extends ScrapGameDataUsecase {
  async execute(input: ScrapGameDataInput): Promise<ScrapGameDataOutput> {
    const { token } = input;

    try {
      const gameCard = await this.getGameRecordCard({
        token,
        gameId: GameId[GameKey.Genshin],
      });

      const { gameRoleId, region, nickname } = gameCard;

      const [
        characterList,
        characterListEn,
        spiralAbyss,
        spiralAbyssEn,
        stygianOnslaught,
        stygianOnslaughtEn,
      ] = await Promise.all([
        this.getCharacterRecordData({
          token,
          roleId: gameRoleId,
          region,
          lang: 'ko-kr',
        }),
        this.getCharacterRecordData({
          token,
          roleId: gameRoleId,
          region,
          lang: 'en-us',
        }),
        this.getSpiralAbyssData({
          token,
          roleId: gameRoleId,
          region,
          lang: 'ko-kr',
        }),
        this.getSpiralAbyssData({
          token,
          roleId: gameRoleId,
          region,
          lang: 'en-us',
        }),
        this.getStygianOnslaughtData({
          token,
          roleId: gameRoleId,
          region,
          lang: 'ko-kr',
        }),
        this.getStygianOnslaughtData({
          token,
          roleId: gameRoleId,
          region,
          lang: 'en-us',
        }),
      ]);

      const res = await this.sendDataToServer({
        data: {
          characterList,
          spiralAbyss,
          stygianOnslaught,
          i18n: {
            'en-US': {
              characterList: characterListEn,
              spiralAbyss: spiralAbyssEn,
              stygianOnslaught: stygianOnslaughtEn,
            },
          },
        },
        roleId: gameRoleId,
        region,
      });

      if (!res) {
        return {
          result: false,
        };
      }
      const { data } = res;
      await accountStore.upsertScrap(token, GameKey.Genshin, {
        isScrap: true,
        lastScrapDate: new Date().toISOString(),
        laqoosToken: data.token,
        nickname,
      });

      return { result: true };
    } catch (e) {
      if (e instanceof RetryLaterError) {
        // 서버 점검 시 6시간 뒤 재시도를 위해 lastScrapDate를 6시간 전으로 설정
        const sixHoursAgo = new Date();
        sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

        await accountStore.upsertScrap(token, GameKey.Genshin, {
          isScrap: true,
          lastScrapDate: sixHoursAgo.toISOString(),
        });

        return { result: false };
      }
      throw e;
    }
  }

  private async getCharacterRecordData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      return getGenshinCharacters({ region, roleId, token, lang });
    } catch (e) {
      if (e instanceof RetryLaterError) {
        throw e;
      }
      return [];
    }
  }

  private async getSpiralAbyssData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      return getGenshinSpiralAbyss({ region, roleId, token, lang });
    } catch (e) {
      if (e instanceof RetryLaterError) {
        throw e;
      }
      return;
    }
  }

  private async getStygianOnslaughtData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      return getGenshinStygianOnslaught({ region, roleId, token, lang });
    } catch (e) {
      if (e instanceof RetryLaterError) {
        throw e;
      }
      return;
    }
  }

  private async sendDataToServer({
    data,
    roleId,
    region,
  }: {
    data: {
      characterList: unknown[];
      spiralAbyss: unknown;
      stygianOnslaught: unknown;
      i18n: {
        'en-US': {
          characterList: unknown[];
          spiralAbyss: unknown;
          stygianOnslaught: unknown;
        };
      };
    };
    roleId: string;
    region: string;
  }) {
    const { characterList, spiralAbyss, stygianOnslaught, i18n } = data;
    try {
      const res = await httpBE('/functions/v1/genshinScrap', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            characterList,
            spiralAbyss,
            stygianOnslaught,
            i18n,
          },
          roleId,
          region,
        }),
      });
      ga.fireEvent('데이터싱크', { act_id: GameActId[GameKey.Genshin] });
      return {
        ...res,
      };
    } catch (e) {
      captureException(e);
      console.error(e);
      return null;
    }
  }
}
