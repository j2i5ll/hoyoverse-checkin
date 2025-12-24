import { http } from '@src/shared/utils/http';
import { ACCOUNT_INFO_URL } from '../constants/url';

type GetAccountInfoProps = {
  ltuid: string;
};
export default async function getAccountInfo({ ltuid }: GetAccountInfoProps) {
  const res = await http(`${ACCOUNT_INFO_URL}${ltuid}`, {
    method: 'GET',
  });
  return res;
}
