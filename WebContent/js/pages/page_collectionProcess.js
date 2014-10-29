// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"collectionProcessIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_collectionProcess", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_collectionProcess",
        "name": "Collection process",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});