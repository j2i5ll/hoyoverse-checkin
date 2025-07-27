// import GameItem from './components/GameItem.svelte';
import { GAME_INFO_LIST } from '@src/shared/constants/game';
import GameItem from './components/GameItem';
const CheckInHome = () => {
  return (
    <div>
      {GAME_INFO_LIST.map((game) => (
        <GameItem game={game} key={game.actId} />
      ))}
    </div>
  );
};
export default CheckInHome;
