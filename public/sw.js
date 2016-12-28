var CACHE_NAME = 'appports-cache';
var urlsToCache = [
  	'/',
  	'/js/jquery.min.js',
  	'/datepicker.js',
  	'/img/index-3.jpg'
];

self.addEventListener('install', function(event) {
  	// Perform install steps
  	event.waitUntil(
    	caches.open(CACHE_NAME).then(function(cache) {
        		console.log('Opened cache');
        	return cache.addAll(urlsToCache);
      	})
  	);
});

// 缓存
self.addEventListener('fetch', function (evt) {
    evt.respondWith(
        caches.match(evt.request).then(function(response) {
            if (response) {
                return response;
            }
            var request = evt.request.clone();
            return fetch(request).then(function (response) {
                if (!response && response.status !== 200 && !response.headers.get('Content-type').match(/image/)) {
                    return response;
                }
                var responseClone = response.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(evt.request, responseClone);
                });
                return response;
            });
        })
    )
});