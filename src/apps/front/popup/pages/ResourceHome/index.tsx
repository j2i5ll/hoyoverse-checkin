import { useParams } from 'react-router-dom';
import GameNav from './components/GameNav';
import { GameKey } from '@src/shared/constants/game';
import Resource from './components/Resource';
const ResourceHome = () => {
  const { gameKey } = useParams();
  return (
    <div className="flex flex-1 flex-col px-2">
      <GameNav />
      <Resource gameKey={gameKey as GameKey} />
    </div>
  );
};

export default ResourceHome;
