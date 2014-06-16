"use strict";

importScripts("polyfills/idbCacheUtils.js");
importScripts("polyfills/fetchPolyfill.js");
importScripts("polyfills/cachePolyfill.js");
importScripts("polyfills/idbCacheStoragePolyfill.js");

this.addEventListener("install", function(e) {
  e.waitUntil(caches.create("core"));
  // FIXME: Pre-populate cache for Topeka
});

var fontStaticOrigin = "http://fonts.gstatic.com";

this.addEventListener("fetch", function(e) {
  var request = e.request;

  if (this.scope.indexOf(request.origin) == -1 &&
      request.origin != fontStaticOrigin) {
    return;
  }

  // Basic read-through caching.
  e.respondWith(
    caches.match(request, "core").then(
      function(response) {
        return response;
      },
      function() {
        // we didn't have it in the cache, so add it to the cache and return it
        return caches.get("core").then(
          function(core) {
            // FIXME(slighltyoff): add should take/return an array
            return core.add(request).then(
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