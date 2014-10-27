// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_header(contentPane, model, "aspects_youHeader");
        widgets.add_select(contentPane, model, "aboutYou_experience", ["none","a little","some","a lot"]);
        widgets.add_select(contentPane, model, "aboutYou_help", ["none","a little","some","a lot"]);
        widgets.add_select(contentPane, model, "aboutYou_tech", ["none","a little","some","a lot"]);
    }

    var questions = [
        {"id":"aspects_youHeader", "type":"header", "isReportable":false, "isHeader":false},
        {"id":"aboutYou_experience", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"aboutYou_help", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"aboutYou_tech", "type":"select", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_aboutYou",
        "name": "About you",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});