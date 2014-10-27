// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"reviewTrendsLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"reviewTrends_minSubsetSize", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"reviewTrends_significanceThreshold", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"reviewTrends_display", "type":"trendsReport", "isReportable":true, "isHeader":false},
        {"id":"mockupTrendsLabel_unfinished", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"mockup_trends", "type":"image", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_reviewTrends",
        "name": "Review trends",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});