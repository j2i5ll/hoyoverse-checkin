import { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { requestMessage } from '@front/shared/utils/browser';
import { MessageType } from '@src/types';
import { buildRegistrationUrl } from '@src/shared/utils/url';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import TooltipFooter from '../tooltip-footer';
import { ga } from '@src/shared/ga';

interface AddedAccountBodyProps extends WithTranslation {
  count?: number;
}
function AddedAccountCard({ t, count = 1 }: AddedAccountBodyProps) {
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    ga.fireEvent('view_등록완료', { count });
  }, []);

  const handleAddAccount = async () => {
    setIsPending(true);
    await requestMessage<void, void>({
      data: { type: MessageType.ClearCookie },
    });
    window.location.href = buildRegistrationUrl();
  };

  const message = t('content.accounts_added', { count });

  return (
    <TooltipLayout
      content={
        <div className="description">
          <div dangerouslySetInnerHTML={{ __html: message }}></div>
          <div>{t('content.check_automatically_in_browser')}</div>
        </div>
      }
      footer={
        <TooltipFooter
          confirmText={t('onboarding.register_account')}
          onConfirm={handleAddAccount}
          confirmDisabled={isPending}
        />
      }
    />
  );
}
export default withTranslation()(AddedAccountCard);
