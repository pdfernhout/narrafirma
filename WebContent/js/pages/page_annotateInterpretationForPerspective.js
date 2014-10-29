// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"perspective_interpretationLinkageNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_annotateInterpretationForPerspective",
        "name": "Annotate interpretation for perspective",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});