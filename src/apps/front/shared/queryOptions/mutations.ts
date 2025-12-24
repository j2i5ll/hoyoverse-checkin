import {
  AddAccountInput,
  AddAccountOutput,
} from '@background/domain/account/port/AddAccountPort';
import {
  CallCheckInApiInput,
  CallCheckInApiOutput,
} from '@background/domain/check-in/port/CallCheckInApiPort';
import { GetCookieOutput } from '@background/domain/cookie/port/GetCookiePort';
import { AddAccountError, UnKnownGameError } from '@front/shared/error';
import { requestMessage } from '@front/shared/utils/browser';
import { GAME_INFO_LIST } from '@src/shared/constants/game';
import { AccountInfoType, MessageType } from '@src/types';

export const addAccountMutation = () => ({
  mutationFn: async ({ email, actId }: { email: string; actId: string }) => {
    const game = GAME_INFO_LIST.find((game) => game.actId === actId);
    if (!game) {
      throw new UnKnownGameError();
    }
    const { checkInAPIUrl } = game;
    const { ltoken, ltuid } = await requestMessage<void, GetCookieOutput>({
      data: { type: MessageType.GetCookie }
    })

    const checkInResult = await requestMessage<CallCheckInApiInput, CallCheckInApiOutput[]>({
      data: {
        type: MessageType.CheckIn,
        data: [{ actId, checkInAPIUrl, ltoken, ltuid }],
      }
    })

    const { success } = await requestMessage<AddAccountInput,AddAccountOutput>({
      data: {
        type: MessageType.AddAccount,
        data: { email, actId },
      }
    })
    if (!success) {
      throw new AddAccountError();
    }
    return checkInResult;
  },
  mutationKey: ['addAccountMutation'],
});

// 체크인 수행
export const checkInMutation = () => {
  return {
    mutationFn: async (account: AccountInfoType) => {
      const targetGame = GAME_INFO_LIST.find(
        (game) => game.actId === account.actId,
      );
      if (!targetGame) {
        throw new UnKnownGameError();
      }
      // 너무 빈번한 리프레시를 막기위해 500ms 딜레이를 줌
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 500);
      });
      const checkInResult = await requestMessage<CallCheckInApiInput, CallCheckInApiOutput[]>({
        data: {
          type: MessageType.CheckIn,
          data: [
            {
              actId: account.actId,
              checkInAPIUrl: targetGame.checkInAPIUrl,
              ltoken: account.ltoken,
              ltuid: account.ltuid,
            },
          ],
        }

      })
      return checkInResult;
    },
    mutationKey: ['checkInMutation'],
  };
};
