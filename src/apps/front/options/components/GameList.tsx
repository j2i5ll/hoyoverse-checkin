import { useContext } from 'react';
import { SelectedGameActIdContext } from '../provider/selectedGameActId';
import { GAME_INFO_LIST } from '@src/shared/constants/game';
import { WithTranslation, withTranslation } from 'react-i18next';
import GameIcon from '@front/shared/components/GameIcon';

function GameList({ t }: WithTranslation) {
  const { selectedGameActId, setSelectedGameActId } = useContext(
    SelectedGameActIdContext,
  );
  const selectGame = (actId: string) => {
    setSelectedGameActId(actId);
  };
  return (
    <div className="flex flex-row gap-x-8">
      {GAME_INFO_LIST.map((game) => (
        <GameIcon
          src={game.icon}
          alt={t(game.name)}
          key={game.actId}
          className="h-36 w-36"
          active={selectedGameActId === game.actId}
          onClick={() => selectGame(game.actId)}
        ></GameIcon>
      ))}
    </div>
  );
}
export default withTranslation()(GameList);
