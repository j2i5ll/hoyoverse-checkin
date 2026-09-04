import { ScrapController } from './index';
import { SyncAccountScrapUsecase } from '@background/domain/scrap/usecase/SyncAccountScrapUsecase';
import { GetScrapTargetUsecase } from '@background/domain/scrap/usecase/GetScrapTargetUsecase';
import { alarmManager, ALARM_NAMES } from '@background/alarm/AlarmManager';

jest.mock('@background/alarm/AlarmManager', () => ({
  alarmManager: {
    registerHandler: jest.fn(),
    ensureAlarm: jest.fn(),
  },
  ALARM_NAMES: {
    SCRAP: 'scrap-interval',
  },
}));

describe('ScrapController', () => {
  const mockSyncAccountScrapService = {
    execute: jest.fn(),
  } as unknown as SyncAccountScrapUsecase;

  const mockGetScrapTargetService = {
    execute: jest.fn(),
  } as unknown as GetScrapTargetUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createController() {
    return new ScrapController(
      mockSyncAccountScrapService,
      mockGetScrapTargetService,
    );
  }

  it('start() 호출 시 알람 핸들러 등록 및 ensureAlarm을 실행한다', async () => {
    const controller = createController();
    await controller.start();

    expect(alarmManager.registerHandler).toHaveBeenCalledWith(
      ALARM_NAMES.SCRAP,
      expect.any(Function),
    );
    expect(alarmManager.ensureAlarm).toHaveBeenCalledWith(ALARM_NAMES.SCRAP, {
      delayInMinutes: 1,
      periodInMinutes: 30,
    });
  });

  it('syncData 실행 시 스크랩 대상 목록을 가져와 각 대상에 대해 syncAccountScrapService를 호출한다', async () => {
    const mockTargets = [
      { actId: 'act1', ltoken: 'token1', ltuid: 'uid1' },
      { actId: 'act2', ltoken: 'token2', ltuid: 'uid2' },
    ];
    (mockGetScrapTargetService.execute as jest.Mock).mockResolvedValue(
      mockTargets,
    );
    (mockSyncAccountScrapService.execute as jest.Mock).mockResolvedValue({
      success: true,
    });

    const controller = createController();
    await controller.start();

    // 등록된 알람 핸들러 실행
    const handler = (alarmManager.registerHandler as jest.Mock).mock
      .calls[0][1];
    await handler();

    expect(mockGetScrapTargetService.execute).toHaveBeenCalledTimes(1);
    expect(mockSyncAccountScrapService.execute).toHaveBeenCalledTimes(2);
    expect(mockSyncAccountScrapService.execute).toHaveBeenNthCalledWith(1, {
      actId: 'act1',
      token: { ltoken: 'token1', ltuid: 'uid1' },
    });
    expect(mockSyncAccountScrapService.execute).toHaveBeenNthCalledWith(2, {
      actId: 'act2',
      token: { ltoken: 'token2', ltuid: 'uid2' },
    });
  });
});
