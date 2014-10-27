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
        {"id":"aspects_youHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"aboutYou_experience", "type":"select", "isInReport":true, "isGridColumn":false},
        {"id":"aboutYou_help", "type":"select", "isInReport":true, "isGridColumn":false},
        {"id":"aboutYou_tech", "type":"select", "isInReport":true, "isGridColumn":false}
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