"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, "mainDashboardLabel", model, "");
        widgets.add_image(contentPane, "project_testImage", model, "images/WWS_BookCover_front_small.png");
    }

    return {
        "id": "page_dashboard",
        "name": "Dashboard",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});