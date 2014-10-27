// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_storiesList(contentPane, model, "storiesListChoose");
        widgets.add_select(contentPane, model, "sensemakingSessionRecord_resonantStory_type", ["pivot","voice","discovery","other"]);
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_resonantStory_reason");
        widgets.add_text(contentPane, model, "sensemakingSessionRecord_resonantStory_groups");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_resonantStory_notes");
    }

    var questions = [
        {"id":"storiesListChoose", "type":"storiesList", "isInReport":true, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_resonantStory_type", "type":"select", "isInReport":true, "isGridColumn":false, "options":["pivot", "voice", "discovery", "other"]},
        {"id":"sensemakingSessionRecord_resonantStory_reason", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_resonantStory_groups", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_resonantStory_notes", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_addResonantStory",
        "name": "Add resonant story",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});