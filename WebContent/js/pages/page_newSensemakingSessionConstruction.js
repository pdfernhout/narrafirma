// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"sensemakingSessionRecord_construction_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_construction_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["timeline", "landscape", "story elements", "composite story", "other"]},
        {"id":"sensemakingSessionRecord_construction_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_newSensemakingSessionConstruction",
        "name": "Sensemaking construction",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});