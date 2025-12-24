import { FromApiType, TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';

type GetGameRecordCardProps = {
  token: TokenType;
  gameId: number;
};
export default async function getGameRecordCard({
  token,
  gameId,
}: GetGameRecordCardProps): Promise<{
  nickname: string;
  regionName: string;
  region: string;
  gameRoleId: string;
}> {
  const { data } = await httpWithCookie(
    `https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard?uid=${token.ltuid}`,
    {
      method: 'GET',
    },
    token,
  );
  const {
    nickname,
    region_name: regionName,
    region,
    game_role_id: gameRoleId,
  } = data.list.find((game: FromApiType) => game.game_id === gameId);
  return {
    gameRoleId,
    nickname,
    regionName,
    region,
  };
}
