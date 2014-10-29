// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_collectionProcessReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionProcessReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["collectionProcess"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_readCollectionProcessReport",
        "name": "Read collection process report",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});