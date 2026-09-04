import { AddAccountService } from './AddAccountService';
import { SyncAccountScrapUsecase } from '@background/domain/scrap/usecase/SyncAccountScrapUsecase';
import { accountStore } from '@background/store/accountStore';
import { getLoginCookie } from '@background/helpers/cookie';

jest.mock('@background/store/accountStore', () => ({
  accountStore: {
    addAccount: jest.fn(),
  },
}));

jest.mock('@background/helpers/cookie', () => ({
  getLoginCookie: jest.fn(),
}));

describe('AddAccountService', () => {
  const mockSyncAccountScrapService = {
    execute: jest.fn(),
  } as unknown as SyncAccountScrapUsecase;

  const mockAddAccount = accountStore.addAccount as jest.Mock;
  const mockGetLoginCookie = getLoginCookie as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLoginCookie.mockResolvedValue({
      ltoken: 'cookie_token',
      ltuid: 'cookie_uid',
    });
  });

  function createService() {
    return new AddAccountService(mockSyncAccountScrapService);
  }

  it('신규 계정 등록 시(isAdded: true), 스토리지에 저장하고 1회 스크랩을 비동기로 호출한다', async () => {
    mockAddAccount.mockResolvedValue(true);
    (mockSyncAccountScrapService.execute as jest.Mock).mockResolvedValue({
      success: true,
    });

    const service = createService();
    const result = await service.execute({
      actId: 'act_genshin',
      email: 'user@example.com',
    });

    expect(result).toEqual({ success: true });
    expect(mockAddAccount).toHaveBeenCalledWith({
      actId: 'act_genshin',
      email: 'user@example.com',
      ltoken: 'cookie_token',
      ltuid: 'cookie_uid',
      lastCheckInResult: 'warn',
      lastCheckInMessage: '',
      lastCheckInDate: '',
    });
    expect(mockSyncAccountScrapService.execute).toHaveBeenCalledWith({
      actId: 'act_genshin',
      token: { ltoken: 'cookie_token', ltuid: 'cookie_uid' },
    });
  });

  it('이미 등록된 계정일 시(isAdded: false), 스크랩을 호출하지 않는다', async () => {
    mockAddAccount.mockResolvedValue(false);

    const service = createService();
    const result = await service.execute({
      actId: 'act_genshin',
      email: 'user@example.com',
    });

    expect(result).toEqual({ success: true });
    expect(mockAddAccount).toHaveBeenCalledTimes(1);
    expect(mockSyncAccountScrapService.execute).not.toHaveBeenCalled();
  });

  it('스크랩 실행에서 에러가 발생해도 계정 등록 결과는 성공을 반환한다', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockAddAccount.mockResolvedValue(true);
    (mockSyncAccountScrapService.execute as jest.Mock).mockRejectedValue(
      new Error('Scrap failed'),
    );

    const service = createService();
    const result = await service.execute({
      actId: 'act_genshin',
      email: 'user@example.com',
    });

    expect(result).toEqual({ success: true });
    expect(mockSyncAccountScrapService.execute).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
