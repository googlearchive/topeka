/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

"use strict";

var log = console.log.bind(console);
var err = console.error.bind(console);
this.onerror = err;

// Moves the contents of one named cached into another.
var cacheCopy = function(source, destination) {
  return caches.delete(destination).then(function() {
    return Promise.all([
      caches.open(source),
      caches.open(destination)
    ]).then(function(results) {
      var sourceCache = results[0];
      var destCache = results[1];

      return sourceCache.keys().then(function(requests) {
        return Promise.all(requests.map(function(request) {
          return sourceCache.match(request).then(function(response) {
            return destCache.put(request, response);
          });
        }));
      });
    });
  });
}

var fetchAndCache = function(request, cache) {
  if (!(request instanceof Request)) {
    request = new Request(request);
  }

  return fetch(request.clone()).then(function(response) {
    cache.put(request, response.clone());
    return response;
  });
};

var baseUrl = (new URL("./", this.location.href) + "");
// TODO: This is necessary to handle different implementations in the wild
// The spec defines self.registration, but it was not implemented in Chrome 40.
var scope;
if (self.registration) {
  scope = self.registration.scope;
} else {
  scope = self.scope || baseUrl;
}

this.addEventListener("install", function(e) {
  // Put updated resources in a new cache, so that currently running pages
  // get the current versions.
  e.waitUntil(caches.delete("core-waiting").then(function() {
    return caches.open("core-waiting").then(function(core) {
      var resourceUrls = [
        "",
        "?offline",
        "build.html",
        "build.js",
        "components/topeka-elements/",
        "components/topeka-elements/categories.json",
        "components/topeka-elements/images/splash.svg",
        "favicon.ico",
        "icons/icon-196.png",
        "images/splash.svg",
        "leaderboard.html",
        "polyfills/fonts/fonts.css",
        "polyfills/fonts/roboto.html",
        "polyfills/fonts/RobotoDraft-Black.woff2",
        "polyfills/fonts/RobotoDraft-Bold.woff2",
        "polyfills/fonts/RobotoDraft-BoldItalic.woff2",
        "polyfills/fonts/RobotoDraft-Light.woff2",
        "polyfills/fonts/RobotoDraft-Medium.woff2",
        "polyfills/fonts/RobotoDraft-Regular.woff2",
        "polyfills/fonts/RobotoDraft-Thin.woff2",
        "theme.css",
      ];

      return Promise.all(resourceUrls.map(function(relativeUrl) {
        return fetchAndCache(baseUrl + relativeUrl, core);
      }));
    });
  }));
});


this.addEventListener("activate", function(e) {
  // Copy the newly installed cache to the active cache
  e.waitUntil(cacheCopy("core-waiting", "core"));
});

this.addEventListener("fetch", function(e) {
  var request = e.request;

  if (request.url.indexOf(scope) === -1) {
    return;
  }

  // Basic read-through caching.
  e.respondWith(
    caches.open("core").then(function(core) {
      return core.match(request).then(function(response) {
        if (response) {
          return response;
        }

        // we didn't have it in the cache, so add it to the cache and return it
        log("runtime caching:", request.url);

        return fetchAndCache(request, core);
      });
    })
  );
});
