const version = 1;
const blogApiCacheName = `api-cache-${version}`;
const swHeaderName = 'x-sw-api-fetched-on';

// List of url which you want to be cached
const reqUrls = ['/locations/v1/search']

const originArray = [
  'http://localhost:3000',
  'https://www.usbank.com'
]

/**
 * @description : method to check if req origin is part of whitelisted origins
 * @param {*} origin : string
 * @returns : Boolean
 */
const checkOrigin = (origin) => originArray.includes(origin);

/**
 * Check if cached API data is still valid
 * @param  {Object}  response The response object
 * @return {Boolean}          If true, cached data is valid
 */
const isValid = function (response) {
  if (!response) return false;
  var fetched = response.headers.get(swHeaderName);
  // Checking response is valid for 2 hours only
  return !!(fetch && parseFloat(fetched) + 1000 * 60 * 60 * 2 > new Date().getTime());
};

const inRequestUrl = (event) => {
  const urlMatched = reqUrls.find((urlStr) => {
    return event.request.url.includes(urlStr);
  });
  return urlMatched ?? false;
}

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
  if (inRequestUrl(event)) {
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
            return Promise.resolve(cacheRes);
          }

          // Otherwise, cache missed and make a fresh API call
          console.log(`MISSING CACHE ${event.request.url}`);
          return fetch(event.request).then(function (response) {
            console.log(`MAKING FRESH CALL ${event.request.url}`);
            console.log(`MAKING FRESH CALL RES => ${response}`);
            // Cache for offline access
            const copy = response.clone();
            event.waitUntil(
              caches.open(blogApiCacheName).then(function (cache) {
                const headers = new Headers(copy.headers);
                headers.append(swHeaderName, new Date().getTime());
                return copy.blob().then(function (body) {

                  // skip caching of response if status code other then 200.
                  // Skipping all error scenarios.
                  if(response.status !== 200) {
                    return;
                  }

                  // Storing cached data
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
  if(!checkOrigin(messageEvent.origin)) {
    return;
  }
  
  // return skip waiting to refresh cache
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});
