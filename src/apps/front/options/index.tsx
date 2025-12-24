import { createRoot } from 'react-dom/client';
import '@front/external/assets/global.css';
import '@src/shared/i18n';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@front/shared/queryClient';
import { SelectedGameActIdProvider } from '@front/options/provider/selectedGameActId';
import { OptionRoutes } from '@front/options/routes';
import { ThemeProvider } from '@front/options/provider/themeProvider';
import { ga } from '@src/shared/ga';
ga.init('option');
function init() {
  const appContainer = document.querySelector('#app');
  if (!appContainer) {
    throw new Error('Can not find #app');
  }
  const root = createRoot(appContainer);
  root.render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SelectedGameActIdProvider>
          <OptionRoutes />
        </SelectedGameActIdProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

init();
