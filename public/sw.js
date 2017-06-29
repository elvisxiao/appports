var CACHE_NAME = 'appports-cache';

// 缓存
self.addEventListener('fetch', function (evt) {
    evt.respondWith(
        caches.match(evt.request).then(function(response) {
            if (response) {
                return response;
            }
            var request = evt.request.clone();
            return fetch(request).then(function (response) {
                if (!response && response.status !== 200) {
                    return response;
                }
                if(response && response.headers && response.headers.get('Content-type') && response.headers.get('Content-type').match(/javascript/)) {
                    var responseClone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(evt.request, responseClone);
                    });
                }
                return response;
            });
        })
    )
});
