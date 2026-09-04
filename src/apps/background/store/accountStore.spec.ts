import { accountStore } from './accountStore';
import { AccountInfoType } from '@src/types';

const mockStorage: Record<string, unknown> = {};

global.chrome = {
  storage: {
    local: {
      get: jest.fn((keys: string[]) => {
        const result: Record<string, unknown> = {};
        keys.forEach((key) => {
          result[key] = mockStorage[key];
        });
        return Promise.resolve(result);
      }),
      set: jest.fn((items: Record<string, unknown>) => {
        Object.assign(mockStorage, items);
        return Promise.resolve();
      }),
    },
    onChanged: {
      addListener: jest.fn(),
    },
  },
} as unknown as typeof chrome;

describe('accountStore.addAccount', () => {
  const sampleAccount: AccountInfoType = {
    actId: 'act_genshin',
    email: 'test@example.com',
    ltoken: 'token123',
    ltuid: 'uid123',
    lastCheckInResult: 'warn',
    lastCheckInMessage: '',
    lastCheckInDate: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  });

  it('신규 계정 추가 시 true를 반환하고 스토리지에 저장한다', async () => {
    const isAdded = await accountStore.addAccount(sampleAccount);

    expect(isAdded).toBe(true);
    const list = await accountStore.getAccountList();
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(sampleAccount);
  });

  it('동일한 actId와 ltoken을 가진 계정이 이미 존재하면 false를 반환하고 저장하지 않는다', async () => {
    await accountStore.addAccount(sampleAccount);
    const initialList = await accountStore.getAccountList();

    const isAddedAgain = await accountStore.addAccount({
      ...sampleAccount,
      email: 'another@example.com',
    });

    expect(isAddedAgain).toBe(false);
    const afterList = await accountStore.getAccountList();
    expect(afterList).toHaveLength(1);
    expect(afterList).toEqual(initialList);
  });

  it('actId가 다르면 동일한 ltoken이어도 신규 계정으로 간주하여 true를 반환한다', async () => {
    await accountStore.addAccount(sampleAccount);

    const isHsrAdded = await accountStore.addAccount({
      ...sampleAccount,
      actId: 'act_hsr',
    });

    expect(isHsrAdded).toBe(true);
    const list = await accountStore.getAccountList();
    expect(list).toHaveLength(2);
  });
});
