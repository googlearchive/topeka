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
  // If it's off-origin, don't try to cache.
  if (this.scope.indexOf(e.request.origin) == -1) {
    debug && console.log(e.request.url, "is off-origin, bailing");
    return;
  }

  // Map "/" to "/index.html"
  var url = e.request.url;
  if ((url+"*") == this.scope) {
    url = url+"index.html";
  }

  // Basic read-through caching.
  e.respondWith(new Promise(function(resolve, reject) {
    caches.match(url, "core").then(
      function(response) {
        debug && console.log(url, "served from cache");
        resolve(response);
      },
      function() {
        // we didn't have it in the cache, so add it to the cache and return it
        caches.get("core").then(function(core) {
          core.add(e.request).then(function(response) {
            debug && console.log(url, "served from network and cached");
            resolve(response);
          });
        }
      );
    });
  }));
});