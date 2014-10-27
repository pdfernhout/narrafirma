// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_grid(contentPane, model, "project_observationsDisplayList", ["page_createOrEditObservation"]);
    }

    var questions = [
        {"id":"project_observationsDisplayList", "type":"grid", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_interpretObservations",
        "name": "Review and interpret observations",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});