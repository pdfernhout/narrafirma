// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "sensemakingSessionRecord_name");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_whenWhere");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_participants");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_plan");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_notes");
        widgets.add_grid(contentPane, model, "sensemakingSessionRecord_resonantStoriesList", ["page_addResonantStory"]);
        widgets.add_grid(contentPane, model, "sensemakingSessionRecord_outcomesList", ["page_newSensemakingSessionOutcome"]);
        widgets.add_grid(contentPane, model, "sensemakingSessionRecord_constructionsList", ["page_newSensemakingSessionConstruction"]);
        widgets.add_label(contentPane, model, "sensemakingSessionRecord_reflectionsLabel");
        widgets.add_header(contentPane, model, "sensemakingSessionRecord_reflectionsOnChangeHeader");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_change_participantPerceptions");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_change_yourPerceptions");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_change_project");
        widgets.add_header(contentPane, model, "sensemakingSessionRecord_interactionsHeader");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_interaction_participants");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_interaction_stories");
        widgets.add_header(contentPane, model, "sensemakingSessionRecord_learningHeader");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_learning_special");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_learning_surprise");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_learning_workedWell");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_learning_newIdeas");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_reflections_learning_wantToRemember");
    }

    return {
        "id": "page_addSensemakingSessionRecord",
        "name": "Add sensemaking session record",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});