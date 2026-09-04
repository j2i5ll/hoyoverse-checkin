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
import { CheckCircle2, ShieldCheck } from 'lucide-react';

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
        <div className="flex flex-col gap-[12px]">
          {/* Success Status Header */}
          <div className="flex items-start gap-[10px]">
            <div className="shadow-xs flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-foreground text-background">
              <CheckCircle2
                size={18}
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2.2}
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[13px] font-semibold leading-[18px] text-foreground">
                {t('content.registration_complete', '계정 등록 완료')}
              </h3>
              <div
                className="mt-[2px] text-[12px] leading-[16px] text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            </div>
          </div>

          {/* Reassurance and Guide Callout */}
          <div className="flex flex-col gap-[6px] rounded-[10px] border border-border/70 bg-muted/20 p-[10px] text-[11px] leading-[15px] text-muted-foreground">
            <div className="flex items-center gap-[8px] font-medium text-foreground">
              <ShieldCheck
                size={14}
                className="h-[14px] w-[14px] shrink-0"
                strokeWidth={2}
              />
              <span>
                {t(
                  'content.check_automatically_in_browser',
                  '브라우저에서 자동으로 출첵을 수행합니다.',
                )}
              </span>
            </div>
            <p className="pl-[22px] text-[11px] leading-[16px] text-muted-foreground">
              {t(
                'content.added_success_note',
                '확장 프로그램 아이콘을 클릭하여 언제든 출석 상태를 확인할 수 있습니다.',
              )}
            </p>
          </div>
        </div>
      }
      footer={
        <TooltipFooter
          confirmText={t('content.add_other_account', '다른 계정 추가하기')}
          onConfirm={handleAddAccount}
          confirmDisabled={isPending}
          isLoading={isPending}
        />
      }
    />
  );
}

export default withTranslation()(AddedAccountCard);
