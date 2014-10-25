// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "perspective_name");
        widgets.add_textarea(contentPane, model, "perspective_description");
        widgets.add_annotationsGrid(contentPane, model, "perspective_linkedResultsList", ["page_annotateResultForPerspective"]);
        widgets.add_annotationsGrid(contentPane, model, "perspective_linkedExcerptsList", ["page_annotateExcerptForPerspective"]);
        widgets.add_annotationsGrid(contentPane, model, "perspective_linkedInterpretationsList", ["page_annotateInterpretationForPerspective"]);
    }

    return {
        "id": "page_addPerspective",
        "name": "Add or change perspective",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});