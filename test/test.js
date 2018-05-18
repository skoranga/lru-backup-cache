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

    it('should resize the cache when max or maxAge changes', function (done) {
        var cacheOptions = {
            max: 5,
            maxAge: 100
        };
        var cache = new Cache(cacheOptions);

        for (var i = 0; i < cacheOptions.max; i++) {
            cache.set('key_' + i, 'value_' + i);
        }

        // reset max, so the first key set should no longer be available
        // except in the backup
        cache.max = 4;
        assert.ok(!cache.get('key_0'));
        assert.ok(cache.getBackup('key_0'));

        // changing maxAge only affects new items, not old ones
        // so we need to add a new one to test it
        cache.maxAge = 50;
        cache.set('gonna be gone', 'soon');

        // wait for them to expire
        setTimeout(function () {
            assert.ok(!cache.get('gonna be gone'));
            assert.ok(cache.getBackup('gonna be gone'));
            done();
        }, 100);
    });
});
