// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_returnRequestsLabel");
        widgets.add_grid(contentPane, model, "project_returnRequestsList", ["page_addNewReturnRequest"]);
    }

    return {
        "id": "page_projectRequests",
        "name": "Respond to requests for post-project support",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});