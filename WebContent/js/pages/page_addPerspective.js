// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"perspective_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"perspective_description", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"perspective_linkedResultsList", "type":"annotationsGrid", "isInReport":true, "isGridColumn":false, "options":["page_annotateResultForPerspective"]},
        {"id":"perspective_linkedExcerptsList", "type":"annotationsGrid", "isInReport":true, "isGridColumn":false, "options":["page_annotateExcerptForPerspective"]},
        {"id":"perspective_linkedInterpretationsList", "type":"annotationsGrid", "isInReport":true, "isGridColumn":false, "options":["page_annotateInterpretationForPerspective"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addPerspective",
        "name": "Add or change perspective",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});