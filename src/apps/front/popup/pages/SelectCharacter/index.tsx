import { useSearchParams } from 'react-router-dom';
import AccountSelector from '../ResourceHome/components/AccountSelector';
import { GameKey } from '@src/shared/constants/game';

function SelectCharacter() {
  const [searchParams] = useSearchParams();
  const gameKey = searchParams.get('gameKey') as GameKey;
  return (
    <div className="px-4 pt-4">
      <AccountSelector gameKey={gameKey} />
    </div>
  );
}
export default SelectCharacter;
