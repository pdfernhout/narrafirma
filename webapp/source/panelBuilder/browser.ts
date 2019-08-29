import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// launchApplication function inspired by: http://stackoverflow.com/questions/528671/javascript-window-open-only-if-the-window-does-not-already-exist
var openedWindows = {};

export function launchApplication(url, windowName) {
    var openedWindowInfo = openedWindows[windowName];
    if (openedWindowInfo && ! openedWindowInfo.window.closed) {
        if (openedWindowInfo.url !== url) {
            openedWindowInfo.window.location.replace(url);
        }
    }
    if (typeof openedWindowInfo === 'undefined' || openedWindowInfo.window.closed) {
        var openedWindow = window.open(url, windowName, "");
        openedWindowInfo = {window: openedWindow, url: url};
        openedWindows[windowName] = openedWindowInfo;
    } else {
        openedWindowInfo.window.focus();
    }
}
