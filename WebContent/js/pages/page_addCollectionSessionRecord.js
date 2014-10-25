"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "collectionSessionRecord_name");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_whenWhere");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_participants");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_plan");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_notes");
        widgets.add_grid(contentPane, model, "collectionSessionRecord_constructionsList", ["page_newCollectionSessionConstruction"]);
        widgets.add_label(contentPane, model, "collectionSessionRecord_reflectionsLabel");
        widgets.add_header(contentPane, model, "collectionSessionRecord_reflectionsOnChangeHeader");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_change_participantPerceptions");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_change_yourPerceptions");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_change_project");
        widgets.add_header(contentPane, model, "collectionSessionRecord_interactionsHeader");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_interaction_participants");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_interaction_participantsAndFacilitator");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_interaction_stories");
        widgets.add_header(contentPane, model, "collectionSessionRecord_learningHeader");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_learning_special");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_learning_surprise");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_learning_workedWell");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_learning_newIdeas");
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_reflections_learning_wantToRemember");
    }

    return {
        "id": "page_addCollectionSessionRecord",
        "name": "Add story collection session record",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});