"use strict";

importScripts("polyfills/idbCacheUtils.js");
importScripts("polyfills/fetchPolyfill.js");
importScripts("polyfills/cachePolyfill.js");
importScripts("polyfills/idbCacheStoragePolyfill.js");

this.addEventListener("install", function(e) {
  e.waitUntil(caches.create("core"));
});

this.addEventListener("fetch", function(e) {
  // If it's off-origin, don't try to cache.
  if (this.scope.indexOf(e.request.origin) == -1) {
    return;
  }

  // Basic read-through caching.
  e.respondWith(
    caches.match(e.request, "core").then(
      function(response) {
        return response;
      },
      function() {
        // we didn't have it in the cache, so add it to the cache and return it
        return caches.get("core").then(
          function(core) {
            return core.add(e.request).then(
              function(response) {
                return response;
              }
            );
          }
        );
      }
    )
  );
});