import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipFooter from '../tooltip-footer';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import { useEffect } from 'react';
import { ga } from '@src/shared/ga';
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
        <div
          dangerouslySetInnerHTML={{
            __html: t('content.confirm_add_email', { email }),
          }}
        ></div>
      }
      footer={
        <TooltipFooter
          confirmText={t('common.registration')}
          onConfirm={onAddAccount}
        />
      }
    />
  );
}
export default withTranslation()(NewAccountCard);
