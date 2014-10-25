"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "perspective_resultLinkageNotes");
    }

    return {
        "id": "page_annotateResultForPerspective",
        "name": "Annotate result for perspective",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});