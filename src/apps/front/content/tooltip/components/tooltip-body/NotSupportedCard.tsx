import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
function NotSupportedCard({ t }: WithTranslation) {
  return (
    <TooltipLayout
      content={
        <div className="description">{t('content.not_supported_game')}</div>
      }
      footer={<TooltipFooter />}
    />
  );
}
export default withTranslation()(NotSupportedCard);
