// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_readCollectionDesignReportIntroductionLabel");
        widgets.add_report(contentPane, model, "collectionDesignReport", ["collectionDesign"]);
    }

    var questions = [
        {"id":"project_readCollectionDesignReportIntroductionLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"collectionDesignReport", "type":"report", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_readCollectionDesignReport",
        "name": "Read collection design report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});