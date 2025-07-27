import { TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';
import { getOsDS } from '@src/shared/utils/ds';

type GetCurrentResinProps = {
  region: string;
  gameRoleId: string;
  token: TokenType;
};

export default function getCurrentResin({
  region,
  gameRoleId,
  token,
}: GetCurrentResinProps) {
  const ds = getOsDS();
  return httpWithCookie(
    `https://bbs-api-os.hoyolab.com/game_record/genshin/api/dailyNote?server=${region}&role_id=${gameRoleId}&schedule_type=1`,
    {
      method: 'GET',
      headers: {
        ds,
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
      },
    },
    token,
  );
}
