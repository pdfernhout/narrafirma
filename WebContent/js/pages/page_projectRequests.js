// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_returnRequestsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_returnRequestsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addNewReturnRequest"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_projectRequests",
        "name": "Respond to requests for post-project support",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});