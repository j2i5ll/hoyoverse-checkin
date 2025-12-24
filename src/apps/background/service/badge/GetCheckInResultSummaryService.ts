import type { GetCheckInResultSummaryUsecase } from '@background/domain/badge/usecase/GetCheckInResultSummaryUsecase';
import type { GetCheckInResultSummaryOutput } from '@background/domain/badge/port/GetCheckInResultSummaryPort';
import { accountStore } from '@background/store/accountStore';
import { injectable } from 'tsyringe';

@injectable()
export class GetCheckInResultSummaryService
  implements GetCheckInResultSummaryUsecase
{
  async execute(): Promise<GetCheckInResultSummaryOutput> {
    const accountList = await accountStore.getAccountList();
    const checkInResultList = accountList.map(
      (account) => account.lastCheckInResult,
    );

    if (checkInResultList.every((result) => result === 'success')) {
      return 'success';
    }
    if (checkInResultList.some((result) => result === 'fail')) {
      return 'fail';
    }
    return 'warn';
  }
}
