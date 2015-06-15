import ContentPane = require("dijit/layout/ContentPane");
import Toaster = require("dojox/widget/Toaster");

"use strict";

// For a "toaster" that can give status or progress updates
var toasterWidget = null;

// This should only be called once in your application, at the beginning
export function createToasterWidget(container) {
    var toasterPane =  new ContentPane();
    toasterPane.placeAt(container);
    toasterWidget = new Toaster({id: "toasterWidget"}, toasterPane.domNode);
}

export function toast(message, messageType = "message", duration_ms = 2000) {
    // TODO: Translate message if needed
    toasterWidget.positionDirection = "tl-down";
    toasterWidget.setContent(message, messageType, duration_ms);
    toasterWidget.show();
}
