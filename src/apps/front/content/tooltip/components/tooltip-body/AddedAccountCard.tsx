/* Hallmark · component: added-account-card · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active · disabled · loading
 * contrast: pass (46–50)
 */

import { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { requestMessage } from '@front/shared/utils/browser';
import { MessageType } from '@src/types';
import { buildRegistrationUrl } from '@src/shared/utils/url';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import TooltipFooter from '../tooltip-footer';
import { ga } from '@src/shared/ga';
import { CheckCircle2 } from 'lucide-react';

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
      icon={
        <CheckCircle2
          size={16}
          className="h-[16px] w-[16px] shrink-0 text-foreground"
          strokeWidth={2}
        />
      }
      content={
        <div className="flex flex-col gap-[4px] py-[2px]">
          <h3 className="text-[14px] font-semibold leading-[20px] text-foreground">
            {t('content.registration_complete', '계정 등록 완료')}
          </h3>
          <div
            className="text-[12px] leading-[18px] text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      }
      footer={
        <TooltipFooter
          confirmText={t('content.add_other_account', '다른 계정 추가')}
          onConfirm={handleAddAccount}
          confirmDisabled={isPending}
          isLoading={isPending}
        />
      }
    />
  );
}

export default withTranslation()(AddedAccountCard);
