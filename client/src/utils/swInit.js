function listenForWaitingServiceWorker(reg, callback) {
  function awaitStateChange() {
    reg.installing.addEventListener('statechange', function () {
      if (this.state === 'installed') callback(reg);
    });
  }
  if (!reg) return;
  if (reg.waiting) return callback(reg);
  if (reg.installing) awaitStateChange();
  reg.addEventListener('updatefound', awaitStateChange);
}

function promptUserToRefresh(registration) {
  // this is just an example
  // don't use window.confirm in real life; it's terrible
  // if (window.confirm('New version available! OK to refresh?')) {
  console.log('=> New version available!');
  registration.waiting.postMessage('skipWaiting');
  console.log('=> New version activated.');
  // }
}

const swInit = () => {
  if ('serviceWorker' in navigator) {
    
    // registering service worker
    navigator.serviceWorker.register('/locations/sw.js').then(
      function (registration) {
        console.log(
          'Service Worker registration successful with scope: ',
          registration.scope
        );

        // reload once when the new Service Worker starts activating
        var refreshing;
        // When the user asks to refresh the UI, we'll need to reload the window
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          function () {
            // prevent infinite refresh loop when you use "Update on Reload"
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
          }
        );

        listenForWaitingServiceWorker(registration, promptUserToRefresh);
      },
      function (err) {
        console.log('Service Worker registration failed: ', err);
      }
    );
  }
};

export default swInit;
