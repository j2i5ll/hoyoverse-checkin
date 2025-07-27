import { useContext } from 'react';
import { ToggleTooltipContext } from '../../provider/toggleTooltip';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button } from '@front/external/components/ui/button';

interface TooltipFooterProps extends WithTranslation {
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}
function TooltipFooter({
  onClose,
  onConfirm,
  t,
  confirmText,
}: TooltipFooterProps) {
  const { setIsTooltipShow } = useContext(ToggleTooltipContext);
  return (
    <>
      {confirmText && (
        <Button
          className="h-[36px] rounded-[6px] px-[16px] py-[8px] text-[16px]"
          onClick={() => onConfirm?.()}
        >
          {confirmText}
        </Button>
      )}
      <Button
        className="h-[36px] rounded-[6px] px-[16px] py-[8px] text-[16px]"
        variant="secondary"
        onClick={() => {
          onClose?.();
          setIsTooltipShow(false);
        }}
      >
        {t('common.close')}
      </Button>
    </>
  );
}
export default withTranslation()(TooltipFooter);
