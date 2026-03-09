import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { useEffect } from 'react';
import { ga } from '@src/shared/ga';
import { Button } from '@front/external/components/ui/button';
interface AccountAlreadyExistBodyProps extends WithTranslation {
  email: string;
  actId: string;
  hasUnregisteredGames?: boolean;
  onRegisterOtherGames?: () => void;
}
function AccountAlreadyExistCard({
  email,
  t,
  actId,
  hasUnregisteredGames,
  onRegisterOtherGames,
}: AccountAlreadyExistBodyProps) {
  useEffect(() => {
    ga.fireEvent('view_이미등록', { act_id: actId });
  }, []);
  return (
    <TooltipLayout
      content={
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: t('content.already_exist_account', { email }),
            }}
          ></div>
          <div>{t('content.check_automatically_in_browser')}</div>
          {hasUnregisteredGames && (
            <Button
              variant="link"
              className="mt-[8px] h-auto p-0 text-[14px]"
              onClick={onRegisterOtherGames}
            >
              {t('content.register_other_games')}
            </Button>
          )}
        </>
      }
      footer={<TooltipFooter />}
    />
  );
}
export default withTranslation()(AccountAlreadyExistCard);
