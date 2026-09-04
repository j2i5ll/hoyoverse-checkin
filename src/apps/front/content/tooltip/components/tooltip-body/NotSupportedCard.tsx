/* Hallmark · component: not-supported-card · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active
 * contrast: pass (46–50)
 */

import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { AlertCircle } from 'lucide-react';

function NotSupportedCard({ t }: WithTranslation) {
  return (
    <TooltipLayout
      content={
        <div className="flex flex-col items-center py-[8px] text-center">
          <div className="shadow-xs mb-[10px] flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
            <AlertCircle
              size={18}
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={2}
            />
          </div>
          <h3 className="text-[13px] font-semibold leading-[18px] text-foreground">
            {t('content.not_supported_game', '아직 지원하지 않는 게임입니다.')}
          </h3>
          <p className="mt-[4px] text-[11px] leading-[15px] text-muted-foreground">
            원신, 붕괴: 스타레일, 붕괴3rd, 젠레스 존 제로의 출석 체크를
            지원합니다.
          </p>
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}

export default withTranslation()(NotSupportedCard);
