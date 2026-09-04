/* Hallmark · component: logout-user-tooltip · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active
 * contrast: pass (46–50)
 */

import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from './tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { LogIn, Info } from 'lucide-react';

function LogoutUserTooltip({ t }: WithTranslation) {
  return (
    <TooltipLayout
      content={
        <div className="flex flex-col gap-[12px]">
          {/* Main prompt header */}
          <div className="flex items-start gap-[10px]">
            <div className="shadow-xs flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-muted text-foreground">
              <LogIn
                size={16}
                className="h-[16px] w-[16px] shrink-0"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[14px] font-semibold leading-[18px] text-foreground">
                {t('content.need_login', '로그인 후 이용해주세요.')}
              </h3>
              <p className="mt-[2px] text-[12px] leading-[17px] text-muted-foreground">
                {t(
                  'content.need_login_to_register',
                  '화면 우측 상단의 프로필 버튼을 눌러 로그인해주세요.',
                )}
              </p>
            </div>
          </div>

          {/* Step Guide Callout */}
          <div className="rounded-[10px] border border-border/70 bg-muted/30 p-[10px]">
            <div className="flex items-center gap-[6px] text-[11px] font-medium leading-[15px] text-foreground">
              <Info
                size={13}
                className="h-[13px] w-[13px] shrink-0 text-muted-foreground"
              />
              <span>
                {t(
                  'content.registration_guide_desc',
                  '계정을 등록하면 브라우저가 열려있을 때 매일 자동으로 출석체크를 진행합니다.',
                )}
              </span>
            </div>
            <p className="mt-[6px] pl-[19px] text-[11px] leading-[16px] text-muted-foreground">
              {t(
                'content.login_step_guide',
                '로그인 후 이 페이지로 돌아오면 게임 계정을 바로 등록할 수 있습니다.',
              )}
            </p>
          </div>
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}

export default withTranslation()(LogoutUserTooltip);
