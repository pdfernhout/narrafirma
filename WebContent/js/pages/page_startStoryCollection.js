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
        {"id":"webStoryCollection_startCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"webStoryCollection_enableDisableButton", "type":"toggleButton", "isInReport":true, "isGridColumn":true},
        {"id":"webStoryCollection_copyStoryFormURLButton", "type":"button", "isInReport":false, "isGridColumn":false}
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