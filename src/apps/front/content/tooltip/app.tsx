import { useContext, useState } from 'react';
import '@front/external/assets/global.css';
import LoginUserTooltip from './components/LoginUserTooltip';
import '@src/shared/i18n';
import { ToggleTooltipContext } from './provider/toggleTooltip';
import LogoutUserTooltip from './components/LogoutUserTooltip';
import RegistrationPrompt from './components/RegistrationPrompt';
import AddedAccountCard from './components/tooltip-body/AddedAccountCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loginStatusQuery } from '@front/shared/queryOptions/queryies';
import { hasRegistrationFlag } from '@src/shared/utils/url';

const REGISTRATION_RESULT_KEY = '__hoyo_checkin_registration_result';

export default function App() {
  const { isTooltipShow } = useContext(ToggleTooltipContext);
  const queryClient = useQueryClient();
  const [registrationResult] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(REGISTRATION_RESULT_KEY);
    if (stored) {
      sessionStorage.removeItem(REGISTRATION_RESULT_KEY);
      try {
        return JSON.parse(stored).count ?? null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const { data: loginStatus } = useQuery({
    ...loginStatusQuery(queryClient),
  });

  if (!isTooltipShow) {
    return null;
  }

  if (registrationResult !== null) {
    return <AddedAccountCard count={registrationResult} />;
  }

  if (!hasRegistrationFlag()) {
    return <RegistrationPrompt />;
  }

  if (loginStatus === 'login') {
    return <LoginUserTooltip />;
  }
  if (loginStatus === 'logout') {
    return <LogoutUserTooltip />;
  }
  return null;
}
