// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_readPlanningReportIntroductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"planningReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["planning"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_readPlanningReport",
        "name": "Read planning report",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});