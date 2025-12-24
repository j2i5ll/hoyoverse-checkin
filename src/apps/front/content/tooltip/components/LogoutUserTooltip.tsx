import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from './tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';

function LogoutUserTooltip({ t }: WithTranslation) {
  return (
    <TooltipLayout
      content={<div>{t('content.need_login')}</div>}
      footer={<TooltipFooter />}
    />
  );
}
export default withTranslation()(LogoutUserTooltip);
