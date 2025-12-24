import { GAME_INFO_LIST } from '@src/shared/constants/game';
import { createContext, ReactNode, useState } from 'react';

type SelectedGameActIdContextType = {
  selectedGameActId: string;
  setSelectedGameActId: React.Dispatch<React.SetStateAction<string>>;
};
const SelectedGameActIdContext = createContext<SelectedGameActIdContextType>({
  selectedGameActId: '',
  setSelectedGameActId: () => null,
});

type SelectedGameActIdProviderProps = {
  children: ReactNode;
};
const SelectedGameActIdProvider = ({
  children,
}: SelectedGameActIdProviderProps) => {
  const [selectedGameActId, setSelectedGameActId] = useState(
    GAME_INFO_LIST[0].actId,
  );

  return (
    <SelectedGameActIdContext.Provider
      value={{ selectedGameActId, setSelectedGameActId }}
    >
      {children}
    </SelectedGameActIdContext.Provider>
  );
};
export { SelectedGameActIdContext, SelectedGameActIdProvider };
