"use strict";

importScripts("polyfills/idbCacheUtils.js");
importScripts("polyfills/fetchPolyfill.js");
importScripts("polyfills/cachePolyfill.js");
importScripts("polyfills/idbCacheStoragePolyfill.js");

var debug = false;

this.addEventListener("install", function(e) {
  e.waitUntil(caches.create("core"));
});

this.addEventListener("fetch", function(e) {
  console.log(e.request.url);

  // If it's off-origin, don't try to cache.
  if (this.scope.indexOf(e.request.origin) == -1) {
    debug && console.log("  is off-origin, bailing");
    return;
  }

  // Basic read-through caching.
  e.respondWith(
    caches.match(e.request, "core").then(
      function(response) {
        debug && console.log("  served from cache");
        return response;
      },
      function() {
        // we didn't have it in the cache, so add it to the cache and return it
        debug && console.log("  not in cache");
        return caches.get("core").then(
          function(core) {
            return core.add(e.request).then(
              function(response) {
                debug && console.log("  served from network and cached");
                return response;
              }
            );
          }
        );
      }
    )
  );
});