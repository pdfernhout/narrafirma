// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "mainDashboardLabel");
        widgets.add_image(contentPane, model, "project_testImage", ["images/WWS_BookCover_front_small.png"]);
    }

    var questions = [
        {"id":"mainDashboardLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_testImage", "type":"image", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_dashboard",
        "name": "Dashboard",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets,
        "questions": questions
    };
});