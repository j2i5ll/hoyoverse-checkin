import { TokenType } from '@src/types';
import { httpWithCookie } from '@src/shared/utils/http';
import { getOsDS } from '@src/shared/utils/ds';

type GetCurrentEnergyProps = {
  region: string;
  gameRoleId: string;
  token: TokenType;
};

export default async function getCurrentEnergy({
  region,
  gameRoleId,
  token,
}: GetCurrentEnergyProps) {
  const ds = getOsDS();

  return httpWithCookie(
    `https://sg-act-nap-api.hoyolab.com/event/game_record_zzz/api/zzz/note?server=${region}&role_id=${gameRoleId}`,
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
