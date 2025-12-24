import type {
  ScrapGameDataInput,
  ScrapGameDataOutput,
} from '@background/domain/scrap/port/ScrapGameDataPort';
import { ScrapGameDataUsecase } from '@background/domain/scrap/usecase/ScrapGameDataUsecase';
import {
  getZZZCharacters,
  getZZZSiuRecords,
  getZZZStormRecords,
} from '@src/shared/api/getZZZScrap';
import { GameActId, GameId } from '@src/shared/constants/game';
import { GameKey } from '@src/shared/constants/game';
import {
  httpBE,
  getCurrentCookies,
  restoreCookies,
} from '@src/shared/utils/http';
import { captureException } from '@src/shared/utils/sentry';
import { ScrapLang, TokenType } from '@src/types';
import { injectable } from 'tsyringe';
import { ga } from '@src/shared/ga';
import { accountStore } from '@background/store/accountStore';

type RecordDataProps = {
  token: TokenType;
  roleId: string;
  region: string;
  lang: ScrapLang;
};

@injectable()
export class ZZZScrapGameDataService extends ScrapGameDataUsecase {
  async execute(input: ScrapGameDataInput): Promise<ScrapGameDataOutput> {
    const { token } = input;

    const gameCard = await this.getGameRecordCard({
      token,
      gameId: GameId[GameKey.ZZZ],
    });

    const { gameRoleId, region, nickname } = gameCard;

    // 많은 양의 데이터를 한번에 조회하기 때문에
    // 요청 하나하나 호출할때마다 쿠키를 설정/복구를 반복하지 않고
    // 요청을 보내기 전에 쿠키를 미리 저장하고 요청이 완료되면 쿠키를 복구한다.
    const cookies = await getCurrentCookies();
    const [
      characterList,
      siuRecord,
      stormRecord,
      characterListEn,
      siuRecordEn,
      stormRecordEn,
    ] = await Promise.all([
      this.getCharacterRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'ko-kr',
      }),
      this.getSiuRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'ko-kr',
      }),
      this.getStormRecordData({
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
      this.getSiuRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'en-us',
      }),
      this.getStormRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'en-us',
      }),
    ]);

    // 쿠키복구
    await restoreCookies(cookies);

    const res = await this.sendDataToServer({
      data: {
        characterList,
        siuRecord,
        stormRecord,
        i18n: {
          'en-US': {
            characterList: characterListEn,
            siuRecord: siuRecordEn,
            stormRecord: stormRecordEn,
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
    await accountStore.upsertScrap(token, GameKey.ZZZ, {
      isScrap: true,
      lastScrapDate: new Date().toISOString(),
      laqoosToken: data.token,
      nickname,
    });
    return { result: true };
  }

  private async getCharacterRecordData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      const characterList = await getZZZCharacters({
        token,
        roleId,
        region,
        lang,
      });
      return characterList;
    } catch (e) {
      captureException(e);
      return [];
    }
  }

  private async getSiuRecordData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      const siuRecord = await getZZZSiuRecords({
        token,
        roleId,
        region,
        lang,
      });
      return siuRecord;
    } catch (e) {
      captureException(e);
      return undefined;
    }
  }

  private async getStormRecordData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      const stormRecord = await getZZZStormRecords({
        token,
        roleId,
        region,
        lang,
      });
      return stormRecord;
    } catch (e) {
      captureException(e);
      return undefined;
    }
  }

  private async sendDataToServer({
    data: { characterList, siuRecord, stormRecord, i18n },
    roleId,
    region,
  }: {
    data: {
      characterList: unknown[];
      siuRecord: unknown;
      stormRecord: unknown;
      i18n: {
        'en-US': {
          characterList: unknown[];
          siuRecord: unknown;
          stormRecord: unknown;
        };
      };
    };
    roleId: string;
    region: string;
  }) {
    try {
      const res = await httpBE('/functions/v1/zzz/scrap', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            characterList,
            siuRecord,
            stormRecord,
            i18n,
          },
          roleId,
          region,
        }),
      });
      ga.fireEvent('데이터싱크', { act_id: GameActId[GameKey.ZZZ] });
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
