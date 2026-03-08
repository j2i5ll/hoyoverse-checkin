import { FromApiType, TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { captureApiException } from '@src/shared/utils/sentry';
import { RetryLaterError } from '@src/shared/errors/RetryLaterError';

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
  const url = `https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard?uid=${token.ltuid}`;
  const { data, retcode, message } = await httpWithCookie(
    url,
    {
      method: 'GET',
    },
    token,
  );

  if (retcode === ApiRetCode.ServerMaintenance) {
    throw new RetryLaterError(retcode, message);
  }

  if (retcode !== ApiRetCode.Success) {
    const error = new Error(`retcode: ${retcode}, message: ${message}`);
    captureApiException(error, url);
    throw error;
  }

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
