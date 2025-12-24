// import { APP_NAME } from '@src/shared/constants/text';
import { getCurrentActId } from '@src/shared/utils/url';
import { useState } from 'react';
import { useAccountList } from '@front/shared/hooks/useAccountList';
import { WithTranslation, withTranslation } from 'react-i18next';
import AccountAlreadyExistCard from './tooltip-body/AccountAlreadyExistCard';
import NewAccountCard from './tooltip-body/NewAccountCard';
import AddedAccountCard from './tooltip-body/AddedAccountCard';
import NoCharacterCard from './tooltip-body/NoCharacterCard';
import NotSupportedCard from './tooltip-body/NotSupportedCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addAccountMutation } from '@front/shared/queryOptions/mutations';
import {
  accountStatusQuery,
  loginUserEmailQuery,
} from '@front/shared/queryOptions/queryies';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@front/content/tooltip/components/ErrorFallback';

interface AccountStatusProps extends WithTranslation {
  email: string;
  actId: string;
}
const AccountStatusCard = withTranslation()(function ({
  actId,
  email,
  t,
}: AccountStatusProps) {
  const [addResult, setAddResult] = useState<boolean>(false);
  const { updateLastCheckIn, accountList } = useAccountList();

  const { data: accountStatus } = useQuery({
    ...accountStatusQuery({ actId, accountList }),
    throwOnError: true,
  });

  const { mutate } = useMutation({
    ...addAccountMutation(),
    onSuccess: async (checkInResult) => {
      setAddResult(true);
      await updateLastCheckIn(checkInResult);
    },
    throwOnError: true,
  });

  const addAccount = async () => {
    mutate({ actId, email });
  };

  if (addResult) {
    return <AddedAccountCard email={email} />;
  }

  if (accountStatus === 'EXIST') {
    return <AccountAlreadyExistCard email={email} actId={actId} />;
  }
  if (accountStatus === 'NEW') {
    return (
      <NewAccountCard email={email} addAccount={addAccount} actId={actId} />
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
