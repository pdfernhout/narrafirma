"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "project_synopsis");
    }

    return {
        "id": "page_writeProjectSynopsis",
        "name": "Write project synopsis",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});