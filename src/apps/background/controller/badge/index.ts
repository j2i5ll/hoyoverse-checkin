import type { GetCheckInResultSummaryUsecase } from '@background/domain/badge/usecase/GetCheckInResultSummaryUsecase';
import { injectable, inject } from 'tsyringe';

@injectable()
export class BadgeController {
  constructor(
    @inject('GetCheckInResultSummaryUsecase')
    private getCheckInResultSummaryService: GetCheckInResultSummaryUsecase,
  ) {}
  listenStorageChange() {
    chrome.storage.onChanged.addListener(async (storageData) => {
      if (storageData.accountList) {
        this.updateBadge();
      }
    });
  }
  private async updateBadge() {
    const checkInResultSummary =
      await this.getCheckInResultSummaryService.execute();
    switch (checkInResultSummary) {
      case 'success':
        chrome.action.setBadgeBackgroundColor({ color: '#4CA85D' });
        chrome.action.setBadgeText({ text: '✔' });
        break;
      case 'fail':
        chrome.action.setBadgeBackgroundColor({ color: '#EB503B' });
        chrome.action.setBadgeText({ text: '！' });
        break;
      case 'warn':
        chrome.action.setBadgeBackgroundColor({ color: '#F2A73B' });
        chrome.action.setBadgeText({ text: '！' });
        break;
      default:
        break;
    }
  }
}
