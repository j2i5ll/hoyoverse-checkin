import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18N_INIT_OPTIONS } from './initOptions';
// https://www.i18next.com/

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(I18N_INIT_OPTIONS);

export default i18n;
