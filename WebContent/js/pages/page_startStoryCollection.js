// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "webStoryCollection_startCollectionLabel");
        widgets.add_toggleButton(contentPane, model, "webStoryCollection_enableDisableButton");
        widgets.add_button(contentPane, model, "webStoryCollection_copyStoryFormURLButton");
    }

    var questions = [
        {"id":"webStoryCollection_startCollectionLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"webStoryCollection_enableDisableButton", "type":"toggleButton", "isReportable":true, "isHeader":true},
        {"id":"webStoryCollection_copyStoryFormURLButton", "type":"button", "isReportable":false, "isHeader":false}
    ];

    return {
        "id": "page_startStoryCollection",
        "name": "Start story collection",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});