import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { useEffect } from 'react';
import { ga } from '@src/shared/ga';
interface AccountAlreadyExistBodyProps extends WithTranslation {
  email: string;
  actId: string;
}
function AccountAlreadyExistCard({
  email,
  t,
  actId,
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
        </>
      }
      footer={<TooltipFooter />}
    />
  );
}
export default withTranslation()(AccountAlreadyExistCard);
