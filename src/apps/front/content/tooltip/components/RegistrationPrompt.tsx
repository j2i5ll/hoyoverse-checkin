import { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { requestMessage } from '@front/shared/utils/browser';
import { MessageType } from '@src/types';
import { buildRegistrationUrl } from '@src/shared/utils/url';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import TooltipFooter from './tooltip-footer';

function RegistrationPrompt({ t }: WithTranslation) {
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    await requestMessage<void, void>({
      data: { type: MessageType.ClearCookie },
    });
    window.location.href = buildRegistrationUrl();
  };

  return (
    <TooltipLayout
      content={<div>{t('content.confirm_registration')}</div>}
      footer={
        <TooltipFooter
          confirmText={t('common.confirm')}
          onConfirm={handleConfirm}
          confirmDisabled={isPending}
        />
      }
    />
  );
}
export default withTranslation()(RegistrationPrompt);
