"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_grid(contentPane, model, "project_savedExcerptsList", ["page_createNewExcerpt"]);
    }

    return {
        "id": "page_reviewExcerpts",
        "name": "Review excerpts",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});