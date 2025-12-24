import { useContext } from 'react';
import '@front/external/assets/global.css';
import LoginUserTooltip from './components/LoginUserTooltip';
import '@src/shared/i18n';
import { ToggleTooltipContext } from './provider/toggleTooltip';
import LogoutUserTooltip from './components/LogoutUserTooltip';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loginStatusQuery } from '@front/shared/queryOptions/queryies';

export default function App() {
  const { isTooltipShow } = useContext(ToggleTooltipContext);
  const queryClient = useQueryClient();

  const { data: loginStatus } = useQuery({
    ...loginStatusQuery(queryClient),
  });

  if (!isTooltipShow) {
    return null;
  }
  if (loginStatus === 'login') {
    return <LoginUserTooltip />;
  }
  if (loginStatus === 'logout') {
    return <LogoutUserTooltip />;
  }
  return null;
}
