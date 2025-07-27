import TooltipFooter from '@front/content/tooltip/components/tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import {
  AccountStatusError,
  AddAccountError,
  UnKnownGameError,
} from '@front/shared/error';
import { useTranslation } from 'react-i18next';

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
      content={<div className="description">{errorMessage}</div>}
      footer={<TooltipFooter />}
    />
  );
}
export default ErrorFallback;
