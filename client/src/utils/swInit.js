/**
 * Listen for a service worker in a 'waiting' state.
 * @param {ServiceWorkerRegistration} reg - The service worker registration object.
 * @param {Function} callback - The callback function to run when the service worker is waiting.
 */
function listenForWaitingServiceWorker(reg, callback) {
  const awaitStateChange = () => {
    reg.installing.addEventListener('statechange', function () {
      if (this.state === 'installed') callback(reg);
    });
  };

  if (!reg) return;
  if (reg.waiting) return callback(reg);
  if (reg.installing) awaitStateChange();
  reg.addEventListener('updatefound', awaitStateChange);
}

/**
 * Prompt the user to refresh the page when a new service worker is installed.
 * @param {ServiceWorkerRegistration} registration - The service worker registration object.
 */
function promptUserToRefresh(registration) {
  console.log('=> New version available!');
  registration.waiting.postMessage('skipWaiting');
  console.log('=> New version activated.');
}

/**
 * Initialize the service worker.
 */
const swInit = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/locations/sw.js').then(
      (registration) => {
        console.log('Service Worker registration successful with scope: ', registration.scope);

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });

        listenForWaitingServiceWorker(registration, promptUserToRefresh);
      },
      (err) => {
        console.log('Service Worker registration failed: ', err);
      }
    );
  }
};

export default swInit;
