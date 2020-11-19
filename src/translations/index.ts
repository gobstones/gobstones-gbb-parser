import flat from 'flat';
import { Locale } from './translation';

/* Added locales should be imported and added to the translation object */
import { en } from './en';
import { es } from './es';

export const translations = { en, es };
// You may change the default locale
export const defaultLocale = 'en';

// Here onwards everything is created based on the above definition
export type LocaleName = keyof typeof translations;

export const availableLocales = Object.keys(translations);

export class Translation {
    private currentLocale: Locale;
    private currentLocaleName: LocaleName;
    private flatten: boolean;
    public constructor(language: LocaleName, flatten = false) {
        this.flatten = flatten;
        this.setLanguage(language);
    }
    public setLanguage(language: LocaleName): void {
        this.currentLocaleName = language;
        this.currentLocale = this.flatten
            ? flat(translations[this.currentLocaleName])
            : translations[this.currentLocaleName];
    }
    public translate(key: string, interpolations?: Record<string, any>): string {
        let value = this.currentLocale[key];
        if (!value) return key;
        for (const each in interpolations || []) {
            value = value.replace(`\${${each}}`, `${interpolations[each]}`);
        }
        return value;
    }
}

export const intl = new Translation(defaultLocale, true);
