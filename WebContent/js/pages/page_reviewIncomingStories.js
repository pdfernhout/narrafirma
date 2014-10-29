// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"collectedStoriesDuringCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectedStoriesDuringCollection", "type":"storyBrowser", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_reviewIncomingStories",
        "name": "Review incoming stories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});