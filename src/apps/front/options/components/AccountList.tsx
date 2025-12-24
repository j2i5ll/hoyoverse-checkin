import { useAccountList } from '@front/shared/hooks/useAccountList';
import { WithTranslation, withTranslation } from 'react-i18next';
import { SelectedGameActIdContext } from '../provider/selectedGameActId';
import { useContext, useMemo } from 'react';
import { GAME_INFO_LIST } from '@src/shared/constants/game';
import AccountItem from './AccountItem';
import { ExternalLinkIcon } from 'lucide-react';
import { Button } from '@front/external/components/ui/button';

const AccountList = ({ t }: WithTranslation) => {
  const { accountList } = useAccountList();
  const { selectedGameActId } = useContext(SelectedGameActIdContext);

  const filteredAccountList = useMemo(
    () => accountList.filter(({ actId }) => actId === selectedGameActId),
    [selectedGameActId, accountList],
  );

  const gameItem = useMemo(
    () => GAME_INFO_LIST.find(({ actId }) => actId === selectedGameActId),
    [selectedGameActId],
  );

  if (filteredAccountList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-lg text-center">
        <div className="text-lg font-semibold">
          {t('options.no_account_description')}
        </div>
        {gameItem ? (
          <Button variant="link" asChild>
            <a
              href={gameItem.checkInUrl + gameItem.actId}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('common.account_registration')}
              <ExternalLinkIcon />
            </a>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-[700px] flex-1 flex-col gap-y-4">
      {filteredAccountList.map((account) => (
        <AccountItem
          account={account}
          key={account.ltuid}
          actId={gameItem.actId}
        />
      ))}
    </div>
  );
};
export default withTranslation()(AccountList);
