import NoSelectedCharacter from '@front/options/pages/Notification/components/NoSelectedCharacter';
import ResourceNotificationItem from '@front/options/pages/Notification/components/ResourceNotificationItem';
import { useSelectedRoleId } from '@front/shared/hooks/useSelectedRoleId';
import { currentResourceQuery } from '@front/shared/queryOptions/queryies';
import { GAME_INFO_LIST, GameActId, GameId } from '@src/shared/constants/game';
import { useQuery } from '@tanstack/react-query';

const Notification = () => {
  const { selectedRoleIdList } = useSelectedRoleId();
  const getSelectedRoleIdIndex = (actId: string) => {
    return selectedRoleIdList.findIndex(
      (selectedRoleId) => selectedRoleId.actId === actId,
    );
  };

  const getGameIdByActId = (actId: string) => {
    const [gameKey] = Object.entries(GameActId).find(
      ([, value]) => value === actId,
    );
    return GameId[gameKey];
  };

  const { data: resourceList, isLoading } = useQuery({
    ...currentResourceQuery({
      targetList: selectedRoleIdList.map((selectedRoleId) => ({
        token: selectedRoleId.token,
        gameId: getGameIdByActId(selectedRoleId.actId),
      })),
    }),
    staleTime: Infinity, // maxResource만을 참조하기때문에 추가로 api요청을 하지 않아도 됨
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-8">
      {GAME_INFO_LIST.filter((gameInfo) => gameInfo.resourceCheckable).map(
        (gameInfo) => {
          const targetSelectedRoleIdIndex = getSelectedRoleIdIndex(
            gameInfo.actId,
          );
          if (targetSelectedRoleIdIndex < 0) {
            return (
              <NoSelectedCharacter gameInfo={gameInfo} key={gameInfo.actId} />
            );
          }
          return (
            <ResourceNotificationItem
              key={gameInfo.actId}
              gameInfo={gameInfo}
              selectedRoleId={selectedRoleIdList[targetSelectedRoleIdIndex]}
              maxResource={resourceList[targetSelectedRoleIdIndex].maxResource}
            />
          );
        },
      )}
    </div>
  );
};

export default Notification;
