// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_collectionDesignStartLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_collectionDesign", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_collectionDesign",
        "name": "Collection design",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});