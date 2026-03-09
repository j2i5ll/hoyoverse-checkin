import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from './tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { useAccountList } from '@front/shared/hooks/useAccountList';
import { getCurrentActId } from '@src/shared/utils/url';

function LogoutUserTooltip({ t }: WithTranslation) {
  const { accountList } = useAccountList();
  const actId = getCurrentActId();
  const filteredAccounts = accountList.filter((a) => a.actId === actId);

  return (
    <TooltipLayout
      content={
        <div>
          <div>{t('content.need_login_to_register')}</div>
          {filteredAccounts.length > 0 && (
            <>
              <div className="text-[14px] mt-[8px] mb-[4px]">
                {t('content.registered_accounts_title')}
              </div>
              <div className="max-h-[150px] overflow-y-auto">
                {filteredAccounts.map((account) => (
                  <div
                    key={account.ltuid}
                    className="text-[14px] text-muted-foreground"
                  >
                    {account.email}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      }
      footer={<TooltipFooter />}
    />
  );
}
export default withTranslation()(LogoutUserTooltip);
