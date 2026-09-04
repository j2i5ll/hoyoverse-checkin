/* Hallmark · component: content-script-tooltip-layer · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active · disabled
 * contrast: pass (46–50)
 */

import { ReactNode, useContext } from 'react';
import { APP_NAME } from '@src/shared/constants/text';
import { ToggleTooltipContext } from '../provider/toggleTooltip';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, X } from 'lucide-react';

export type TooltipLayerProps = {
  content: ReactNode;
  footer?: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
  badge?: ReactNode;
  onClose?: () => void;
};

const TooltipLayout = ({
  content,
  footer,
  title = APP_NAME,
  badge,
  onClose,
}: TooltipLayerProps) => {
  const { setIsTooltipShow } = useContext(ToggleTooltipContext);
  const { t } = useTranslation();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setIsTooltipShow(false);
  };

  const badgeText = badge ?? t('content.badge_assistant', '자동 출석');

  return (
    <div
      style={{ fontSize: '14px', lineHeight: '20px' }}
      className="fixed bottom-[24px] left-[24px] z-[99999] flex w-[380px] max-w-[calc(100vw-32px)] flex-col justify-between overflow-hidden rounded-[16px] border border-border/80 bg-background font-sans text-foreground antialiased shadow-2xl backdrop-blur-sm"
    >
      {/* Top Header bar with app branding and close action */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-[16px] py-[10px]">
        <div className="flex items-center gap-[8px]">
          <div className="shadow-xs flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[6px] bg-foreground text-background">
            <CalendarCheck
              size={14}
              className="h-[14px] w-[14px] shrink-0"
              strokeWidth={2.2}
            />
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[13px] font-semibold leading-[18px] tracking-tight text-foreground">
              {title}
            </span>
            {badgeText && (
              <span className="rounded-[4px] border border-border/60 bg-muted/80 px-[6px] py-[1px] text-[10px] font-medium leading-[14px] text-muted-foreground">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label={t('common.close', '닫기')}
          className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[6px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none active:scale-95"
        >
          <X size={14} className="h-[14px] w-[14px] shrink-0" strokeWidth={2} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-[16px] text-[13px] leading-[18px] text-foreground">
        {content}
      </div>

      {/* Action Footer */}
      {footer && (
        <div className="flex flex-row items-center justify-end gap-[8px] border-t border-border/40 bg-muted/10 px-[16px] py-[10px]">
          {footer}
        </div>
      )}
    </div>
  );
};

export default TooltipLayout;
