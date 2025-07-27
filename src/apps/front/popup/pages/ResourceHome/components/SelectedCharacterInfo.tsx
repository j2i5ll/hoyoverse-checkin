import { GameActId, GameKey } from '@src/shared/constants/game';
import { useSelectedRoleId } from '@front/shared/hooks/useSelectedRoleId';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@front/external/components/ui/button';
import { UserRoundPen } from 'lucide-react';
type SelectCharacterInfoProps = {
  gameKey: GameKey;
};
function SelectCharacterInfo({ gameKey }: SelectCharacterInfoProps) {
  const { selectedRoleIdList } = useSelectedRoleId();
  const actId = GameActId[gameKey];
  const character = useMemo(() => {
    return selectedRoleIdList.find(
      (selectedRoleId) => selectedRoleId.actId === actId,
    );
  }, [selectedRoleIdList]);

  return (
    character && (
      <Button variant="link" asChild>
        <NavLink to={`/resource/selectCharacter?gameKey=${gameKey}`}>
          {character.nickname}(Lv.{character.level}) {character.regionName}
          <UserRoundPen />
        </NavLink>
      </Button>
    )
  );
}
export default SelectCharacterInfo;
