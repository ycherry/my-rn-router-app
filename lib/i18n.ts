import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// @ts-ignore
import en from '../locales/en.json';
// @ts-ignore
import zh from '../locales/zh.json';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 设置默认语言为中文
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'i', 'p', 'span'],
    },
  })
  .then(() => {
    console.log('i18n initialized');
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;
