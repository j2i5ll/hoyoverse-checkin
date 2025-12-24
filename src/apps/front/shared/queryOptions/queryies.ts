import {
  GetAccountStatusInput,
  GetAccountStatusOutput,
} from '@background/domain/account/port/GetAccountStatusPort';
import { GetCookieOutput } from '@background/domain/cookie/port/GetCookiePort';
import {
  AccountPublicDataError,
  AccountStatusError,
  UnknownError,
} from '@front/shared/error';
import { requestMessage } from '@front/shared/utils/browser';
import getAccountInfo from '@src/shared/api/getAccountInfo';
import getCharacter, { GetCharacterProps } from '@src/shared/api/getCharacter';
import getCurrentEnergy from '@src/shared/api/getCurrentEnergy';
import getCurrentResin from '@src/shared/api/getCurrentResin';
import getCurrentStamina from '@src/shared/api/getCurrentStamina';
import getGameRecordCard from '@src/shared/api/getGameRecordCard';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { GameId, GameKey } from '@src/shared/constants/game';
import { httpBE } from '@src/shared/utils/http';
import {
  EnergyInfo,
  AccountInfoType,
  TokenType,
  MessageType,
  ResinInfo,
  ResourceInfo,
  StaminaInfo,
} from '@src/types';
import {
  QueryClient,
  queryOptions,
  infiniteQueryOptions,
} from '@tanstack/react-query';

// 계정 상태 조회
export const accountStatusQuery = ({
  actId,
  accountList,
}: {
  actId: string;
  accountList: AccountInfoType[];
}) => {
  const accountListKey = accountList.map(
    (account) => `${account.ltuid}_${account.ltoken}_${account.actId}`,
  );
  return queryOptions({
    queryFn: async () => {
      try {
        const res = await requestMessage<
          GetAccountStatusInput,
          GetAccountStatusOutput
        >({
          data: {
            type: MessageType.GetAccountStatus,
            data: { actId },
          },
        });
        return res;
      } catch {
        throw new AccountStatusError();
      }
    },
    queryKey: ['getAccountStatus', actId, ...accountListKey],
  });
};

// 로그인 상태 조회
export const loginStatusQuery = (queryClient: QueryClient) => {
  let beforeHasLoginToken = false;
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      const lastLoginStatus = queryClient.getQueryData(queryKey);

      const { ltoken, ltuid } = await requestMessage<void, GetCookieOutput>({
        data: {
          type: MessageType.GetCookie,
        },
      });

      const hasLoginToken = !!ltoken && !!ltuid;

      if (
        lastLoginStatus === 'unknown' ||
        beforeHasLoginToken !== hasLoginToken
      ) {
        beforeHasLoginToken = hasLoginToken;
        return hasLoginToken ? 'login' : 'logout';
      }
      return lastLoginStatus;
    },
    initialData: 'unknown',
    staleTime: 0,
    queryKey: ['getLoginStatus'],
    refetchInterval: 500,
    refetchIntervalInBackground: true,
  });
};

// 사용자 로그인 이메일 조회
export const loginUserEmailQuery = () => {
  return queryOptions({
    queryFn: async () => {
      const rawTokenList = await requestMessage<void, GetCookieOutput>({
        data: {
          type: MessageType.GetCookie,
        },
      });
      const { ltuid } = rawTokenList;
      const res = await getAccountInfo({ ltuid });
      const { email } = res.data;
      return email;
    },
    queryKey: ['loginUserEmail'],
  });
};

// 계정 내 캐릭터 목록 조회
export const characterListQuery = ({ gameBiz, token }: GetCharacterProps) => {
  return queryOptions({
    queryFn: async () => {
      return await getCharacter({ token, gameBiz });
    },
    queryKey: ['characterList', token.ltoken, token.ltuid],
  });
};

// 자원 정보 조회
type CurrentResourceQueryProps = {
  targetList: {
    token: TokenType;
    gameId: number;
  }[];
};
export const currentResourceQuery = ({
  targetList,
}: CurrentResourceQueryProps) => {
  const getResource = async ({
    gameId,
    token,
    region,
    gameRoleId,
  }: {
    gameId: number;
    token: TokenType;
    region: string;
    gameRoleId: string;
  }) => {
    const throwIfError = (retcode: ApiRetCode) => {
      if (retcode !== ApiRetCode.Success) {
        if (retcode === ApiRetCode.DataIsNotPublic) {
          throw new AccountPublicDataError();
        }
        throw new UnknownError();
      }
    };
    if (gameId === GameId[GameKey.Genshin]) {
      const resourceResopnse = await getCurrentResin({
        token,
        region,
        gameRoleId,
      });
      const { data, retcode } = resourceResopnse;
      throwIfError(retcode);
      return new ResinInfo(data);
    } else if (gameId === GameId[GameKey.Starrail]) {
      const resourceResopnse = await getCurrentStamina({
        token,
        region,
        gameRoleId,
      });
      const { data, retcode } = resourceResopnse;
      throwIfError(retcode);
      return new StaminaInfo(data);
    } else if (gameId === GameId[GameKey.ZZZ]) {
      const resourceResopnse = await getCurrentEnergy({
        token,
        region,
        gameRoleId,
      });
      const { data, retcode } = resourceResopnse;
      throwIfError(retcode);
      return new EnergyInfo(data);
    } else {
      return new ResourceInfo();
    }
  };
  return queryOptions({
    queryFn: async () => {
      const resourceList = [];
      for (const target of targetList) {
        const { token, gameId } = target;
        const gameRecordCard = await getGameRecordCard({ token, gameId });
        const { gameRoleId, region } = gameRecordCard;
        const resource = await getResource({
          gameId,
          region,
          gameRoleId,
          token,
        });
        resourceList.push(resource);
      }
      return resourceList;
    },
    queryKey: ['currentResource', ...targetList],
    refetchOnWindowFocus: false,
    throwOnError: true,
  });
};

export const notificationListQuery = (size = 10) => {
  return infiniteQueryOptions({
    queryFn: async ({ pageParam }) => {
      const res = await httpBE(
        `/functions/v1/notifications?page=${pageParam}&size=${size}`,
        {
          method: 'GET',
        },
      );
      return res.data;
    },
    queryKey: ['notifications', size],
    select: (data) => {
      return data.pages.map((page) => page.notifications).flat();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.notifications.length < size) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });
};
