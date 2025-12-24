import { GameItemType } from '@src/types';

export enum GameKey {
  Genshin = 'Genshin',
  Starrail = 'Starrail',
  Honkai = 'Honkai',
  ZZZ = 'Zzz',
}

export const GameId = {
  [GameKey.Genshin]: 2,
  [GameKey.Starrail]: 6,
  [GameKey.Honkai]: 0, // 사용되지 않음.
  [GameKey.ZZZ]: 8,
};

export const GameBiz = {
  [GameKey.Genshin]: 'hk4e_global',
  [GameKey.Starrail]: 'hkrpg_global',
  [GameKey.Honkai]: 'honkai', // 사용되지 않음.
  [GameKey.ZZZ]: 'nap_global',
};
export const GameActId = {
  [GameKey.Genshin]: 'e202102251931481',
  [GameKey.Starrail]: 'e202303301540311',
  [GameKey.Honkai]: 'e202110291205111',
  [GameKey.ZZZ]: 'e202406031448091',
};
export const GAME_INFO_LIST: GameItemType[] = [
  {
    name: 'game.genshin',
    icon: 'https://webstatic.hoyoverse.com/upload/static-resource/2022/11/01/37f91f2c509e94c98203a240b12975e9_7738727125880189847.png?x-oss-process=image%2Fresize%2Cs_300%2Fquality%2Cq_80%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cjpg',
    actId: GameActId.Genshin,
    checkInUrl:
      'https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=',
    checkInAPIUrl: 'https://sg-hk4e-api.hoyolab.com/event/sol/sign',
    infoUrl: 'https://sg-hk4e-api.hoyolab.com/event/sol/info?act_id=',
    resourceCheckable: true, // 레진 등 소모 재화 측정이 가능한가?
    accountList: [],
  },
  {
    name: 'game.honkai:star_rail',
    icon: 'https://webstatic-sea.hoyolab.com/communityweb/business/starrail_hoyoverse.png?x-oss-process=image%2Fresize%2Cs_300%2Fquality%2Cq_80%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cjpg',
    actId: GameActId.Starrail,
    checkInUrl:
      'https://act.hoyolab.com/bbs/event/signin/hkrpg/index.html?act_id=',
    checkInAPIUrl: 'https://sg-public-api.hoyolab.com/event/luna/os/sign',
    infoUrl: 'https://sg-public-api.hoyolab.com/event/luna/os/info?act_id=',
    resourceCheckable: true,
    accountList: [],
  },
  {
    name: 'game.zzz',
    icon: 'https://hyl-static-res-prod.hoyolab.com/communityweb/business/nap.png?x-oss-process=image%2Fresize%2Cs_300%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cjpg%2Fquality%2Cq_70',
    actId: GameActId.Zzz,
    checkInUrl:
      'https://act.hoyolab.com/bbs/event/signin/zzz/e202406031448091.html?act_id=',
    checkInAPIUrl: 'https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign',
    infoUrl:
      'https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/info?act_id=',
    resourceCheckable: true,
    accountList: [],
  },
  {
    name: 'game.honkai3rd',
    icon: 'https://webstatic-sea.hoyolab.com/communityweb/business/bh3_hoyoverse.png?x-oss-process=image%2Fresize%2Cs_300%2Fquality%2Cq_80%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cjpg',
    actId: GameActId.Honkai,
    checkInUrl:
      'https://act.hoyolab.com/bbs/event/signin-bh3/index.html?act_id=',
    checkInAPIUrl: 'https://sg-public-api.hoyolab.com/event/mani/sign',
    infoUrl: 'https://sg-public-api.hoyolab.com/event/mani/info?act_id=',
    resourceCheckable: false,
    accountList: [],
  },
];
