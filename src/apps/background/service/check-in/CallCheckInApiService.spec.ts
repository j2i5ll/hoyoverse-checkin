import { CallCheckInApiService } from './CallCheckInApiService';

jest.mock('@src/shared/utils/http', () => ({
  httpWithCookie: jest.fn(),
}));
jest.mock('@src/shared/utils/url', () => ({
  getUrlLocale: () => 'ko-kr',
}));
jest.mock('@background/i18n', () => ({
  i18n: { t: (key: string) => key },
}));
jest.mock('@src/shared/utils/sentry', () => ({
  captureApiException: jest.fn(),
}));
jest.mock('@src/shared/ga', () => ({
  ga: { fireEvent: jest.fn() },
}));

import { httpWithCookie } from '@src/shared/utils/http';

const mockHttpWithCookie = httpWithCookie as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('CallCheckInApiService 호출 간 딜레이', () => {
  it('2개 이상의 대상이 있을 때 첫 번째 호출 후 딜레이가 발생한다', async () => {
    mockHttpWithCookie.mockResolvedValue({ retcode: 0, message: 'ok', data: { gt_result: {} } });

    const service = new CallCheckInApiService();
    const targets = [
      { actId: 'act1', checkInAPIUrl: 'https://api/sign', ltoken: 'tok1', ltuid: 'uid1' },
      { actId: 'act2', checkInAPIUrl: 'https://api/sign', ltoken: 'tok2', ltuid: 'uid2' },
    ];

    const executePromise = service.execute(targets);

    // 첫 번째 호출은 즉시 실행됨
    await jest.advanceTimersByTimeAsync(0);
    expect(mockHttpWithCookie).toHaveBeenCalledTimes(1);

    // 딜레이 경과 후 두 번째 호출
    await jest.advanceTimersByTimeAsync(2000);
    expect(mockHttpWithCookie).toHaveBeenCalledTimes(2);

    await executePromise;
  });

  it('대상이 1개일 때 딜레이 없이 즉시 실행된다', async () => {
    mockHttpWithCookie.mockResolvedValue({ retcode: 0, message: 'ok', data: { gt_result: {} } });

    const service = new CallCheckInApiService();
    const targets = [
      { actId: 'act1', checkInAPIUrl: 'https://api/sign', ltoken: 'tok1', ltuid: 'uid1' },
    ];

    await service.execute(targets);

    expect(mockHttpWithCookie).toHaveBeenCalledTimes(1);
  });
});
