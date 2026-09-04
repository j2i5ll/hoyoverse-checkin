import { createRoot } from 'react-dom/client';
import '@front/external/assets/global.css';
import '@src/shared/i18n';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@front/shared/queryClient';
import { TooltipPreviewApp } from './TooltipPreviewApp';

// Polyfill chrome APIs for standalone browser preview
if (typeof window !== 'undefined') {
  if (!window.chrome) {
    (window as any).chrome = {};
  }
  if (!window.chrome.storage) {
    (window as any).chrome.storage = {
      local: {
        get: async () => ({}),
        set: async () => {},
        remove: async () => {},
      },
      sync: {
        get: async () => ({}),
        set: async () => {},
        remove: async () => {},
      },
    };
  }
  if (!window.chrome.runtime) {
    (window as any).chrome.runtime = {
      sendMessage: async (msg: any) => {
        console.log('[Mock chrome.runtime.sendMessage]', msg);
        return { code: 'success', data: {} };
      },
      onMessage: {
        addListener: () => {},
        removeListener: () => {},
      },
    };
  }
}

const rootElement = document.getElementById('preview-root');
if (rootElement) {
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <TooltipPreviewApp />
    </QueryClientProvider>,
  );
}
