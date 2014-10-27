// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "perspective_interpretationLinkageNotes");
    }

    var questions = [
        {"id":"perspective_interpretationLinkageNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    return {
        "id": "page_annotateInterpretationForPerspective",
        "name": "Annotate interpretation for perspective",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});