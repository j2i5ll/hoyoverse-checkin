/* Hallmark · component: error-fallback · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active
 * contrast: pass (46–50)
 */

import TooltipFooter from '@front/content/tooltip/components/tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import {
  AccountStatusError,
  AddAccountError,
  UnKnownGameError,
} from '@front/shared/error';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  const { t } = useTranslation();
  const errorMessage = (() => {
    if (error instanceof AddAccountError) {
      return t('error.add_account');
    }

    if (error instanceof AccountStatusError) {
      return t('error.get_account_status');
    }

    if (error instanceof UnKnownGameError) {
      return t('content.not_supported_game');
    }

    return t('error.unknown');
  })();

  return (
    <TooltipLayout
      content={
        <div className="flex items-start gap-[10px]">
          <div className="shadow-xs flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-muted text-foreground">
            <AlertCircle
              size={18}
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[13px] font-semibold leading-[18px] text-foreground">
              {t('error.unknown', '오류가 발생했습니다.')}
            </h3>
            <p className="mt-[2px] text-[12px] leading-[16px] text-muted-foreground">
              {errorMessage}
            </p>
          </div>
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}

export default ErrorFallback;
