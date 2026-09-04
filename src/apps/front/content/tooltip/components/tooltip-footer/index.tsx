/* Hallmark · component: tooltip-footer · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active · disabled · loading
 * contrast: pass (46–50)
 */

import { useContext } from 'react';
import { ToggleTooltipContext } from '../../provider/toggleTooltip';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export interface TooltipFooterProps extends WithTranslation {
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  confirmDisabled?: boolean;
  cancelText?: string;
  isLoading?: boolean;
}

function TooltipFooter({
  onClose,
  onConfirm,
  t,
  confirmText,
  confirmDisabled,
  cancelText,
  isLoading,
}: TooltipFooterProps) {
  const { setIsTooltipShow } = useContext(ToggleTooltipContext);

  const handleClose = () => {
    onClose?.();
    setIsTooltipShow(false);
  };

  return (
    <div className="flex w-full items-center justify-end gap-[8px]">
      <button
        type="button"
        className="inline-flex h-[32px] cursor-pointer select-none items-center justify-center rounded-[6px] border border-border/80 bg-background px-[12px] text-[12px] font-medium leading-[16px] text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none active:scale-[0.98]"
        onClick={handleClose}
      >
        {cancelText ?? t('common.close', '닫기')}
      </button>

      {confirmText && (
        <button
          type="button"
          className="shadow-xs inline-flex h-[32px] cursor-pointer select-none items-center justify-center gap-[6px] rounded-[6px] bg-foreground px-[14px] text-[12px] font-medium leading-[16px] text-background transition-all hover:opacity-90 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          onClick={() => onConfirm?.()}
          disabled={confirmDisabled || isLoading}
        >
          {isLoading && (
            <Loader2
              size={13}
              className="h-[13px] w-[13px] shrink-0 animate-spin"
              strokeWidth={2.2}
            />
          )}
          <span>{confirmText}</span>
        </button>
      )}
    </div>
  );
}

export default withTranslation()(TooltipFooter);
