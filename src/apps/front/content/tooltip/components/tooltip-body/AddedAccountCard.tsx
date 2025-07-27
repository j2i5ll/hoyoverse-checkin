import { WithTranslation, withTranslation } from 'react-i18next';
import { ToggleTooltipContext } from '../../provider/toggleTooltip';
import { useContext } from 'react';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
interface AddedAccountBodyProps extends WithTranslation {
  email: string;
}
function AddedAccountCard({ email, t }: AddedAccountBodyProps) {
  const { setIsTooltipShow } = useContext(ToggleTooltipContext);
  setTimeout(() => setIsTooltipShow(false), 5000);
  return (
    <TooltipLayout
      content={
        <>
          <div className="description">
            <div
              dangerouslySetInnerHTML={{
                __html: t('content.email_added', { email }),
              }}
            ></div>
            <div>{t('content.check_automatically_in_browser')}</div>
          </div>
          <div className="absolute bottom-0 left-0 h-[4px] animate-timer bg-foreground"></div>
        </>
      }
    />
  );
}
export default withTranslation()(AddedAccountCard);
