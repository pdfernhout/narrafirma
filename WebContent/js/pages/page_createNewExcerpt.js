"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "excerpt_name");
        widgets.add_textarea(contentPane, model, "excerpt_text");
        widgets.add_textarea(contentPane, model, "excerpt_notes");
    }

    return {
        "id": "page_createNewExcerpt",
        "name": "Create new excerpt",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});