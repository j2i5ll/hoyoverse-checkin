import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

type ToggleTooltipContextType = {
  setIsTooltipShow: Dispatch<SetStateAction<boolean>>;
  isTooltipShow: boolean;
};
const ToggleTooltipContext = createContext<ToggleTooltipContextType>({
  setIsTooltipShow: () => null,
  isTooltipShow: true,
});

type ToggleTooltipProviderProps = {
  children: ReactNode;
};
const ToggleTooltipProvider = ({ children }: ToggleTooltipProviderProps) => {
  const [isTooltipShow, setIsTooltipShow] = useState<boolean>(true);

  return (
    <ToggleTooltipContext.Provider value={{ isTooltipShow, setIsTooltipShow }}>
      {children}
    </ToggleTooltipContext.Provider>
  );
};
export { ToggleTooltipContext, ToggleTooltipProvider };
