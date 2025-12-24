import { FromApiType, TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';

export type GetCharacterProps = {
  gameBiz: string;
  token: TokenType;
};
export default async function getCharacter({
  gameBiz,
  token,
}: GetCharacterProps) {
  const { data } = await httpWithCookie(
    `https://api-account-os.hoyolab.com/binding/api/getUserGameRolesByLtoken?game_biz=${gameBiz}`,
    {
      method: 'GET',
    },
    token,
  );
  const { list } = data;
  return list.map((game: FromApiType) => {
    return {
      nickname: game.nickname,
      region: game.region,
      regionName: game.region_name,
      level: game.level,
      gameRoleId: game.game_uid,
    };
  });
}
