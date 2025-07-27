import {
  GAME_INFO_LIST,
  GameActId,
  GameId,
  GameKey,
} from '@src/shared/constants/game';
import { useAccountList } from '@front/shared/hooks/useAccountList';
import { useSelectedRoleId } from '@front/shared/hooks/useSelectedRoleId';
import { useEffect, useMemo, useState } from 'react';
import NoAccount from '@src/apps/front/popup/pages/ResourceHome/components/NoAccount';
import {
  useTranslation,
  WithTranslation,
  withTranslation,
} from 'react-i18next';
import SelectedCharacterInfo from '@src/apps/front/popup/pages/ResourceHome/components/SelectedCharacterInfo';
import { ResourceInfo, SelectedRoleIdType } from '@src/types';
import Loading from '@src/apps/front/popup/components/Loading';
import resinImg from '@assets/img/resin.webp';
import staminaImg from '@assets/img/stamina.webp';
import batteryImg from '@assets/img/battery.png';
import ResourceTimer from '@src/apps/front/popup/pages/ResourceHome/components/ResourceTimer';
import NeedPublicData from '@src/apps/front/popup/pages/ResourceHome/components/NeedPublicData';
import { NavLink } from 'react-router-dom';
import { currentResourceQuery } from '@front/shared/queryOptions/queryies';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { AccountPublicDataError } from '@front/shared/error';
import ResourceProgress from '@front/popup/pages/ResourceHome/components/ResourceProgress';
import { Button } from '@front/external/components/ui/button';

interface SelectRoleIdLinkProps extends WithTranslation {
  gameKey: GameKey;
}
const SelectRoleIdLink = withTranslation()(({
  t,
  gameKey,
}: SelectRoleIdLinkProps) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1 pb-8 text-center">
        <div className="text-lg font-semibold">
          {t('popup.please_select_character')}
        </div>
        <Button asChild variant="link">
          <NavLink to={`/resource/selectCharacter?gameKey=${gameKey}`}>
            {t('popup.select_character')}
          </NavLink>
        </Button>
      </div>
    </>
  );
});

type ResourceCounterProps = {
  gameKey: GameKey;
  resource: ResourceInfo;
};
const ResourceCounter = withTranslation()(({
  gameKey,
  resource,
}: ResourceCounterProps) => {
  const [, setResourceState] = useState<ResourceInfo>(resource);
  const imgSrc = useMemo(() => {
    switch (gameKey) {
      case GameKey.Genshin:
        return resinImg;
      case GameKey.Starrail:
        return staminaImg;
      case GameKey.ZZZ:
        return batteryImg;
      default:
        return resinImg;
    }
  }, [gameKey]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (resource.currentResource === resource.maxResource) {
        clearInterval(timer);
      }
      resource.countdown();
      setResourceState(resource.clone()); // 단순히 리렌더링 유발을 위한 동작.
    }, 1000);
    return () => clearInterval(timer);
  }, [resource]);

  return (
    <div className="flex flex-col items-center justify-center gap-y-3">
      <SelectedCharacterInfo gameKey={gameKey} />
      <ResourceProgress resource={resource} img={imgSrc} />
      <div className="mt-[-20px]">
        <ResourceTimer resource={resource} />
      </div>
    </div>
  );
});

type CurrentResourceProps = {
  roleId: SelectedRoleIdType;
  gameKey: GameKey;
};
const CurrentResource = ({ roleId, gameKey }: CurrentResourceProps) => {
  const { data: resource = [new ResourceInfo()], isFetching } = useQuery({
    ...currentResourceQuery({
      targetList: [{ token: roleId.token, gameId: GameId[gameKey] }],
    }),
  });

  if (isFetching) {
    return <Loading />;
  }

  return <ResourceCounter gameKey={gameKey} resource={resource[0]} />;
};

const ResourceError = ({
  error,
  gameKey,
}: {
  error: Error;
  gameKey: GameKey;
}) => {
  const { t } = useTranslation();
  if (error instanceof AccountPublicDataError) {
    return <NeedPublicData gameKey={gameKey} />;
  }

  return (
    <div className="flex items-center justify-center flex-1 text-sm text-center">
      {' '}
      {t('error.unknown')}
    </div>
  );
};

type ResourceContentProps = {
  gameKey: GameKey;
};
const ResourceContent = ({ gameKey }: ResourceContentProps) => {
  const selectedActId = GameActId[gameKey];
  const { accountList } = useAccountList();
  const { selectedRoleIdList } = useSelectedRoleId();

  const filteredAccountList = useMemo(() => {
    return accountList.filter(({ actId }) => actId === selectedActId);
  }, [accountList, selectedActId]);

  const game =
    GAME_INFO_LIST.find(({ actId }) => actId === selectedActId) ??
    GAME_INFO_LIST[0];

  const selectedRoleId = useMemo(() => {
    return selectedRoleIdList.find(({ actId }) => actId === selectedActId);
  }, [selectedRoleIdList, selectedActId]);

  if (filteredAccountList.length === 0) {
    return <NoAccount game={game} />;
  }

  if (!selectedRoleId) {
    return <SelectRoleIdLink gameKey={gameKey} />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={(errorProps) => (
        <ResourceError {...errorProps} gameKey={gameKey} />
      )}
      key={gameKey}
    >
      <CurrentResource roleId={selectedRoleId} gameKey={gameKey} />
    </ErrorBoundary>
  );
};

type ResourceProps = {
  gameKey: GameKey;
};
function Resource({ gameKey }: ResourceProps) {
  return (
    <div className="flex flex-col justify-start flex-1">
      <ResourceContent gameKey={gameKey} />
    </div>
  );
}
export default Resource;
