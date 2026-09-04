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
      icon={
        <AlertCircle
          size={16}
          className="h-[16px] w-[16px] shrink-0 text-foreground"
          strokeWidth={2}
        />
      }
      content={
        <div className="flex flex-col gap-[4px] py-[2px]">
          <h3 className="text-[14px] font-semibold leading-[20px] text-foreground">
            {t('error.unknown', '오류가 발생했습니다.')}
          </h3>
          <p className="text-[12px] leading-[18px] text-muted-foreground">
            {errorMessage}
          </p>
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}

export default ErrorFallback;
