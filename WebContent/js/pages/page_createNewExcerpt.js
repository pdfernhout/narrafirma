// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "excerpt_name");
        widgets.add_textarea(contentPane, model, "excerpt_text");
        widgets.add_textarea(contentPane, model, "excerpt_notes");
    }

    var questions = [
        {"id":"excerpt_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"excerpt_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"excerpt_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    return {
        "id": "page_createNewExcerpt",
        "name": "Create new excerpt",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});