import type { GetScrapTargetOutput } from '@background/domain/scrap/port/GetScrapTargetPort';
import { injectable } from 'tsyringe';
import { GetScrapTargetUsecase } from '@background/domain/scrap/usecase/GetScrapTargetUsecase';
import { accountStore } from '@background/store/accountStore';
import { diffHours } from '@src/shared/utils/date';

@injectable()
export class GetScrapTargetService implements GetScrapTargetUsecase {
  private readonly SCRAP_INTERVAL_HOUR = 12;
  async execute(): Promise<GetScrapTargetOutput> {
    const accountList = await accountStore.getAccountList();

    return accountList.filter((account) => {
      const { scrap } = account;
      if (!scrap) {
        return true;
      }
      if (scrap.isScrap === false) {
        // undefined일경우 스크랩함.
        return false;
      }

      const lastScrapDate = new Date(scrap.lastScrapDate);
      const now = new Date();
      const diffHour = diffHours(lastScrapDate, now);
      if (diffHour < this.SCRAP_INTERVAL_HOUR) {
        return false;
      }

      return true;
    });
  }
}
