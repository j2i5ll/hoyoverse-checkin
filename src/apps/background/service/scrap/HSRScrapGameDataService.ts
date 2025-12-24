import type {
  ScrapGameDataInput,
  ScrapGameDataOutput,
} from '@background/domain/scrap/port/ScrapGameDataPort';
import { ScrapGameDataUsecase } from '@background/domain/scrap/usecase/ScrapGameDataUsecase';
import { GameActId, GameId } from '@src/shared/constants/game';
import { GameKey } from '@src/shared/constants/game';
import {
  getCurrentCookies,
  httpBE,
  restoreCookies,
} from '@src/shared/utils/http';
import { captureException } from '@src/shared/utils/sentry';
import { ScrapLang, TokenType } from '@src/types';
import { injectable } from 'tsyringe';
import { ga } from '@src/shared/ga';
import { accountStore } from '@background/store/accountStore';
import {
  getHSRBossRecord,
  getHSRCharacters,
  getHSRForgotRecord,
  getHSRStoryRecord,
} from '@src/shared/api/getHSRScrap';

type RecordDataProps = {
  token: TokenType;
  roleId: string;
  region: string;
  lang: ScrapLang;
};

@injectable()
export class HSRScrapGameDataService extends ScrapGameDataUsecase {
  async execute(input: ScrapGameDataInput): Promise<ScrapGameDataOutput> {
    const { token } = input;
    const gameCard = await this.getGameRecordCard({
      token,
      gameId: GameId[GameKey.Starrail],
    });

    // 많은 양의 데이터를 한번에 조회하기 때문에
    // 요청 하나하나 호출할때마다 쿠키를 설정/복구를 반복하지 않고
    // 요청을 보내기 전에 쿠키를 미리 저장하고 요청이 완료되면 쿠키를 복구한다.
    const cookies = await getCurrentCookies();
    const { gameRoleId, region, nickname } = gameCard;
    const [
      characterList,
      forgotRecord,
      storyRecord,
      bossRecord,
      characterListEn,
      forgotRecordEn,
      storyRecordEn,
      bossRecordEn,
    ] = await Promise.all([
      this.getCharacterRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'ko-kr',
      }),
      this.getForgotRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'ko-kr',
      }),
      this.getStoryRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'ko-kr',
      }),
      this.getBossRecordData({
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
      this.getForgotRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'en-us',
      }),
      this.getStoryRecordData({
        token,
        roleId: gameRoleId,
        region,
        lang: 'en-us',
      }),
      this.getBossRecordData({
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
        forgotRecord,
        storyRecord,
        bossRecord,
        i18n: {
          'en-US': {
            characterList: characterListEn,
            forgotRecord: forgotRecordEn,
            storyRecord: storyRecordEn,
            bossRecord: bossRecordEn,
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
    await accountStore.upsertScrap(token, GameKey.Starrail, {
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
      return getHSRCharacters({ region, roleId, token, lang });
    } catch {
      return [];
    }
  }

  private async getForgotRecordData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      return getHSRForgotRecord({ region, roleId, token, lang });
    } catch {
      return;
    }
  }

  private async getStoryRecordData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      return getHSRStoryRecord({ region, roleId, token, lang });
    } catch {
      return;
    }
  }

  private async getBossRecordData({
    token,
    roleId,
    region,
    lang,
  }: RecordDataProps) {
    try {
      return getHSRBossRecord({ region, roleId, token, lang });
    } catch {
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
      forgotRecord: unknown;
      storyRecord: unknown;
      bossRecord: unknown;
      i18n: {
        'en-US': {
          characterList: unknown[];
          forgotRecord: unknown;
          storyRecord: unknown;
          bossRecord: unknown;
        };
      };
    };
    roleId: string;
    region: string;
  }) {
    const { characterList, forgotRecord, storyRecord, bossRecord, i18n } = data;
    try {
      const res = await httpBE('/functions/v1/hsr/scrap', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            characterList,
            forgotRecord,
            storyRecord,
            bossRecord,
            i18n,
          },
          roleId,
          region,
        }),
      });
      ga.fireEvent('데이터싱크', { act_id: GameActId[GameKey.Starrail] });
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
