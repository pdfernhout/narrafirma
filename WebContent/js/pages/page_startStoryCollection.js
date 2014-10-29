// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"webStoryCollection_startCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"webStoryCollection_enableDisableButton", "type":"toggleButton", "isInReport":true, "isGridColumn":true},
        {"id":"webStoryCollection_copyStoryFormURLButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_startStoryCollection",
        "name": "Start story collection",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});