const assert = require('chai').assert;
const ItSoundsNovel = require('../index.js');

describe('ItSoundsNovel', function () {
    describe('Scenario', function () {
        it('should have Scenario module', function () {
            assert.property(ItSoundsNovel, 'Scenario');
        });
    });
});
