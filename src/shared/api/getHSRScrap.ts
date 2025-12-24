import { ScrapLang, TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { captureException } from '@sentry/browser';
import { getOsDS } from '@src/shared/utils/ds';

export const getHSRCharacters = async ({
  region,
  roleId,
  token,
  lang,
}: {
  region: string;
  roleId: string;
  token: TokenType;
  lang: ScrapLang;
}) => {
  const ds = getOsDS();
  const { data, retcode, message } = await httpWithCookie(
    `https://sg-public-api.hoyolab.com/event/game_record/hkrpg/api/avatar/info?server=${region}&role_id=${roleId}&need_wiki=true`,
    {
      method: 'GET',
      headers: {
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'x-rpc-language': lang,
        ds,
      },
    },
    token,
  );
  if (retcode !== ApiRetCode.Success) {
    const error = new Error(message);
    captureException(error);
    throw error;
  }
  const avatarList = data.avatar_list;
  const weaponWikiMap = data.equip_wiki;

  return avatarList.map((avatar) => {
    if (avatar.equip) {
      const weaponWikiUrl = weaponWikiMap[avatar.equip.id];
      const weaponWikiId = weaponWikiUrl
        ? weaponWikiUrl.split('/').pop()
        : null;
      if (weaponWikiId) {
        avatar.equip.wikiId = parseInt(weaponWikiId);
      }
    }
    return {
      ...avatar,
    };
  });
};

export const getHSRForgotRecord = async ({
  token,
  roleId,
  region,
  lang,
}: {
  token: TokenType;
  roleId: string;
  region: string;
  lang: ScrapLang;
}) => {
  const ds = getOsDS();
  const { data, retcode, message } = await httpWithCookie(
    `https://sg-public-api.hoyolab.com/event/game_record/hkrpg/api/challenge?schedule_type=1&role_id=${roleId}&server=${region}&need_all=true`,
    {
      method: 'GET',
      headers: {
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'x-rpc-language': lang,
        ds,
      },
    },
    token,
  );
  if (retcode !== ApiRetCode.Success) {
    const error = new Error(message);
    captureException(error);
    throw error;
  }
  return data;
};

export const getHSRStoryRecord = async ({
  token,
  roleId,
  region,
  lang,
}: {
  token: TokenType;
  roleId: string;
  region: string;
  lang: ScrapLang;
}) => {
  const ds = getOsDS();
  const { data, retcode, message } = await httpWithCookie(
    `https://sg-public-api.hoyolab.com/event/game_record/hkrpg/api/challenge_story?schedule_type=1&role_id=${roleId}&server=${region}&need_all=true`,
    {
      method: 'GET',
      headers: {
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'x-rpc-language': lang,
        ds,
      },
    },
    token,
  );
  if (retcode !== ApiRetCode.Success) {
    const error = new Error(message);
    captureException(error);
    throw error;
  }
  return data;
};

export const getHSRBossRecord = async ({
  token,
  roleId,
  region,
  lang,
}: {
  token: TokenType;
  roleId: string;
  region: string;
  lang: ScrapLang;
}) => {
  const ds = getOsDS();
  const { data, retcode, message } = await httpWithCookie(
    `https://sg-public-api.hoyolab.com/event/game_record/hkrpg/api/challenge_boss?schedule_type=1&role_id=${roleId}&server=${region}&need_all=true`,
    {
      method: 'GET',
      headers: {
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'x-rpc-language': lang,
        ds,
      },
    },
    token,
  );
  if (retcode !== ApiRetCode.Success) {
    const error = new Error(message);
    captureException(error);
    throw error;
  }
  return data;
};
