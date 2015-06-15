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
        var width = Math.round(screen.availWidth / 2);
        var height = Math.round(screen.availHeight / 3);
        var windowOpenParams = 'status=1,resizable=1,scrollbars=1,left=200,top=200,width=' + width + ',height=' + height;
        var openedWindow = window.open(url, windowName, windowOpenParams);
        // Not sure if moveTo and resizeTo is really needed, since works without them in Firefox
        openedWindow.moveTo(200, 200);
        openedWindow.resizeTo(width, height);
        openedWindowInfo = {window: openedWindow, url: url};
        openedWindows[windowName] = openedWindowInfo;
    } else {
        openedWindowInfo.window.focus();
    }
}
