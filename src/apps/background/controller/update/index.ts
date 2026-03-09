import { alarmManager, ALARM_NAMES } from '@background/alarm/AlarmManager';

export class UpdateController {
  start(): void {
    alarmManager.registerHandler(ALARM_NAMES.UPDATE, () => this.checkForUpdate());
    alarmManager.ensureAlarm(ALARM_NAMES.UPDATE, { periodInMinutes: 360 });
  }

  private async checkForUpdate(): Promise<void> {
    try {
      const result = await chrome.runtime.requestUpdateCheck();
      const status = result.status;
      if (status === 'update_available') {
        chrome.runtime.reload();
      }
    } catch (error) {
      console.error('[UpdateController] 업데이트 확인 실패:', error);
    }
  }
}
