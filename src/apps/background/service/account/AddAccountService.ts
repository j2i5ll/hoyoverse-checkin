import type { AddAccountUsecase } from '@background/domain/account/usecase/AddAccountUsecase';
import type {
  AddAccountInput,
  AddAccountOutput,
} from '@background/domain/account/port/AddAccountPort';
import type { SyncAccountScrapUsecase } from '@background/domain/scrap/usecase/SyncAccountScrapUsecase';
import { accountStore } from '@background/store/accountStore';
import { inject, injectable } from 'tsyringe';
import { getLoginCookie } from '@background/helpers/cookie';

@injectable()
export class AddAccountService implements AddAccountUsecase {
  constructor(
    @inject('SyncAccountScrapUsecase')
    private syncAccountScrapService: SyncAccountScrapUsecase,
  ) {}

  async execute({ actId, email }: AddAccountInput): Promise<AddAccountOutput> {
    const { ltoken, ltuid } = await getLoginCookie();
    const isAdded = await accountStore.addAccount({
      actId,
      email,
      ltoken,
      ltuid,
      lastCheckInResult: 'warn',
      lastCheckInMessage: '',
      lastCheckInDate: '',
    });

    if (isAdded) {
      this.syncAccountScrapService
        .execute({ actId, token: { ltoken, ltuid } })
        .catch((err) => {
          console.error('[AddAccountService] 초기 스크랩 실행 에러:', err);
        });
    }

    return { success: true };
  }
}
