"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "reviewTrendsLabel");
        widgets.add_select(contentPane, model, "reviewTrends_minSubsetSize", ["20","30","40","50"]);
        widgets.add_select(contentPane, model, "reviewTrends_significanceThreshold", ["0.05","0.01"]);
        widgets.add_trendsReport(contentPane, model, "reviewTrends_display");
        widgets.add_label(contentPane, model, "mockupTrendsLabel_unfinished");
        widgets.add_image(contentPane, model, "mockup_trends", ["images/mockups/mockupTrends.png"]);
    }

    return {
        "id": "page_reviewTrends",
        "name": "Review trends",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});