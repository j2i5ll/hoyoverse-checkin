import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
function NoCharacterCard({ t }: WithTranslation) {
  return (
    <TooltipLayout
      content={
        <div className="description">{t('content.no_character_in_game')}</div>
      }
      footer={<TooltipFooter />}
    />
  );
}
export default withTranslation()(NoCharacterCard);
