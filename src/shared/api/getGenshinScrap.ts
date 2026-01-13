import { ScrapLang, TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { captureException } from '@sentry/browser';

type GenshinCharacterListItem = {
  id: number;
  icon: string;
  name: string;
  element: string;
  fetter: number;
  level: number;
  rarity: number;
  actived_constellation_num: number;
  image: string;
  is_chosen: boolean;
  side_icon: string;
  weapon_type: number;
  weapon: {
    id: number;
    icon: string;
    type: number;
    rarity: number;
    level: number;
    affix_level: number;
    name: string;
  };
};

type GenshinCharacterDetailItem = {
  base: GenshinCharacterListItem;
  weapon: {
    id: number;
    name: string;
    icon: string;
    type: number;
    rarity: number;
    level: number;
    promote_level: number;
    type_name: string;
    desc: string;
    affix_level: number;
    main_property: {
      property_type: number;
      base: string;
      add: string;
      final: string;
    };
    sub_property: {
      property_type: number;
      base: string;
      add: string;
      final: string;
    };
  };
  relics: unknown[];
  constellations: unknown[];
  costumes: unknown[];
  selected_properties: unknown[];
  base_properties: unknown[];
  extra_properties: unknown[];
  element_properties: unknown[];
  skills: unknown[];
  recommend_relic_property: unknown;
};

const getGenshinCharacterList = async ({
  region,
  roleId,
  token,
  lang,
}: {
  region: string;
  roleId: string;
  token: TokenType;
  lang: ScrapLang;
}): Promise<GenshinCharacterListItem[]> => {
  const { data, retcode, message } = await httpWithCookie(
    'https://sg-public-api.hoyolab.com/event/game_record/genshin/api/character/list',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rpc-language': lang,
        'x-rpc-lang': lang,
      },
      body: JSON.stringify({
        role_id: roleId,
        server: region,
        sort_type: 1,
      }),
    },
    token,
    false,
  );

  if (retcode !== ApiRetCode.Success) {
    const error = new Error(`retcode: ${retcode}, message: ${message}`);
    captureException(error);
    throw error;
  }

  return data.list || [];
};

const getGenshinCharacterDetail = async ({
  region,
  roleId,
  token,
  lang,
  characterIds,
}: {
  region: string;
  roleId: string;
  token: TokenType;
  lang: ScrapLang;
  characterIds: number[];
}): Promise<{
  list: GenshinCharacterDetailItem[];
  property_map: Record<string, unknown>;
  weapon_wiki: Record<string, string>;
  avatar_wiki: Record<string, string>;
}> => {
  if (characterIds.length === 0) {
    return {
      list: [],
      property_map: {},
      weapon_wiki: {},
      avatar_wiki: {},
    };
  }

  const { data, retcode, message } = await httpWithCookie(
    'https://sg-public-api.hoyolab.com/event/game_record/genshin/api/character/detail',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rpc-language': lang,
        'x-rpc-lang': lang,
      },
      body: JSON.stringify({
        server: region,
        role_id: roleId,
        character_ids: characterIds,
      }),
    },
    token,
    false,
  );

  if (retcode !== ApiRetCode.Success) {
    const error = new Error(`retcode: ${retcode}, message: ${message}`);
    captureException(error);
    throw error;
  }

  return data;
};

export const getGenshinSpiralAbyss = async ({
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
    `https://sg-public-api.hoyolab.com/event/game_record/genshin/api/spiralAbyss?role_id=${roleId}&server=${region}&schedule_type=1`,
    {
      method: 'GET',
      headers: {
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'x-rpc-language': lang,
        'x-rpc-lang': lang,
      },
    },
    token,
    false,
  );

  if (retcode !== ApiRetCode.Success) {
    const error = new Error(`retcode: ${retcode}, message: ${message}`);
    captureException(error);
    throw error;
  }

  return data;
};

export const getGenshinStygianOnslaught = async ({
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
    `https://sg-public-api.hoyolab.com/event/game_record/genshin/api/hard_challenge?role_id=${roleId}&server=${region}&need_detail=true`,
    {
      method: 'GET',
      headers: {
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'x-rpc-language': lang,
        'x-rpc-lang': lang,
      },
    },
    token,
    false,
  );

  if (retcode !== ApiRetCode.Success) {
    const error = new Error(`retcode: ${retcode}, message: ${message}`);
    captureException(error);
    throw error;
  }

  return data;
};

export const getGenshinCharacters = async ({
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
  // 1. 캐릭터 목록 조회
  const characterList = await getGenshinCharacterList({
    region,
    roleId,
    token,
    lang,
  });

  // 캐릭터가 없으면 빈 배열 반환
  if (characterList.length === 0) {
    return [];
  }

  // 2. 캐릭터 ID 추출
  const characterIds = characterList.map((char) => char.id);

  // 3. 캐릭터 상세 정보 조회
  const detailData = await getGenshinCharacterDetail({
    region,
    roleId,
    token,
    lang,
    characterIds,
  });

  // 4. Wiki ID 추출하여 추가
  const { list: detailList, weapon_wiki, avatar_wiki } = detailData;

  return detailList.map((detail) => {
    const weaponId = detail.weapon?.id;
    const weaponWikiUrl = weaponId ? weapon_wiki[weaponId] : null;
    const weaponWikiId = weaponWikiUrl ? weaponWikiUrl.split('/').pop() : null;

    const avatarId = detail.base?.id;
    const avatarWikiUrl = avatarId ? avatar_wiki[avatarId] : null;
    const avatarWikiId = avatarWikiUrl ? avatarWikiUrl.split('/').pop() : null;

    return {
      ...detail,
      weapon: detail.weapon
        ? {
            ...detail.weapon,
            wikiId: weaponWikiId ? parseInt(weaponWikiId) : null,
          }
        : null,
      wikiId: avatarWikiId ? parseInt(avatarWikiId) : null,
    };
  });
};
