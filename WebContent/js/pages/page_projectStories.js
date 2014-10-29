// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_projectStoriesList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_projectStory"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_projectStories",
        "name": "Tell project stories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});