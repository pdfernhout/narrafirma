// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_readPlanningReportIntroductionLabel");
        widgets.add_report(contentPane, model, "planningReport", ["planning"]);
    }

    var questions = [
        {"id":"project_readPlanningReportIntroductionLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"planningReport", "type":"report", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_readPlanningReport",
        "name": "Read planning report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});