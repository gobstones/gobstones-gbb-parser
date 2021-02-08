import { describe, expect, it } from '@jest/globals';

import helpers from '../src/grammar/nearly-helper';

describe('nearly-helpers', () => {
    describe('id', () => {
        it('should return a function that returns the first element of an array', () => {
            expect(helpers.id()(['a', 'b', 'c', 'd', 'e'])).toBe('a');
        });
    });
    describe('null', () => {
        it('should return a function that returns null', () => {
            // eslint-disable-next-line no-null/no-null
            expect(helpers.null()(['a', 'b', 'c', 'd', 'e'])).toBe(null);
        });
    });
    describe('array', () => {
        it('should return a function that takes an array and return the specified elements', () => {
            expect(helpers.array([0, 1, 3])(['a', 'b', 'c', 'd', 'e'])).toStrictEqual([
                'a',
                'b',
                'd'
            ]);
        });
    });
    describe('object', () => {
        it(
            'should return a function that takes an array and ' +
                ' returns an object with the values in the specified keys',
            () => {
                expect(helpers.object({ a: 0, d: 3 })(['a', 'b', 'c', 'd', 'e'])).toStrictEqual({
                    a: 'a',
                    d: 'd'
                });
            }
        );
    });
});
