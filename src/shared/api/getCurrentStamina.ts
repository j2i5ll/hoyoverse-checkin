import { TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';
import { getOsDS } from '@src/shared/utils/ds';

type GetCurrentStaminaProps = {
  region: string;
  gameRoleId: string;
  token: TokenType;
};

export default async function getCurrentStamina({
  region,
  gameRoleId,
  token,
}: GetCurrentStaminaProps) {
  const ds = getOsDS();
  return httpWithCookie(
    `https://bbs-api-os.hoyolab.com/game_record/hkrpg/api/note?server=${region}&role_id=${gameRoleId}`,
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
