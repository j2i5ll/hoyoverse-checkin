export const getCurrentActId = () => {
  return new URL(window.location.href).searchParams.get('act_id') ?? '';
};
export const getUrlLocale = () => {
  const browserLocale = navigator.language;
  const localeSplit = browserLocale.split('-');
  if (localeSplit.length === 3) {
    localeSplit.splice(1, 1);
  }

  return localeSplit.join('-').toLowerCase();
};

export const hasRegistrationFlag = (): boolean => {
  return new URL(window.location.href).searchParams.get('h') === 'true';
};

export const buildRegistrationUrl = (): string => {
  const url = new URL(window.location.href);
  url.searchParams.set('h', 'true');
  return url.toString();
};
