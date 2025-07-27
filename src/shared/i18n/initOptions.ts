import translations from './translations';
import { InitOptions } from 'i18next';
const getLangCode = () => {
  const browserLocale = navigator.language;
  const langCode = browserLocale.split('-')[0].toLowerCase();
  return langCode;
};
export const I18N_INIT_OPTIONS: InitOptions = {
  resources: translations,
  nsSeparator: false,
  fallbackLng: 'en',
  lng: getLangCode(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
  // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
  // if you're using a language detector, do not define the lng option

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
};
