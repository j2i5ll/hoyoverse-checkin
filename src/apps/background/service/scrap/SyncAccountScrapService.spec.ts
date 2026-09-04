import { SyncAccountScrapService } from './SyncAccountScrapService';
import { GameActId, GameKey } from '@src/shared/constants/game';
import { ScrapGameDataUsecase } from '@background/domain/scrap/usecase/ScrapGameDataUsecase';

describe('SyncAccountScrapService', () => {
  const mockZzzService = {
    execute: jest.fn(),
  } as unknown as ScrapGameDataUsecase;
  const mockHsrService = {
    execute: jest.fn(),
  } as unknown as ScrapGameDataUsecase;
  const mockGenshinService = {
    execute: jest.fn(),
  } as unknown as ScrapGameDataUsecase;

  const sampleToken = { ltoken: 'token123', ltuid: 'uid123' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createService() {
    return new SyncAccountScrapService(
      mockZzzService,
      mockHsrService,
      mockGenshinService,
    );
  }

  it('원신 actId 전달 시 genshinScrapGameDataService를 호출한다', async () => {
    (mockGenshinService.execute as jest.Mock).mockResolvedValue({
      result: true,
    });
    const service = createService();

    const output = await service.execute({
      actId: GameActId[GameKey.Genshin],
      token: sampleToken,
    });

    expect(output).toEqual({ success: true });
    expect(mockGenshinService.execute).toHaveBeenCalledWith({
      token: sampleToken,
    });
    expect(mockHsrService.execute).not.toHaveBeenCalled();
    expect(mockZzzService.execute).not.toHaveBeenCalled();
  });

  it('스타레일 actId 전달 시 hsrScrapGameDataService를 호출한다', async () => {
    (mockHsrService.execute as jest.Mock).mockResolvedValue({ result: true });
    const service = createService();

    const output = await service.execute({
      actId: GameActId[GameKey.Starrail],
      token: sampleToken,
    });

    expect(output).toEqual({ success: true });
    expect(mockHsrService.execute).toHaveBeenCalledWith({ token: sampleToken });
    expect(mockGenshinService.execute).not.toHaveBeenCalled();
    expect(mockZzzService.execute).not.toHaveBeenCalled();
  });

  it('ZZZ actId 전달 시 zzzScrapGameDataService를 호출한다', async () => {
    (mockZzzService.execute as jest.Mock).mockResolvedValue({ result: true });
    const service = createService();

    const output = await service.execute({
      actId: GameActId[GameKey.ZZZ],
      token: sampleToken,
    });

    expect(output).toEqual({ success: true });
    expect(mockZzzService.execute).toHaveBeenCalledWith({ token: sampleToken });
    expect(mockGenshinService.execute).not.toHaveBeenCalled();
    expect(mockHsrService.execute).not.toHaveBeenCalled();
  });

  it('미지원 게임(붕괴3rd 등) 전달 시 스크랩 서비스를 호출하지 않고 성공 반환한다', async () => {
    const service = createService();

    const output = await service.execute({
      actId: GameActId[GameKey.Honkai],
      token: sampleToken,
    });

    expect(output).toEqual({ success: true });
    expect(mockGenshinService.execute).not.toHaveBeenCalled();
    expect(mockHsrService.execute).not.toHaveBeenCalled();
    expect(mockZzzService.execute).not.toHaveBeenCalled();
  });

  it('여러 계정이 동시에 요청되어도 순차적으로 실행된다', async () => {
    const executionOrder: string[] = [];

    (mockGenshinService.execute as jest.Mock).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      executionOrder.push('Genshin');
      return { result: true };
    });

    (mockHsrService.execute as jest.Mock).mockImplementation(async () => {
      executionOrder.push('HSR');
      return { result: true };
    });

    const service = createService();

    // 두 요청을 동시에 시작
    const p1 = service.execute({
      actId: GameActId[GameKey.Genshin],
      token: sampleToken,
    });
    const p2 = service.execute({
      actId: GameActId[GameKey.Starrail],
      token: sampleToken,
    });

    await Promise.all([p1, p2]);

    expect(executionOrder).toEqual(['Genshin', 'HSR']);
  });

  it('스크랩 실행 중 에러가 발생해도 큐가 중단되지 않고 다음 작업이 정상 실행된다', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (mockGenshinService.execute as jest.Mock).mockRejectedValue(
      new Error('Network error'),
    );
    (mockHsrService.execute as jest.Mock).mockResolvedValue({ result: true });

    const service = createService();

    const p1 = service.execute({
      actId: GameActId[GameKey.Genshin],
      token: sampleToken,
    });
    const p2 = service.execute({
      actId: GameActId[GameKey.Starrail],
      token: sampleToken,
    });

    const results = await Promise.all([p1, p2]);

    expect(results).toEqual([{ success: true }, { success: true }]);
    expect(mockGenshinService.execute).toHaveBeenCalledTimes(1);
    expect(mockHsrService.execute).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
