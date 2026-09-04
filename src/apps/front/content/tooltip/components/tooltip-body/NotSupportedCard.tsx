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
            {t('content.not_supported_game', '아직 지원하지 않는 게임입니다.')}
          </h3>
          <p className="text-[12px] leading-[18px] text-muted-foreground">
            {t(
              'content.supported_games_desc',
              '원신, 스타레일, 붕괴3rd, 젠레스 존 제로 출석체크를 지원합니다.',
            )}
          </p>
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}

export default withTranslation()(NotSupportedCard);
