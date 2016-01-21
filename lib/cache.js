'use strict';

var LRU = require('lru-cache'),
    debug = require('debug')('lru-backup-cache'),
    cacheOptions = {
        max: 100,
        maxAge: 30 * 60 * 1000     //30 min TTL
    },
    backupCacheOptions = {
        max: 200,                  //2x backup cache size
        maxAge: 120 * 60 * 1000    //4x backup max age
    };

/*
 * Cache based on LRU Cache - https://github.com/isaacs/node-lru-cache
 * Has a backup cache with 4x maxAge
 */
function Cache(options) {
    options = options || {};
    options.enabled = (typeof options.enabled === 'boolean' && options.enabled === false) ? false : true;
    this._init(options);
}

Cache.prototype._init = function (options) {
    cacheOptions.max = options.max || cacheOptions.max;
    cacheOptions.maxAge = options.maxAge || cacheOptions.maxAge;
    backupCacheOptions.max = Math.max(backupCacheOptions.max, cacheOptions.max * 2);
    backupCacheOptions.maxAge = Math.max(backupCacheOptions.maxAge, cacheOptions.maxAge * 4);
    cacheOptions.dispose = this._mainCacheDispose.bind(this);

    if (options.enabled) {
        debug('initializing cache');
        this._cache = new LRU(cacheOptions);
        this._backupCache = new LRU(backupCacheOptions);
    } else {
        this._cache = null;
        this._backupCache = null;
    }
};

Cache.prototype._mainCacheDispose = function (key, value) {
    this.setBackup(key, value);
};

Cache.prototype.get = function (key) {
    debug('get:' + key);
    return this._cache && this._cache.get(key);
};

Cache.prototype.set = function (key, value) {
    debug('set:' + key);
    this._cache && this._cache.set(key, value);
    this._backupCache && this._backupCache.del(key);
};

Cache.prototype.getBackup = function (key) {
    debug('getBackup:' + key);
    return this._backupCache && this._backupCache.get(key);
};

Cache.prototype.setBackup = function (key, value) {
    debug('setBackup:' + key);
    this._backupCache && this._backupCache.set(key, value);
};

Cache.prototype.reset = function () {
    debug('reset');
    this._cache && this._cache.reset();
    this._backupCache && this._backupCache.reset();
};

module.exports = Cache;
