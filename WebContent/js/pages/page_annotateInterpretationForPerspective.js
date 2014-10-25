"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "perspective_interpretationLinkageNotes");
    }

    return {
        "id": "page_annotateInterpretationForPerspective",
        "name": "Annotate interpretation for perspective",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});