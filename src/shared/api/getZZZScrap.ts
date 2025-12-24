import { ScrapLang, TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { filterFulfilled } from '@src/shared/utils/promise';
import { captureException } from '@sentry/browser';

export const getZZZCharacters = async ({
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
  const { data, retcode, message } = await httpWithCookie(
    `https://sg-public-api.hoyolab.com/event/game_record_zzz/api/zzz/avatar/basic?role_id=${roleId}&server=${region}`,
    {
      method: 'GET',
      headers: {
        'x-rpc-lang': lang,
        'x-rpc-language': lang,
      },
    },
    token,
    false,
  );
  if (retcode !== ApiRetCode.Success) {
    const error = new Error(message);
    captureException(error);
    throw error;
  }
  const detailList = await Promise.allSettled(
    data.avatar_list.map(({ id }) => {
      return httpWithCookie(
        `https://sg-public-api.hoyolab.com/event/game_record_zzz/api/zzz/avatar/info?id_list[]=${
          id
        }&need_wiki=true&server=${region}&role_id=${roleId}`,
        {
          method: 'GET',
          headers: {
            'x-rpc-lang': lang,
            'x-rpc-language': lang,
          },
        },
        token,
        false,
      );
    }),
  );

  const characterResponseList = filterFulfilled(detailList);
  return characterResponseList.map((detail) => {
    const avatar = detail.data.avatar_list[0];

    const weaponId = avatar.weapon?.id;
    const weaponWikiUrl = weaponId ? detail.data.weapon_wiki[weaponId] : null;
    const weaponWikiId = weaponWikiUrl ? weaponWikiUrl.split('/').pop() : null;
    if (weaponWikiId && avatar.weapon) {
      avatar.weapon.wikiId = parseInt(weaponWikiId);
    }

    return {
      ...avatar,
    };
  });
};

export const getZZZSiuRecords = async ({
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
  const { data, retcode, message } = await httpWithCookie(
    `https://sg-public-api.hoyolab.com/event/game_record_zzz/api/zzz/challenge?role_id=${roleId}&server=${region}&need_all=true&schedule_type=1`,
    {
      method: 'GET',
      headers: {
        'x-rpc-lang': lang,
        'x-rpc-language': lang,
      },
    },
    token,
    false,
  );
  if (retcode !== ApiRetCode.Success) {
    const error = new Error(message);
    captureException(error);
    throw error;
  }
  return data;
};

export const getZZZStormRecords = async ({
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
  const { data, retcode, message } = await httpWithCookie(
    `https://sg-public-api.hoyolab.com/event/game_record_zzz/api/zzz/mem_detail?uid=${roleId}&region=${region}&schedule_type=1`,
    {
      method: 'GET',
      headers: {
        'x-rpc-lang': lang,
        'x-rpc-language': lang,
      },
    },
    token,
    false,
  );
  if (retcode !== ApiRetCode.Success) {
    const error = new Error(message);
    captureException(error);
    throw error;
  }
  return data;
};
