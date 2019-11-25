'use strict;';
// var expect = require('chai').expect;
// var assert = require('chai').assert;

// describe('ProPlayer', () => {
//     it('...should exist', () => {
//         var PP = require('../--js-ProPlayer.js');
//         expect(PP).to.not.be.undefined;
//     });
//     describe('beginFetchPackageData', () => {
//         it('...should fetch package data and set PP values', () => {});
//     });
// });
describe('pow', function() {
    function pow(x, n) {
        if (n < 0) return NaN;
        if (Math.round(n) != n) return NaN;

        let result = 1;

        for (let i = 0; i < n; i++) {
            result *= x;
        }

        return result;
    }

    function makeTest(x) {
        let expected = x * x * x;
        it(`${x} in the power 3 is ${expected}`, function() {
            assert.equal(pow(x, 3), expected);
        });
    }
    it('for negative n the result is NaN', function() {
        assert.isNaN(pow(2, -1));
    });

    it('for non-integer n the result is NaN', function() {
        assert.isNaN(pow(2, 1.5));
    });
    describe('raises x to the power of 3', () => {
        for (let x = 1; x <= 5; x++) {
            makeTest(x);
        }
    });
});