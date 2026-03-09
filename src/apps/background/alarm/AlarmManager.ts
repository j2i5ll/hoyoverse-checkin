export const ALARM_NAMES = {
  CHECK_IN: 'checkin-interval',
  SCRAP: 'scrap-interval',
  UPDATE: 'update-check-interval',
} as const;

type AlarmHandler = () => Promise<void> | void;

class AlarmManager {
  private handlers = new Map<string, AlarmHandler>();
  private initialized = false;

  registerHandler(alarmName: string, handler: AlarmHandler): void {
    this.handlers.set(alarmName, handler);
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    if (this.handlers.size === 0) {
      console.warn(
        '[AlarmManager] init()이 등록된 핸들러 없이 호출됨. registerHandler()를 먼저 호출했는지 확인하세요.',
      );
    }

    chrome.alarms.onAlarm.addListener((alarm) => {
      const handler = this.handlers.get(alarm.name);
      if (handler) {
        Promise.resolve(handler()).catch((error) => {
          console.error(
            `[AlarmManager] "${alarm.name}" 핸들러 에러:`,
            error,
          );
        });
      }
    });
  }

  async ensureAlarm(
    name: string,
    options: { periodInMinutes: number; delayInMinutes?: number },
  ): Promise<void> {
    const existing = await chrome.alarms.get(name);
    if (existing) {
      return;
    }
    await chrome.alarms.create(name, options);
  }
}

export const alarmManager = new AlarmManager();
