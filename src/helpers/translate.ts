import flat from 'flat';
import { Locale, defaultLocale } from '../translations';

let currentLang: Locale = defaultLocale;
let currentLocale: any = {};

export const setLanguage = (lang: Locale): void => {
    currentLang = lang;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    currentLocale = flat(require(`../translations/${currentLang}.json`));
};

export const intl = (key: string, placeholders?: Record<string, string>): string => {
    let value = currentLocale[key];
    if (!value) return key;
    if (placeholders) {
        for (const each in placeholders) {
            value = value.replace(`\${${each}}`, placeholders[each]);
        }
    }
    return value;
};

setLanguage(defaultLocale);
