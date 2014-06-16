"use strict";

importScripts("polyfills/idbCacheUtils.js");
importScripts("polyfills/fetchPolyfill.js");
importScripts("polyfills/cachePolyfill.js");
importScripts("polyfills/idbCacheStoragePolyfill.js");

this.addEventListener("install", function(e) {
  e.waitUntil(caches.create("core"));
});


this.addEventListener("fetch", function(e) {
  var request = e.request;

  /*
  var baseUrl = this.scope.split("*")[0];
  // If it's a request for the base font CSS file, redirect the request
  // to the local copy
  if (request.url.indexOf("http://fonts.googleapis.com/css") == 0) {
    // e.redirectTo() isn't implemented yet
    var headers = new HeaderMap();
    headers.set("Location", baseUrl+"polyfills/fonts/fonts.css");
    var r = new Response(null, {
      status: 302,
      statusText: "Found",
      headers: headers,
    });
    e.respondWith(r);
    return;
  }
  */

  // If it's off-origin, don't try to cache.
  if (this.scope.indexOf(request.origin) == -1) {
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