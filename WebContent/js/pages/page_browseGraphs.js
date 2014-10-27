// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "graphBrowserLabel");
        widgets.add_graphBrowser(contentPane, model, "graphBrowserDisplay");
        widgets.add_label(contentPane, model, "graphBrowserMockupLabel_unfinished");
        widgets.add_image(contentPane, model, "mockup_graphBrowser", ["images/mockups/mockupGraphs.png"]);
    }

    var questions = [
        {"id":"graphBrowserLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"graphBrowserDisplay", "type":"graphBrowser", "isReportable":true, "isHeader":false},
        {"id":"graphBrowserMockupLabel_unfinished", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"mockup_graphBrowser", "type":"image", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_browseGraphs",
        "name": "Browse graphs",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});