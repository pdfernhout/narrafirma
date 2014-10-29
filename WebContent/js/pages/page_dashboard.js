// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"mainDashboardLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_testImage", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/WWS_BookCover_front_small.png"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_dashboard",
        "name": "Dashboard",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});