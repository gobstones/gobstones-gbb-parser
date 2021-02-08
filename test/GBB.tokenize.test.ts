import { describe, expect, it } from '@jest/globals';

import { given } from 'jest-rspec-utils';
import { t } from './helpers';

describe('GBB.tokenize', () => {
    given('a valid grammar', () => {
        it('Returns all tokens of the element', () => {
            const tokens = t('GBB/1.0 size 3 4 head 0 1');
            expect(tokens.length).toBe(13);

            expect(tokens[0].type).toBe('version');
            expect(tokens[0].value).toBe('GBB/1.0');

            expect(tokens[1].type).toBe('whitespace');
            expect(tokens[1].value).toBe(' ');

            expect(tokens[2].type).toBe('keyword');
            expect(tokens[2].value).toBe('size');

            expect(tokens[3].type).toBe('whitespace');
            expect(tokens[3].value).toBe(' ');

            expect(tokens[4].type).toBe('number');
            expect(tokens[4].value).toBe(3);

            expect(tokens[5].type).toBe('whitespace');
            expect(tokens[5].value).toBe(' ');

            expect(tokens[6].type).toBe('number');
            expect(tokens[6].value).toBe(4);

            expect(tokens[7].type).toBe('whitespace');
            expect(tokens[7].value).toBe(' ');

            expect(tokens[8].type).toBe('keyword');
            expect(tokens[8].value).toBe('head');

            expect(tokens[9].type).toBe('whitespace');
            expect(tokens[9].value).toBe(' ');

            expect(tokens[10].type).toBe('number');
            expect(tokens[10].value).toBe(0);

            expect(tokens[11].type).toBe('whitespace');
            expect(tokens[11].value).toBe(' ');

            expect(tokens[12].type).toBe('number');
            expect(tokens[12].value).toBe(1);
        });
    });
});
