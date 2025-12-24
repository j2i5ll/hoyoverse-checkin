import type { GetAccountStatusUsecase } from '@background/domain/account/usecase/GetAccountStatusUsecase';
import type {
  GetAccountStatusInput,
  GetAccountStatusOutput,
} from '@background/domain/account/port/GetAccountStatusPort';
import { accountStore } from '@background/store/accountStore';
import { GAME_INFO_LIST } from '@src/shared/constants/game';
import { http } from '@src/shared/utils/http';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { injectable } from 'tsyringe';
import { isLogin } from '@src/shared/utils/validation';
import { getLoginCookie } from '@background/helpers/cookie';
import { AccountInfoType } from '@src/types';

@injectable()
export class GetAccountStatusService implements GetAccountStatusUsecase {
  async execute({
    actId,
  }: GetAccountStatusInput): Promise<GetAccountStatusOutput> {
    const [accountList, cookie] = await Promise.all([
      accountStore.getAccountList(),
      getLoginCookie(),
    ]);
    if (!isLogin(cookie.ltoken, cookie.ltuid)) {
      return 'NOT_LOGIN';
    }

    const currentPageGame = GAME_INFO_LIST.find((game) => game.actId === actId);
    if (!currentPageGame) {
      return 'NOT_SUPPORTED_GAME';
    }

    if (currentPageGame.infoUrl) {
      const { retcode } = await http(`${currentPageGame.infoUrl}${actId}`, {
        method: 'GET',
      });
      if (retcode === ApiRetCode.NoCharacter) {
        return 'NO_CHARACTER_IN_GAME';
      }
    }

    const hasToken = accountList.find(
      (account: AccountInfoType) =>
        account.actId === actId && account.ltuid === cookie.ltuid,
    );
    if (hasToken) {
      return 'EXIST';
    }

    return 'NEW';
  }
}
