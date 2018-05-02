const assert = require('chai').assert;
const VisualNovel = require('../index.js');

describe('VisualNovel', function () {
    describe('Scenario', function () {
        it('should have Scenario module', function () {
            assert.property(VisualNovel, 'Scenario');
        });
    });
});
