import Loading from '@front/popup/components/Loading';
import { GameActId, GameBiz, GameKey } from '@src/shared/constants/game';
import { useAccountList } from '@front/shared/hooks/useAccountList';

import { CharacterItemType, AccountInfoType } from '@src/types';
import { useCallback, useMemo, useState } from 'react';
import CharacterItem from './CharacterItem';
import { useSelectedRoleId } from '@front/shared/hooks/useSelectedRoleId';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { characterListQuery } from '@front/shared/queryOptions/queryies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@front/external/components/ui/select';

type CharacterListProps = {
  account: AccountInfoType;
  gameKey: GameKey;
};
function CharacterList({ account, gameKey }: CharacterListProps) {
  const { ltoken, ltuid } = account;
  const { data: characterList = [], isFetching } = useQuery({
    ...characterListQuery({
      token: { ltoken, ltuid },
      gameBiz: GameBiz[gameKey],
    }),
  });
  const targetActId = GameActId[gameKey];
  const navigate = useNavigate();
  const { setSelectedRoleId } = useSelectedRoleId();

  const onSelectCharacter = useCallback(
    (selectedCharacter: CharacterItemType) => {
      const { ltoken, ltuid, email } = account;
      const { region, gameRoleId, regionName, level, nickname } =
        selectedCharacter;
      setSelectedRoleId({
        email,
        actId: targetActId,
        region,
        regionName,
        level,
        nickname,
        roleId: gameRoleId,
        token: { ltoken, ltuid },
      }).then(() => navigate(-1));
    },
    [account],
  );

  if (isFetching) {
    return <Loading style={{ marginTop: '50px' }} />;
  }
  return (
    <>
      {characterList.map((character, index) => (
        <CharacterItem
          key={index}
          character={character}
          select={() => onSelectCharacter(character)}
        />
      ))}
    </>
  );
}

type AccountSelectorProps = {
  gameKey: GameKey;
};
function AccountSelector({ gameKey }: AccountSelectorProps) {
  const targetActId = GameActId[gameKey];
  const [selectedAccountIndex, setSelectedAccountIndex] = useState('0');

  const { accountList } = useAccountList();
  const filteredAccountList = useMemo(() => {
    return accountList.filter(({ actId }) => actId === targetActId);
  }, [accountList]);

  const account = filteredAccountList[parseInt(selectedAccountIndex)];

  const changeAccount = (value: string) => {
    setSelectedAccountIndex(value);
  };

  if (!account) {
    return null;
  }

  return (
    <>
      <Select value={selectedAccountIndex} onValueChange={changeAccount}>
        <SelectTrigger className="h-[30px]l">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filteredAccountList.map((account, index) => (
            <SelectItem key={index} value={`${index}`}>
              {account.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CharacterList account={account} gameKey={gameKey} />
    </>
  );
}
export default AccountSelector;
