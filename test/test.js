'use strict';

var assert = require('assert'),
    Cache = require('../index');

describe('Cache', function () {

    it('should get the value from backup cache once main cache is rolled over', function () {
        var cacheOptions = {
            max: 5
        };
        var cache = new Cache(cacheOptions);

        for (var i = 0; i < cacheOptions.max + 1; i++) {
            cache.set('key_' + i, 'value_' + i);
        }
        assert.ok(!cache.get('key_0'));
        assert.ok(cache.getBackup('key_0'));

        cache.set('key_0', 'new_value_0');
        assert.ok(cache.get('key_0'));
        assert.ok(!cache.getBackup('key_0'));

    });
});
