import { GAME_INFO_LIST, GameActId, GameKey } from '@src/shared/constants/game';
import { NavLink } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import GameIcon from '@front/shared/components/GameIcon';

const GameNav = ({ t }: WithTranslation) => {
  const navLinkList = GAME_INFO_LIST.filter(
    ({ resourceCheckable }) => resourceCheckable,
  ).map((gameItem) => {
    switch (gameItem.actId) {
      case GameActId.Genshin:
        return { ...gameItem, url: `/resource/${GameKey.Genshin}` };
      case GameActId.Starrail:
        return { ...gameItem, url: `/resource/${GameKey.Starrail}` };
      case GameActId.Zzz:
        return { ...gameItem, url: `/resource/${GameKey.ZZZ}` };
      default:
        return { ...gameItem, url: '', active: '' };
    }
  });
  return (
    <>
      <div className="flex h-[82px] flex-row gap-x-4">
        {navLinkList.map((navLink) => (
          <NavLink to={navLink.url} className="group" key={navLink.actId}>
            <GameIcon
              src={navLink.icon}
              alt={t(navLink.name)}
              className="h-14 w-14 opacity-40 group-[.active]:opacity-100"
            />
          </NavLink>
        ))}
      </div>
    </>
  );
};
export default withTranslation()(GameNav);
