import { GameRoleType } from '@src/types';
import { GameId } from '@src/shared/constants/game';

export const mockEmail = 'traveler@hoyoverse.com';
export const mockLtuid = '100088888';

export const mockGameRoles: GameRoleType[] = [
  {
    gameId: GameId.Genshin, // 2
    gameName: '원신',
    gameRoleId: '800123456',
    nickname: '여행자 루미네',
    regionName: 'Asia Server',
    region: 'os_asia',
    level: 60,
  },
  {
    gameId: GameId.Starrail, // 6
    gameName: '붕괴: 스타레일',
    gameRoleId: '800789012',
    nickname: '은하열차 개척자',
    regionName: 'Asia Server',
    region: 'prod_official_asia',
    level: 70,
  },
  {
    gameId: GameId.ZZZ, // 8
    gameName: '젠레스 존 제로',
    gameRoleId: '100456789',
    nickname: '로프꾼 와이즈',
    regionName: 'Asia Server',
    region: 'prod_gf_jp',
    level: 52,
  },
  {
    gameId: GameId.Honkai, // 1
    gameName: '붕괴3rd',
    gameRoleId: '12345678',
    nickname: '히페리온 함장',
    regionName: 'Asia Server',
    region: 'asia01',
    level: 88,
  },
];

// 원신은 이미 등록된 것으로 시뮬레이션
export const mockRegisteredKeys = new Set([`e202102251931481_${mockLtuid}`]);
