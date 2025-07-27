import { AccountInfoType, TokenType } from '@src/types';
import { useEffect, useState } from 'react';
import { CallCheckInApiOutput } from '@src/apps/background/domain/check-in/port/CallCheckInApiPort';
import { accountStore } from '@background/store/accountStore';
import { useSelectedRoleId } from '@front/shared/hooks/useSelectedRoleId';

/**
 * 등록된 계정 정보를 조회/조작하는 hook.
 * @returns
 */
function useAccountList() {
  const [accountList, setAccountList] = useState<AccountInfoType[]>([]);
  const { deleteSelectedRoleId } = useSelectedRoleId();

  /**
   * 등록된 계정을 삭제한다.
   * @param actId
   * @param ltuid
   */
  const deleteAccount = async (actId: string, ltuid: string) => {
    await accountStore.deleteAccount(actId, ltuid);
    await deleteSelectedRoleId(actId);
  };

  /**
   * 계정의 마지막 체크인 상태를 업데이트한다.
   * @param checkInResultList
   */
  const updateLastCheckIn = async (
    checkInResultList: CallCheckInApiOutput[],
  ) => {
    await accountStore.updateLastCheckIn(checkInResultList);
  };

  /**
   * 캐릭터/전적 정보 수집 여부를 업데이트한다.
   * @param actId
   * @param isScrap
   */
  const updateIsScrap = async (
    actId: string,
    token: TokenType,
    isScrap: boolean,
  ) => {
    await accountStore.updateIsScrap(actId, token, isScrap);
  };

  /**
   * 계정 목록을 저장소에 저장한다.
   * @param newAccountList
   */
  const setAccountListToStore = async (newAccountList: AccountInfoType[]) => {
    await accountStore.setAccountList(newAccountList);
  };

  useEffect(() => {
    const initAccountListState = async () => {
      const accountList = await accountStore.getAccountList();
      setAccountList(accountList);
    };
    initAccountListState();

    const accountListChagneHandler = (newAccountList: AccountInfoType[]) => {
      setAccountList(newAccountList);
    };
    accountStore.addChangeListener(accountListChagneHandler);

    return () => accountStore.removeChangeListener(accountListChagneHandler);
  }, []);

  return {
    accountList,
    updateIsScrap,
    setAccountList: setAccountListToStore,
    deleteAccount,
    updateLastCheckIn,
  };
}
export { useAccountList };
