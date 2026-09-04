/* Hallmark · component: new-account-card · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active · disabled
 * contrast: pass (46–50)
 */

import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { useEffect } from 'react';
import { ga } from '@src/shared/ga';
import { Sparkles } from 'lucide-react';

interface NewAccountBodyProps extends WithTranslation {
  email: string;
  actId: string;
  addAccount: () => void;
}

function NewAccountCard({ email, t, addAccount, actId }: NewAccountBodyProps) {
  const onAddAccount = () => {
    addAccount();
    ga.fireEvent('click_계정등록', { act_id: actId });
  };

  useEffect(() => {
    ga.fireEvent('view_계정등록', { act_id: actId });
  }, []);

  return (
    <TooltipLayout
      content={
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
            <Sparkles className="h-4.5 w-4.5 stroke-[2]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-foreground">
              {t('common.account_registration', '계정 등록하기')}
            </h3>
            <div
              className="text-xs leading-normal text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: t('content.confirm_add_email', { email }),
              }}
            />
          </div>
        </div>
      }
      footer={
        <TooltipFooter
          confirmText={t('common.registration', '등록하기')}
          onConfirm={onAddAccount}
        />
      }
    />
  );
}

export default withTranslation()(NewAccountCard);
