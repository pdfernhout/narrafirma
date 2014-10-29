// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_collectionProcessReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionProcessReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["collectionProcess"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
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