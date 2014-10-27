// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_grid(contentPane, model, "project_savedExcerptsList", ["page_createNewExcerpt"]);
    }

    var questions = [
        {"id":"project_savedExcerptsList", "type":"grid", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_reviewExcerpts",
        "name": "Review excerpts",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});