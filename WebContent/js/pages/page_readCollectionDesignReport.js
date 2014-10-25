"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_readCollectionDesignReportIntroductionLabel");
        widgets.add_report(contentPane, model, "collectionDesignReport", ["collectionDesign"]);
    }

    return {
        "id": "page_readCollectionDesignReport",
        "name": "Read collection design report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});