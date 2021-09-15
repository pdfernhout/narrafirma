import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// launchApplication function inspired by: http://stackoverflow.com/questions/528671/javascript-window-open-only-if-the-window-does-not-already-exist
const openedWindows = {};

export function launchApplication(url, windowName) {
    let openedWindowInfo = openedWindows[windowName];
    if (openedWindowInfo && ! openedWindowInfo.window.closed) {
        if (openedWindowInfo.url !== url) {
            openedWindowInfo.window.location.replace(url);
        }
    }
    if (typeof openedWindowInfo === 'undefined' || openedWindowInfo.window.closed) {
        const openedWindow = window.open(url, windowName, "");
        openedWindowInfo = {window: openedWindow, url: url};
        openedWindows[windowName] = openedWindowInfo;
    } else {
        openedWindowInfo.window.focus();
    }
}
