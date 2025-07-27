import { createRoot } from 'react-dom/client';
import App from '@src/apps/front/content/tooltip/app';
import globalInjectedStyle from '@front/external/assets/global.css?inline';
// import injectedStyle from './index.css?inline';
import { ToggleTooltipProvider } from './provider/toggleTooltip';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@front/shared/queryClient';
import { ga } from '@src/shared/ga';

const root = document.createElement('div');
root.id = 'hoyoverse-checkin-tooltip-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });
shadowRoot.appendChild(rootIntoShadow);

const styleElement = document.createElement('style');
styleElement.innerHTML = globalInjectedStyle; // + injectedStyle;
shadowRoot.appendChild(styleElement);
ga.init('tooltip');
createRoot(rootIntoShadow).render(
  <QueryClientProvider client={queryClient}>
    <ToggleTooltipProvider>
      <App />
    </ToggleTooltipProvider>
  </QueryClientProvider>,
);
