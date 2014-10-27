// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "webStoryCollection_stopCollectionLabel");
        widgets.add_button(contentPane, model, "webStoryCollection_disableWebStoryFormAfterStoryCollectionButton");
        widgets.add_questionAnswer(contentPane, model, "webStoryCollection_enabledTracker", ["webStoryCollection_enableDisableButton"]);
    }

    var questions = [
        {"id":"webStoryCollection_stopCollectionLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"webStoryCollection_disableWebStoryFormAfterStoryCollectionButton", "type":"button", "isReportable":false, "isHeader":true},
        {"id":"webStoryCollection_enabledTracker", "type":"questionAnswer", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_stopStoryCollection",
        "name": "Stop story collection",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});