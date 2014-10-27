// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_collectionProcessReportLabel");
        widgets.add_report(contentPane, model, "project_collectionProcessReport", ["collectionProcess"]);
    }

    var questions = [
        {"id":"project_collectionProcessReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionProcessReport", "type":"report", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_readCollectionProcessReport",
        "name": "Read collection process report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});