import { GameItemType } from '@src/types';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useMemo } from 'react';
import AccountTag from './AccountTag';
import { useAccountList } from '@front/shared/hooks/useAccountList';
import { ExternalLink } from 'lucide-react';
import { Separator } from '@front/external/components/ui/separator';
import GameIcon from '@front/shared/components/GameIcon';

interface GameItemProps extends WithTranslation {
  game: GameItemType;
}
const GameItem = ({ game, t }: GameItemProps) => {
  const { accountList } = useAccountList();

  const filteredAccountList = useMemo(() => {
    return accountList?.filter(({ actId }) => actId === game.actId) ?? [];
  }, [accountList]);

  return (
    <>
      <div className="flex min-h-[77px] items-center p-2">
        <div className="pr-2">
          <a
            href={game.checkInUrl + game.actId}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GameIcon
              className="h-14 w-14"
              src={game.icon}
              alt={t(game.name)}
            />
          </a>
        </div>
        <div>
          <div className="text-lg font-semibold">
            <a
              href={game.checkInUrl + game.actId}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(game.name)}
            </a>
          </div>
          <div className="flex flex-col pt-1 text-sm gap-y-2">
            {filteredAccountList.length === 0 ? (
              <a
                href={game.checkInUrl + game.actId}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('common.account_registration')}
                <ExternalLink className="inline mb-1" size={12} />
              </a>
            ) : (
              filteredAccountList.map((account) => (
                <AccountTag
                  account={account}
                  key={account.ltuid}
                  actId={game.actId}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Separator></Separator>
    </>
  );
};
export default withTranslation()(GameItem);
