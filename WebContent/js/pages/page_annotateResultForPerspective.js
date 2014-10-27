// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "perspective_resultLinkageNotes");
    }

    var questions = [
        {"id":"perspective_resultLinkageNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    return {
        "id": "page_annotateResultForPerspective",
        "name": "Annotate result for perspective",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});