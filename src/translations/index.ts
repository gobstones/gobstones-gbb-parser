import { Locale } from './Locale';
import { Translator } from '@gobstones/gobstones-core';
/* Added locales should be imported and added to the Translator object */
import { en } from './en';
import { es } from './es';

export const availableLocales = { en, es };

export const intl = new Translator<Locale>(availableLocales, 'en');
