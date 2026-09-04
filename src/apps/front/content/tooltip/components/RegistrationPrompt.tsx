/* Hallmark · component: registration-prompt · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active · disabled · loading
 * contrast: pass (46–50)
 */

import { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { requestMessage } from '@front/shared/utils/browser';
import { MessageType } from '@src/types';
import { buildRegistrationUrl } from '@src/shared/utils/url';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import TooltipFooter from './tooltip-footer';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';

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
      content={
        <div className="flex flex-col gap-[12px]">
          {/* Header prompt with icon */}
          <div className="flex items-start gap-[10px]">
            <div className="shadow-xs flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-foreground text-background">
              <Sparkles
                size={16}
                className="h-[16px] w-[16px] shrink-0"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[14px] font-semibold leading-[18px] text-foreground">
                {t(
                  'content.confirm_registration',
                  'Hoyoverse Check-in에 계정을 등록하시겠습니까?',
                )}
              </h3>
              <p className="mt-[2px] text-[12px] leading-[17px] text-muted-foreground">
                {t(
                  'content.registration_guide_desc',
                  '계정을 등록하면 브라우저가 열려있을 때 매일 자동으로 출석체크를 진행합니다.',
                )}
              </p>
            </div>
          </div>

          {/* Value props list */}
          <div className="flex flex-col gap-[6px] rounded-[10px] border border-border/70 bg-muted/20 p-[10px] text-[11px] leading-[15px]">
            <div className="flex items-center gap-[8px] text-muted-foreground">
              <Check
                size={13}
                className="h-[13px] w-[13px] shrink-0 text-foreground"
                strokeWidth={2.5}
              />
              <span>
                {t(
                  'content.check_automatically_in_browser',
                  '브라우저에서 자동으로 출첵을 수행합니다.',
                )}
              </span>
            </div>
            <div className="flex items-center gap-[8px] text-muted-foreground">
              <ShieldCheck
                size={13}
                className="h-[13px] w-[13px] shrink-0 text-foreground"
                strokeWidth={2}
              />
              <span>
                {t(
                  'content.registration_safe_note',
                  '로그인 정보는 브라우저 로컬에만 안전하게 보관됩니다.',
                )}
              </span>
            </div>
          </div>
        </div>
      }
      footer={
        <TooltipFooter
          confirmText={t('common.registration', '등록하기')}
          onConfirm={handleConfirm}
          confirmDisabled={isPending}
          isLoading={isPending}
        />
      }
    />
  );
}

export default withTranslation()(RegistrationPrompt);
