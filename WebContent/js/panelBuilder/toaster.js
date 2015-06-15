define(["require", "exports", "dijit/layout/ContentPane", "dojox/widget/Toaster"], function (require, exports, ContentPane, Toaster) {
    "use strict";
    // For a "toaster" that can give status or progress updates
    var toasterWidget = null;
    // This should only be called once in your application, at the beginning
    function createToasterWidget(container) {
        var toasterPane = new ContentPane();
        toasterPane.placeAt(container);
        toasterWidget = new Toaster({ id: "toasterWidget" }, toasterPane.domNode);
    }
    exports.createToasterWidget = createToasterWidget;
    function toast(message, messageType, duration_ms) {
        // TODO: Translate message if needed
        if (!messageType)
            messageType = "message";
        if (!duration_ms)
            duration_ms = 2000;
        toasterWidget.positionDirection = "tl-down";
        toasterWidget.setContent(message, messageType, duration_ms);
        toasterWidget.show();
    }
    exports.toast = toast;
});
