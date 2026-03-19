import { WithTranslation, withTranslation } from 'react-i18next';
import { ToggleTooltipContext } from '../../provider/toggleTooltip';
import { useContext } from 'react';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
interface AddedAccountBodyProps extends WithTranslation {
  count?: number;
}
function AddedAccountCard({ t, count = 1 }: AddedAccountBodyProps) {
  const { setIsTooltipShow } = useContext(ToggleTooltipContext);
  setTimeout(() => setIsTooltipShow(false), 5000);

  const message = t('content.accounts_added', { count });

  return (
    <TooltipLayout
      content={
        <>
          <div className="description">
            <div dangerouslySetInnerHTML={{ __html: message }}></div>
            <div>{t('content.check_automatically_in_browser')}</div>
          </div>
          <div className="absolute bottom-0 left-0 h-[4px] animate-timer bg-foreground"></div>
        </>
      }
    />
  );
}
export default withTranslation()(AddedAccountCard);
