// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "perspective_excerptLinkageNotes");
    }

    return {
        "id": "page_annotateExcerptForPerspective",
        "name": "Annotate excerpt for perspective",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});