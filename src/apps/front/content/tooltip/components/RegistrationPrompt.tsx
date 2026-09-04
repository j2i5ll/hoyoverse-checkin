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
import { Sparkles } from 'lucide-react';

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
      icon={
        <Sparkles
          size={16}
          className="h-[16px] w-[16px] shrink-0 text-foreground"
          strokeWidth={2}
        />
      }
      content={
        <div className="flex flex-col gap-[4px] py-[2px]">
          <h3 className="text-[14px] font-semibold leading-[20px] text-foreground">
            {t('content.confirm_registration', '자동 출석 계정 등록')}
          </h3>
          <p className="text-[12px] leading-[18px] text-muted-foreground">
            {t(
              'content.registration_guide_desc',
              '브라우저가 열려있을 때 매일 자동으로 출석체크합니다.',
            )}
          </p>

          <p className="text-[12px] leading-[18px] text-muted-foreground">
            {t(
              'content.registration_safe_note',
              '계정 정보는 브라우저에만 안전하게 저장됩니다.',
            )}
          </p>
        </div>
      }
      footer={
        <TooltipFooter
          cancelText={t('common.close', '나중에')}
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
