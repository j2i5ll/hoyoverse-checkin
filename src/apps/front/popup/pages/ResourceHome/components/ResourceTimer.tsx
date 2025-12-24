import { diffDays, secondToCount } from '@src/shared/utils/date';
import { ResourceInfo } from '@src/types';
import { WithTranslation, withTranslation } from 'react-i18next';

interface ResourceTimerProps extends WithTranslation {
  resource: ResourceInfo;
}
function ResourceTimer({ t, resource }: ResourceTimerProps) {
  if (resource.resourceFullyRecoveryTime === 0) {
    return (
      <div className="text-sm font-medium">{t('popup.charge_complete')}</div>
    );
  }

  const now = new Date();
  const fullyChargeDate = new Date(
    now.getTime() + resource.resourceFullyRecoveryTime * 1000,
  );
  const diffDay = Math.abs(diffDays(now, fullyChargeDate));

  return (
    <div className="text-center leading-4">
      <span
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: t('popup.next_charge_time', {
            remainTime: secondToCount(resource.resourceNextRecoveryTime),
          }),
        }}
      ></span>
      <br />
      <span className="text-sm text-muted-foreground">
        {t(
          diffDay === 0
            ? 'popup.charge_complete_at_today'
            : 'popup.charge_complete_at_tomorrow',
          {
            time: `${(fullyChargeDate.getHours() + '').padStart(2, '0')}:${(fullyChargeDate.getMinutes() + '').padStart(2, '0')}`,
          },
        )}
      </span>
    </div>
  );
}
export default withTranslation()(ResourceTimer);
