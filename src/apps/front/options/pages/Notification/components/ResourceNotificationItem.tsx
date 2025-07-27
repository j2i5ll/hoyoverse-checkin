import { Button } from '@front/external/components/ui/button';
import { Separator } from '@front/external/components/ui/separator';
import { Slider } from '@front/external/components/ui/slider';
import { Switch } from '@front/external/components/ui/switch';
import GameIcon from '@front/shared/components/GameIcon';
import { useSelectedRoleId } from '@front/shared/hooks/useSelectedRoleId';
import { GameActId, GameKey } from '@src/shared/constants/game';
import { GameItemType, SelectedRoleIdType } from '@src/types';
import { useMemo, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

type ResourceNotificationItemProps = {
  selectedRoleId: SelectedRoleIdType;
  gameInfo: GameItemType;
  maxResource: number;
} & WithTranslation;
const ResourceNotificationItem = ({
  selectedRoleId,
  t,
  gameInfo,
  maxResource,
}: ResourceNotificationItemProps) => {
  const DEFAULT_SCORE = 60;
  const resourceNotification = selectedRoleId?.resourceNotification ?? {
    notiValue: DEFAULT_SCORE,
    isOn: false,
  };
  const { updateResourceNotification } = useSelectedRoleId();
  const resourceNameKey = useMemo(() => {
    if (gameInfo.actId === GameActId[GameKey.Genshin]) {
      return 'common.resource_resin';
    } else if (gameInfo.actId === GameActId[GameKey.Starrail]) {
      return 'common.resource_stemina';
    } else if (gameInfo.actId === GameActId[GameKey.ZZZ]) {
      return 'common.resource_energy';
    }
    return '';
  }, [gameInfo.actId]);
  const [selectedScore, setSelectedScore] = useState<number>(
    resourceNotification.notiValue,
  );

  const updateNotificationOnOff = (isOn: boolean) => {
    updateResourceNotification(selectedRoleId.actId, {
      ...resourceNotification,
      isOn,
    });
  };
  const updateResourceScore = (value: number) => {
    updateResourceNotification(selectedRoleId.actId, {
      ...resourceNotification,
      notiValue: value,
    });
  };

  return (
    <div className="flex min-w-[700px] max-w-[1000px] flex-col items-center gap-y-4 rounded-xl border p-6">
      <div className="flex flex-col items-center">
        <GameIcon src={gameInfo.icon} className="w-20 h-20 cursor-default" />
        <h4 className="pt-3 text-xl font-semibold tracking-tight scroll-m-20">
          {t(gameInfo.name)}
        </h4>
        <div className="text-sm">
          {selectedRoleId.nickname}(Lv.{selectedRoleId.level}){' '}
          {selectedRoleId.regionName}
        </div>
      </div>
      <Separator />
      <div className="flex flex-row items-center justify-between w-full gap-x-4">
        <div>
          <h4 className="text-sm font-semibold tracking-tight scroll-m-20">
            {t(resourceNameKey)} 알림 설정
          </h4>
        </div>
        <Switch
          checked={resourceNotification.isOn}
          onCheckedChange={(value) => updateNotificationOnOff(value)}
        />
      </div>
      {resourceNotification.isOn && (
        <div className="flex justify-center w-full py-4 gap-x-2">
          <Slider
            defaultValue={[selectedScore]}
            max={maxResource}
            disabled={!resourceNotification.isOn}
            step={1}
            className="w-[60%]"
            onValueChange={([value]) => setSelectedScore(value)}
            onValueCommit={([value]) => updateResourceScore(value)}
          />
        </div>
      )}
      {resourceNotification.isOn ? (
        <div className="text-sm">
          {t(resourceNameKey)}(이)가{' '}
          <span className="font-semibold">
            {selectedScore} ({Math.floor((selectedScore / maxResource) * 100)}%)
          </span>
          이 되면 알림을 보냅니다.
        </div>
      ) : (
        <div className="flex flex-col items-center text-sm gap-y-4">
          <div>알림을 켜서 충전 상태를 확인해보세요.</div>
          <Button onClick={() => updateNotificationOnOff(true)}>
            알림 켜기
          </Button>
        </div>
      )}
    </div>
  );
};
export default withTranslation()(ResourceNotificationItem);
