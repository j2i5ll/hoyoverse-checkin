/* Hallmark · component: logout-user-tooltip · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active
 * contrast: pass (46–50)
 */

import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from './tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { LogIn } from 'lucide-react';

function LogoutUserTooltip({ t }: WithTranslation) {
  return (
    <TooltipLayout
      icon={
        <LogIn
          size={16}
          className="h-[16px] w-[16px] shrink-0 text-foreground"
          strokeWidth={2}
        />
      }
      content={
        <div className="flex flex-col gap-[4px] py-[2px]">
          <h3 className="text-[14px] font-semibold leading-[20px] text-foreground">
            {t('content.need_login', 'HoYoLAB 로그인이 필요합니다')}
          </h3>
          <p className="text-[12px] leading-[18px] text-muted-foreground">
            {t(
              'content.need_login_to_register',
              '우측 상단 프로필에서 로그인 후 다시 방문해주세요.',
            )}
          </p>
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}

export default withTranslation()(LogoutUserTooltip);
