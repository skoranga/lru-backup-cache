lru-backup-cache
================

[lru-cache](https://github.com/isaacs/node-lru-cache) wrapper with backup cache.

Cache module to take care of keeping a backup copy after key from the main cache is disposed off. Typical use case is to cache service response or any other data and in case of service failure, provide fallback to old value even after copy is disposed off from main cache.

Backup cache will only contain the values which are disposed off from main cache and again when you set the new value in cache, the backup cache will be cleaned off.

#### Example

```javascript
    var Cache = require('lru-backup-cache');

    ....
    var cacheOptions = {
        enabled: true,       //By default true
        max: 1000,           //Max cache size
        maxAge: 1800 * 1000  //Max Age (in msec)
    };

    var cache = new Cache(cacheOptions);
    cache.set('foo', 'foo');
    console.log(cache.get('foo'));
```

Refer https://github.com/isaacs/node-lru-cache#options for more cacheOptions.
