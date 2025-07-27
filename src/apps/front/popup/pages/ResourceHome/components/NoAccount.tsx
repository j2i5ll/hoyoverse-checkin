import { Button } from '@front/external/components/ui/button';
import { GameItemType } from '@src/types';
import { ExternalLinkIcon } from 'lucide-react';
import { WithTranslation, withTranslation } from 'react-i18next';
interface NoAccountProps extends WithTranslation {
  game: GameItemType;
}
function NoAccount({ game, t }: NoAccountProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
      <div className="text-lg font-semibold">
        {t('options.no_account_description')}
      </div>
      <Button asChild variant="link">
        <a
          href={game.checkInUrl + game.actId}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('common.account_registration')}
          <ExternalLinkIcon />
        </a>
      </Button>
    </div>
  );
}
export default withTranslation()(NoAccount);
