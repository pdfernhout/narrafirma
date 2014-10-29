// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"storiesListChoose", "type":"storiesList", "isInReport":true, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_resonantStory_type", "type":"select", "isInReport":true, "isGridColumn":false, "options":["pivot", "voice", "discovery", "other"]},
        {"id":"sensemakingSessionRecord_resonantStory_reason", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_resonantStory_groups", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_resonantStory_notes", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addResonantStory",
        "name": "Add resonant story",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});