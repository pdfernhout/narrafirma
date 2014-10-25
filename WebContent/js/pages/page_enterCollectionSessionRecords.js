// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_collectionRecordsIntroductionLabel");
        widgets.add_grid(contentPane, model, "project_collectionSessionRecordsList", ["page_addCollectionSessionRecord"]);
    }

    return {
        "id": "page_enterCollectionSessionRecords",
        "name": "Enter story collection session records",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});