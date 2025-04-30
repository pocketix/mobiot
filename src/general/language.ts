
let currentLang: LangCode = 'en';

export type LangCode = 'en' | 'cs';

export const translations: Record<LangCode, Record<string, string>> = {
  en: {
    manualFactors: 'Manual Factors',
    save: 'Save',
    back: 'Back',
    chooseLanguage: 'Choose language:'
  },
  cs: {
    manualFactors: 'Manuální Faktory',
    save: 'Uložit',
    back: 'Zpět',
    chooseLanguage: 'Zvol jazyk:'
  }
};

export function transl(key: string): string {
    return translations[currentLang][key] || key;
  }

  export function setLang(lang: LangCode) {
    currentLang = lang;
  }

  export function getLang(): LangCode {
    return currentLang;
  }
  