// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "project_synopsis");
    }

    var questions = [
        {"id":"project_synopsis", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_writeProjectSynopsis",
        "name": "Write project synopsis",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});