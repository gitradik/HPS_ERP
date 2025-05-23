import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import deutsche from 'src/utils/languages/de.json';
import latvian from 'src/utils/languages/lt.json';

const resources = {
  de: {
    translation: deutsche,
  },
  lt: {
    translation: latvian,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'de',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
