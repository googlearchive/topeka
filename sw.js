"use strict";

importScripts("polyfills/idbCacheUtils.js");
importScripts("polyfills/fetchPolyfill.js");
importScripts("polyfills/idbCachePolyfill.js");
importScripts("polyfills/idbCacheStoragePolyfill.js");

var baseUrl = this.scope.split("*")[0];

this.addEventListener("install", function(e) {
  e.waitUntil(caches.create("core"));
  // FIXME: Pre-populate cache for Topeka
  /*
  Requested resources:
    /
    /categories.json
    /components/core-ajax/core-ajax.html
    /components/core-ajax/core-xhr.html
    /components/core-animated-pages/core-animated-pages.css
    /components/core-animated-pages/core-animated-pages.html
    /components/core-animated-pages/transitions/core-transition-pages.html
    /components/core-animated-pages/transitions/cross-fade.html
    /components/core-animated-pages/transitions/hero-transition.html
    /components/core-animated-pages/transitions/scale-up.html
    /components/core-animated-pages/transitions/slide-down.html
    /components/core-animated-pages/transitions/slide-up.html
    /components/core-animated-pages/transitions/tile-cascade.html
    /components/core-drawer-panel/core-drawer-panel.css
    /components/core-drawer-panel/core-drawer-panel.html
    /components/core-icon/core-icon.css
    /components/core-icon/core-icon.html
    /components/core-icons/core-icons.html
    /components/core-icons/iconsets/av-icons.html
    /components/core-icons/iconsets/icons.html
    /components/core-icons/iconsets/social-icons.html
    /components/core-iconset-svg/core-iconset-svg.html
    /components/core-iconset/core-iconset.html
    /components/core-input/core-input.css
    /components/core-input/core-input.html
    /components/core-media-query/core-media-query.html
    /components/core-meta/core-meta.html
    /components/core-range/core-range.html
    /components/core-scroll-header-panel/core-scroll-header-panel.css
    /components/core-scroll-header-panel/core-scroll-header-panel.html
    /components/core-selection/core-selection.html
    /components/core-selector/core-selector.html
    /components/core-style/core-style.html
    /components/core-toolbar/core-toolbar.css
    /components/core-toolbar/core-toolbar.html
    /components/core-transition/core-transition.html
    /components/firebase-element/firebase-element.html
    /components/firebase-element/firebase-import.html
    /components/firebase-element/firebase-login.html
    /components/firebase-element/firebase-simple-login-import.html
    /components/firebase-simple-login/firebase-simple-login.js
    /components/firebase/firebase.js
    /components/paper-button/paper-button.css
    /components/paper-button/paper-button.html
    /components/paper-checkbox/paper-checkbox.css
    /components/paper-checkbox/paper-checkbox.html
    /components/paper-fab/paper-fab.css
    /components/paper-fab/paper-fab.html
    /components/paper-focusable/paper-focusable.html
    /components/paper-icon-button/paper-icon-button.css
    /components/paper-icon-button/paper-icon-button.html
    /components/paper-input/error-200.png
    /components/paper-input/paper-input.css
    /components/paper-input/paper-input.html
    /components/paper-item/paper-item.css
    /components/paper-item/paper-item.html
    /components/paper-progress/paper-progress.css
    /components/paper-progress/paper-progress.html
    /components/paper-radio-button/paper-radio-button.css
    /components/paper-radio-button/paper-radio-button.html
    /components/paper-ripple/paper-ripple.html
    /components/paper-shadow/paper-shadow.css
    /components/paper-shadow/paper-shadow.html
    /components/paper-slider/paper-slider.css
    /components/paper-slider/paper-slider.html
    /components/paper-toggle-button/paper-toggle-button.css
    /components/paper-toggle-button/paper-toggle-button.html
    /components/platform/platform.js
    /components/platform/platform.js.map
    /components/polymer/layout.html
    /components/polymer/polymer.html
    /components/polymer/polymer.js
    /components/polymer/polymer.js.map
    /components/topeka-elements/avatars.html
    /components/topeka-elements/category-icons.html
    /components/topeka-elements/category-images.html
    /components/topeka-elements/images/splash.svg
    /components/topeka-elements/templates/topeka-quiz-alpha-picker.html
    /components/topeka-elements/templates/topeka-quiz-fill-blank.html
    /components/topeka-elements/templates/topeka-quiz-fill-two-blanks.html
    /components/topeka-elements/templates/topeka-quiz-four-quarter.html
    /components/topeka-elements/templates/topeka-quiz-multi-select.html
    /components/topeka-elements/templates/topeka-quiz-picker.html
    /components/topeka-elements/templates/topeka-quiz-single-select-item.html
    /components/topeka-elements/templates/topeka-quiz-single-select.html
    /components/topeka-elements/templates/topeka-quiz-toggle-translate.html
    /components/topeka-elements/templates/topeka-quiz-true-false.html
    /components/topeka-elements/theme.css
    /components/topeka-elements/topeka-app.css
    /components/topeka-elements/topeka-app.html
    /components/topeka-elements/topeka-categories.css
    /components/topeka-elements/topeka-categories.html
    /components/topeka-elements/topeka-category-front-page.html
    /components/topeka-elements/topeka-category-themes.css
    /components/topeka-elements/topeka-category.css
    /components/topeka-elements/topeka-category.html
    /components/topeka-elements/topeka-datasource.html
    /components/topeka-elements/topeka-leaderboard.html
    /components/topeka-elements/topeka-profile.html
    /components/topeka-elements/topeka-quiz-base.html
    /components/topeka-elements/topeka-quiz-score.html
    /components/topeka-elements/topeka-quiz-view.html
    /components/topeka-elements/topeka-quizzes.css
    /components/topeka-elements/topeka-quizzes.html
    /components/topeka-elements/topeka-status-bar.html
    /components/topeka-elements/topeka-user-score.css
    /components/topeka-elements/topeka-user-score.html
    /images/splash.svg
    /polyfills/fonts/fonts.css
    /polyfills/fonts/Roboto2-Li
    /polyfills/fonts/Roboto2-Medium.woff2
    /polyfills/fonts/Roboto2-Thin.woff2
    /polyfills/fonts/roboto2.html
    /theme.css
});

this.addEventListener("fetch", function(e) {
  var request = e.request;

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
            console.log(request.url);
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