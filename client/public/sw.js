const version = 1;
// let staticName = `staticCache-${version}`;
const blogApiCacheName = `blogApi-${version}`;
const swHeaderName = 'x-sw-api-fetched-on';

/**
 * Check if cached API data is still valid
 * @param  {Object}  response The response object
 * @return {Boolean}          If true, cached data is valid
 */
const isValid = function (response) {
  if (!response) return false;
  var fetched = response.headers.get(swHeaderName);
  if (
    fetched &&
    parseFloat(fetched) + 1000 * 60 * 60 * 2 > new Date().getTime()
  )
    return true;
  return false;
};

self.addEventListener('install', (ev) => {
  // service worker has been installed.
  console.log(`Version ${version} installed`);
});

self.addEventListener('activate', (ev) => {
  // when the service worker has been activated to replace an old one.
  //Extendable Event
  console.log(`version ${version} activated`);
  // delete old versions of caches.
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key != blogApiCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/posts')) {
    console.log(caches, `FETCH: request for: ${event.request.url}`);

    event.respondWith(
      (async () => {
        if (
          event.request.mode === 'navigate' &&
          event.request.method === 'GET' &&
          registration.waiting &&
          (await clients.matchAll()).length < 2
        ) {
          registration.waiting.postMessage('skipWaiting');
          return new Response('', { headers: { Refresh: '0' } });
        }

        return caches.match(event.request).then((cacheRes) => {
          // If there's a cached API and it's still valid, use it
          if (isValid(cacheRes)) {
            console.log(`VALID CACHED DATA ${event.request.url}`);
            return cacheRes;
          }

          // Otherwise, cache missed and make a fresh API call
          console.log(`MISSING CACHE ${event.request.url}`);
          return fetch(event.request).then(function (response) {
            console.log(`MAKING FRESH CALL ${event.request.url}`);
            console.log(`MAKING FRESH CALL RES => ${response}`);
            // Cache for offline access
            var copy = response.clone();
            event.waitUntil(
              caches.open(blogApiCacheName).then(function (cache) {
                var headers = new Headers(copy.headers);
                headers.append(swHeaderName, new Date().getTime());
                return copy.blob().then(function (body) {
                  return cache.put(
                    event.request,
                    new Response(body, {
                      status: copy.status,
                      statusText: copy.statusText,
                      headers: headers
                    })
                  );
                });
              })
            );

            // Return the requested file
            return response;
          });
        });
      })()
    );
  }
});

self.addEventListener('message', (messageEvent) => {
  //message from web page ev.data.
  //Extendable Event
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});
