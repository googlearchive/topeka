// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A simple, incomplete implementation of Fetch, intended to facilitate end
// to end serviceworker testing.

// See http://fetch.spec.whatwg.org/#fetch-method

(function (global) {
    var _castToRequest = function (item) {
        if (typeof item === 'string') {
            item = new Request({
                url: item
            });
        }
        return item;
    };

    // FIXME: Support init argument to fetch.
    var fetch = function(request) {
        request = _castToRequest(request);

        return new Promise(function(resolve, reject) {
            // FIXME: Use extra headers from |request|.
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.open(request.method, request.url, true /* async */);
            xhr.send(null);
            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;

                var headers = new HeaderMap();
                // FIXME: Fill out response.headers.
                headers.set("Content-Type",
                            xhr.getResponseHeader("Content-Type"));
                var response = new Response(xhr.response ,{
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headers,
                    // FIXME: Set response.method when available.
                    // FIXME: Set response.url when available.
                    // FIXME: Set response.body when available.
                });

                if (xhr.status === 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            };
        });
    };

    if (global.fetch.toString() != "function toString() { [native code] }") {
        global.fetch = fetch;
    }
}(self));  // window or worker global scope
