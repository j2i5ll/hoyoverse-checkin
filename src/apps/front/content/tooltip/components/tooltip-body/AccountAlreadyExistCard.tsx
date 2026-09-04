/* Hallmark · component: account-already-exist-card · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active · disabled
 * contrast: pass (46–50)
 */

import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { useEffect } from 'react';
import { ga } from '@src/shared/ga';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface AccountAlreadyExistBodyProps extends WithTranslation {
  email: string;
  actId: string;
  hasUnregisteredGames?: boolean;
  onRegisterOtherGames?: () => void;
}

function AccountAlreadyExistCard({
  email,
  t,
  actId,
  hasUnregisteredGames,
  onRegisterOtherGames,
}: AccountAlreadyExistBodyProps) {
  useEffect(() => {
    ga.fireEvent('view_이미등록', { act_id: actId });
  }, []);

  return (
    <TooltipLayout
      content={
        <div className="flex flex-col gap-[12px]">
          {/* Status Header */}
          <div className="flex items-start gap-[10px]">
            <div className="shadow-xs flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-foreground text-background">
              <CheckCircle2
                size={18}
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2.2}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-[6px]">
                <h3 className="text-[13px] font-semibold leading-[18px] text-foreground">
                  {t('content.registration_complete', '계정 등록 완료')}
                </h3>
                <span className="rounded-full border border-border/60 bg-muted px-[6px] py-[1px] text-[10px] font-medium leading-[14px] text-muted-foreground">
                  {t('content.already_registered', '등록됨')}
                </span>
              </div>
              <div
                className="mt-[2px] text-[12px] leading-[16px] text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: t('content.already_exist_account', { email }),
                }}
              />
            </div>
          </div>

          {/* Reassurance Callout */}
          <div className="flex items-center gap-[8px] rounded-[10px] border border-border/70 bg-muted/20 p-[10px] text-[11px] leading-[15px] text-muted-foreground">
            <ShieldCheck
              size={14}
              className="h-[14px] w-[14px] shrink-0 text-foreground"
              strokeWidth={2}
            />
            <span>
              {t(
                'content.check_automatically_in_browser',
                '브라우저에서 자동으로 출첵을 수행합니다.',
              )}
            </span>
          </div>

          {/* Action to register other games */}
          {hasUnregisteredGames && (
            <button
              type="button"
              className="group flex h-[34px] w-full cursor-pointer items-center justify-between rounded-[8px] border border-border/80 bg-background px-[12px] text-[12px] font-medium leading-[16px] text-foreground transition-all hover:bg-muted/40"
              onClick={onRegisterOtherGames}
            >
              <span>
                {t('content.register_other_games', '다른 게임도 등록하기')}
              </span>
              <ArrowRight
                size={13}
                className="h-[13px] w-[13px] text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </button>
          )}
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}

export default withTranslation()(AccountAlreadyExistCard);
