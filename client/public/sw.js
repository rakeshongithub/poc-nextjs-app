// Version of the cache
const version = 1;

// Name of the cache, including the version
const blogApiCacheName = `api-cache-${version}`;

// Name of the header for the service worker API fetch
const swHeaderName = 'x-sw-api-fetched-on';

// List of URLs to be cached
const reqUrls = ['/locations/v1/search'];

// Array of whitelisted origins
const originArray = ['http://localhost:3000', 'https://www.usbank.com'];

/**
 * Check if a cached API response is still valid
 * @param  {Object}  response The response object
 * @return {Boolean}          If true, cached data is valid
 */
const isValidResponse = (response) => {
  if (!response) return false;
  const fetched = response.headers.get(swHeaderName);
  return !!(fetched && parseFloat(fetched) + 1000 * 60 * 60 * 2 > new Date().getTime());
};

/**
 * Check if the request URL is included in the list of URLs to be cached
 * @param  {Object}  event The fetch event
 * @return {Boolean}       If true, the request URL is included in the list
 */
const isRequestUrlIncluded = (event) => reqUrls.some((url) => event.request.url.includes(url));

/**
 * Check if the origin is included in the list of whitelisted origins
 * @param  {String}  origin The origin
 * @return {Boolean}        If true, the origin is whitelisted
 */
const isOriginWhitelisted = (origin) => originArray.includes(origin);

/**
 * Handle the install event
 * @param  {Object} event The install event
 */
const handleInstall = (event) => {
  console.log(`Version ${version} installed`);
};

/**
 * Handle the activate event
 * @param  {Object} event The activate event
 */
const handleActivate = (event) => {
  console.log(`version ${version} activated`);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== blogApiCacheName).map((key) => caches.delete(key)))
    )
  );
};

/**
 * Handle the fetch event
 * @param  {Object} event The fetch event
 */
const handleFetch = (event) => {
  if (!isRequestUrlIncluded(event)) return;

  console.log(`FETCH: request for: ${event.request.url}`);

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

      const cachedResponse = await caches.match(event.request);
      if (isValidResponse(cachedResponse)) {
        console.log(`VALID CACHED DATA ${event.request.url}`);
        return cachedResponse;
      }

      console.log(`MISSING CACHE ${event.request.url}`);
      const response = await fetch(event.request);
      console.log(`MAKING FRESH CALL ${event.request.url}`);
      console.log(`MAKING FRESH CALL RES => ${response}`);

      const copy = response.clone();
      event.waitUntil(
        caches.open(blogApiCacheName).then((cache) => {
          const headers = new Headers(copy.headers);
          headers.append(swHeaderName, new Date().getTime());
          return copy.blob().then((body) => {

            // skip caching if status code is not 200
            if (response.status !== 200) {
              return;
            }

            // Caching response
            return cache.put(
              event.request,
              new Response(body, {
                status: copy.status,
                statusText: copySure,
                statusText: copy.statusText,
                headers: headers,
              })
            );
          });
        })
      );

      return response;
    })()
  );
};

/**
 * Handle the message event
 * @param  {Object} messageEvent The message event
 */
const handleMessage = (messageEvent) => {
  if (!isOriginWhitelisted(messageEvent.origin)) {
    return;
  }
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
};

// Add event listeners for the install, activate, fetch, and message events
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
self.addEventListener('message', handleMessage);
