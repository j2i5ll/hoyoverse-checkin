import { GameId, GameActId, GameKey, GAME_INFO_LIST } from '@src/shared/constants/game';
import { GameItemType } from '@src/types';

export function gameIdToActId(gameId: number): string | undefined {
  const entry = Object.entries(GameId).find(([, id]) => id === gameId);
  if (!entry) return undefined;
  return GameActId[entry[0] as GameKey];
}

export function getGameInfoByGameId(gameId: number): GameItemType | undefined {
  const actId = gameIdToActId(gameId);
  if (!actId) return undefined;
  return GAME_INFO_LIST.find((game) => game.actId === actId);
}
