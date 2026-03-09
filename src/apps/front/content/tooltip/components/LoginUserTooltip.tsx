import { getCurrentActId } from '@src/shared/utils/url';
import { useMemo, useState } from 'react';
import { useAccountList } from '@front/shared/hooks/useAccountList';
import { WithTranslation, withTranslation } from 'react-i18next';
import AddedAccountCard from './tooltip-body/AddedAccountCard';
import NoCharacterCard from './tooltip-body/NoCharacterCard';
import NotSupportedCard from './tooltip-body/NotSupportedCard';
import SelectGameAccountCard from './tooltip-body/SelectGameAccountCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addMultipleAccountsMutation } from '@front/shared/queryOptions/mutations';
import {
  accountStatusQuery,
  gameRolesQuery,
  loginUserEmailQuery,
} from '@front/shared/queryOptions/queryies';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@front/content/tooltip/components/ErrorFallback';
import { GetCookieOutput } from '@background/domain/cookie/port/GetCookiePort';
import { requestMessage } from '@front/shared/utils/browser';
import { MessageType } from '@src/types';
import { gameIdToActId } from '@src/shared/utils/gameMapping';

interface AccountStatusProps extends WithTranslation {
  email: string;
  actId: string;
}
const AccountStatusCard = withTranslation()(function ({
  actId,
  email,
  t,
}: AccountStatusProps) {
  const [addResult, setAddResult] = useState<number | false>(false);
  const { updateLastCheckIn, accountList } = useAccountList();

  const { data: accountStatus } = useQuery({
    ...accountStatusQuery({ actId, accountList }),
    throwOnError: true,
  });

  const { data: token } = useQuery({
    queryFn: () =>
      requestMessage<void, GetCookieOutput>({
        data: { type: MessageType.GetCookie },
      }),
    queryKey: ['currentToken'],
  });

  const currentLtuid = token?.ltuid ?? '';

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    ...gameRolesQuery(),
    enabled: accountStatus === 'NEW' || accountStatus === 'EXIST',
  });

  const registeredKeys = useMemo(() => {
    return new Set(
      accountList.map((account) => `${account.actId}_${account.ltuid}`),
    );
  }, [accountList]);

  // 복수 계정 일괄 등록
  const { mutate: multiMutate, isPending: isMultiPending } = useMutation({
    ...addMultipleAccountsMutation(),
    onSuccess: async (results) => {
      const successResults = results.filter((r) => r.success);
      for (const result of successResults) {
        if (result.checkInResult) {
          await updateLastCheckIn(result.checkInResult);
        }
      }
      setAddResult(successResults.length);
      location.reload();
    },
    throwOnError: true,
  });

  const handleMultiRegister = (selectedActIds: string[]) => {
    multiMutate({ email, actIds: selectedActIds });
  };

  if (addResult !== false) {
    return <AddedAccountCard email={email} count={addResult} />;
  }

  if (accountStatus === 'EXIST' || accountStatus === 'NEW') {
    if (isRolesLoading || !roles) {
      return (
        <div className="description">
          {t('content.checking_account_status')}
        </div>
      );
    }
    const supportedRoles = roles.filter(
      (role) => !!gameIdToActId(role.gameId),
    );
    return (
      <SelectGameAccountCard
        email={email}
        roles={supportedRoles}
        registeredKeys={registeredKeys}
        ltuid={currentLtuid}
        onRegister={handleMultiRegister}
        isLoading={isMultiPending}
      />
    );
  }

  if (accountStatus === 'NO_CHARACTER_IN_GAME') {
    return <NoCharacterCard />;
  }
  if (accountStatus === 'NOT_SUPPORTED_GAME') {
    return <NotSupportedCard />;
  }

  return (
    <div className="description">{t('content.checking_account_status')}</div>
  );
});

function LoginUserTooltip() {
  const actId = getCurrentActId();
  const { data: email } = useQuery({
    ...loginUserEmailQuery(),
  });
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AccountStatusCard actId={actId} email={email} />
    </ErrorBoundary>
  );
}
export default LoginUserTooltip;
