import AccountList from '@front/options/components/AccountList';
import GameList from '@front/options/components/GameList';

const Home = () => {
  return (
    <div className="flex flex-col items-center flex-1 h-full gap-y-6">
      <GameList />
      <AccountList />
    </div>
  );
};

export default Home;
