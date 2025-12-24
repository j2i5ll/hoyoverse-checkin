import type { GetCheckInListUsecase } from '@background/domain/check-in/usecase/GetCheckInListUsecase';
import type { GetCheckInListOutput } from '@background/domain/check-in/port/GetCheckInListPort';
import { injectable } from 'tsyringe';
import { accountStore } from '@background/store/accountStore';
import { GAME_INFO_LIST } from '@src/shared/constants/game';

@injectable()
export class GetCheckInListService implements GetCheckInListUsecase {
  async execute(): Promise<GetCheckInListOutput[]> {
    const accountList = await accountStore.getAccountList();
    return accountList
      .filter((account) => {
        /**
         *
         * if "현재 시간에서 뒤로 가장 가까운 체크인 갱신 시간" > lastCheckInDate
         *   call API
         * else
         *   run next timeout
         *
         */
        if (
          account.lastCheckInDate &&
          account.lastCheckInDate < this.getLastCheckInAvailDate()
        ) {
          return true;
        }
        return false;
      })
      .map(({ ltuid, ltoken, actId }) => {
        const targetGame = GAME_INFO_LIST.find((game) => game.actId === actId);
        const { checkInAPIUrl } = targetGame;
        return { actId, ltuid, ltoken, checkInAPIUrl };
      })
      .filter((checkInTarget) => !!checkInTarget);
  }

  private getLastCheckInAvailDate(date = new Date()) {
    const now = date.toISOString();
    const checkInAvailTime = new Date(now);
    checkInAvailTime.setUTCHours(16, 0, 0, 0);

    if (now < checkInAvailTime.toISOString()) {
      const latestCheckInAvailTime = new Date(checkInAvailTime);
      latestCheckInAvailTime.setTime(
        latestCheckInAvailTime.getTime() - 24 * 60 * 60 * 1000,
      ); // 24시간 빼기
      return latestCheckInAvailTime.toISOString();
    } else {
      return checkInAvailTime.toISOString();
    }
  }
}
