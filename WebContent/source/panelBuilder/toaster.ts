import ContentPane = require("dijit/layout/ContentPane");
import Toaster = require("dojox/widget/Toaster");

"use strict";

// For a "toaster" that can give status or progress updates
var toasterWidget = null;

// This should only be called once in your application, at the beginning
export function createToasterWidget(container) {
    var toasterPane =  new ContentPane();
    toasterPane.placeAt(container);
    // console.log("************ Toaster.constructor", Toaster.constructor);
    // TODO: The next line is to avoid TypeScript error on calling constructor
    var KludgeToaster: any = Toaster;
    toasterWidget = new KludgeToaster({id: "toasterWidget"}, toasterPane.domNode);
}

export function toast(message, messageType = "message", duration_ms = 2000) {
    // TODO: Translate message if needed
    toasterWidget.positionDirection = "tl-down";
    toasterWidget.setContent(message, messageType, duration_ms);
    toasterWidget.show();
}
