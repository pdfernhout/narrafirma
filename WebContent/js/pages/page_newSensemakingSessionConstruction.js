// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "sensemakingSessionRecord_construction_name");
        widgets.add_select(contentPane, model, "sensemakingSessionRecord_construction_type", ["timeline","landscape","story elements","composite story","other"]);
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_construction_description");
    }

    var questions = [
        {"id":"sensemakingSessionRecord_construction_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_construction_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["timeline", "landscape", "story elements", "composite story", "other"]},
        {"id":"sensemakingSessionRecord_construction_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    return {
        "id": "page_newSensemakingSessionConstruction",
        "name": "Sensemaking construction",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});