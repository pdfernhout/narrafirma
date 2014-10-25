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

    return {
        "id": "page_addResonantStory",
        "name": "Add resonant story",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});