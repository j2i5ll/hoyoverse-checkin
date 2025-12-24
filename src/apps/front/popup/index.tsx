import { createRoot } from 'react-dom/client';
import '@front/external/assets/global.css';
import './index.css';
import '@src/shared/i18n';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@front/shared/queryClient';
import PopupRoutes from '@front/popup/routes';
import { ThemeProvider } from '@front/options/provider/themeProvider';
import { ga } from '@src/shared/ga';

ga.init('popup');
async function init() {
  const appContainer = document.querySelector('#app');
  if (!appContainer) {
    throw new Error('Can not find #app');
  }

  const root = createRoot(appContainer);
  root.render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PopupRoutes />
      </ThemeProvider>
    </QueryClientProvider>,
  );
  await chrome.action.setBadgeText({ text: '' });
}

init();
