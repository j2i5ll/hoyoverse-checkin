import type { AddAccountUsecase } from '@background/domain/account/usecase/AddAccountUsecase';
import type {
  AddAccountInput,
  AddAccountOutput,
} from '@background/domain/account/port/AddAccountPort';
import { accountStore } from '@background/store/accountStore';
import { injectable } from 'tsyringe';
import { getLoginCookie } from '@background/helpers/cookie';
@injectable()
export class AddAccountService implements AddAccountUsecase {
  async execute({ actId, email }: AddAccountInput): Promise<AddAccountOutput> {
    const { ltoken, ltuid } = await getLoginCookie();
    await accountStore.addAccount({
      actId,
      email,
      ltoken,
      ltuid,
      lastCheckInResult: 'warn',
      lastCheckInMessage: '',
      lastCheckInDate: '',
    });
    return { success: true };
  }
}
