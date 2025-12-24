import { BrowserClient, defaultStackParser, EventHint, getDefaultIntegrations, makeFetchTransport, Scope, SeverityLevel } from '@sentry/browser';

const scope = new Scope();
export const initSentry = () => {
  const manifest = chrome.runtime.getManifest()

  const integrations = getDefaultIntegrations({}).filter(
    (defaultIntegration) => {
      return !["BrowserApiErrors", "Breadcrumbs", "GlobalHandlers"].includes(
        defaultIntegration.name
      );
    }
  );

  const client = new BrowserClient({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: integrations,
    release: manifest.version,
  });

  scope.setClient(client);
  client.init(); // 클라이언트를 scope에 설정한 후 초기화
}
export const captureException = (exception: unknown, hint?: EventHint) => {
  scope.captureException(exception, hint)
}

export const captureMessage = (message: string, level?: SeverityLevel, hint?: EventHint) => {
  scope.captureMessage(message, level, hint)
}