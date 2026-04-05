import { CheckInController } from './index';

const mockExecuteCheckIn = jest.fn();
const mockExecuteGetList = jest.fn();
const mockUpdateLastCheckIn = jest.fn();

jest.mock('@background/store/accountStore', () => ({
  accountStore: { updateLastCheckIn: (...args: unknown[]) => mockUpdateLastCheckIn(...args) },
}));

jest.mock('@background/alarm/AlarmManager', () => ({
  alarmManager: {
    registerHandler: jest.fn(),
    ensureAlarm: jest.fn(),
  },
  ALARM_NAMES: { CHECK_IN: 'checkin-interval' },
}));

function createController() {
  return new (CheckInController as any)(
    { execute: mockExecuteCheckIn },
    { execute: mockExecuteGetList },
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CheckInController.checkInAll', () => {
  it('출첵 대상이 있으면 API를 호출하고 결과를 저장한다', async () => {
    const targets = [{ actId: 'act1', ltuid: 'uid1', ltoken: 'tok1', checkInAPIUrl: 'url1' }];
    const results = [{ actId: 'act1', ltuid: 'uid1', retCode: 0, lastCheckInMessage: undefined }];
    mockExecuteGetList.mockResolvedValue(targets);
    mockExecuteCheckIn.mockResolvedValue(results);

    const controller = createController();
    await controller.checkInAll();

    expect(mockExecuteGetList).toHaveBeenCalledTimes(1);
    expect(mockExecuteCheckIn).toHaveBeenCalledWith(targets);
    expect(mockUpdateLastCheckIn).toHaveBeenCalledWith(results);
  });

  it('출첵 대상이 없으면 API를 호출하지 않는다', async () => {
    mockExecuteGetList.mockResolvedValue([]);

    const controller = createController();
    await controller.checkInAll();

    expect(mockExecuteCheckIn).not.toHaveBeenCalled();
  });

  it('이미 실행 중이면 중복 호출을 스킵한다', async () => {
    let resolveFirst: () => void;
    const firstCallPromise = new Promise<void>((resolve) => { resolveFirst = resolve; });

    mockExecuteGetList.mockImplementation(() => firstCallPromise.then(() => [{ actId: 'act1', ltuid: 'uid1', ltoken: 'tok1', checkInAPIUrl: 'url1' }]));
    mockExecuteCheckIn.mockResolvedValue([]);

    const controller = createController();

    const call1 = controller.checkInAll();
    const call2 = controller.checkInAll(); // 중복 호출

    resolveFirst!();
    await Promise.all([call1, call2]);

    expect(mockExecuteGetList).toHaveBeenCalledTimes(1);
  });

  it('실행 중 에러가 발생해도 다음 호출이 가능하다', async () => {
    mockExecuteGetList.mockRejectedValueOnce(new Error('network error'));
    mockExecuteGetList.mockResolvedValueOnce([]);

    const controller = createController();

    await controller.checkInAll().catch(() => {});
    await controller.checkInAll();

    expect(mockExecuteGetList).toHaveBeenCalledTimes(2);
  });
});
