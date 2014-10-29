// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"reviewTrendsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"reviewTrends_minSubsetSize", "type":"select", "isInReport":true, "isGridColumn":false, "options":["20", "30", "40", "50"]},
        {"id":"reviewTrends_significanceThreshold", "type":"select", "isInReport":true, "isGridColumn":false, "options":["0.05", "0.01"]},
        {"id":"reviewTrends_display", "type":"trendsReport", "isInReport":true, "isGridColumn":false},
        {"id":"mockupTrendsLabel_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_trends", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupTrends.png"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_reviewTrends",
        "name": "Review trends",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});