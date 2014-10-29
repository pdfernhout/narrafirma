// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"mainDashboardLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_testImage", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/WWS_BookCover_front_small.png"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
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