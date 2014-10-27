// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"collectionSessionRecord_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_whenWhere", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_participants", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_plan", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_notes", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_constructionsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_newCollectionSessionConstruction"]},
        {"id":"collectionSessionRecord_reflectionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectionSessionRecord_reflectionsOnChangeHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"collectionSessionRecord_reflections_change_participantPerceptions", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_change_yourPerceptions", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_change_project", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_interactionsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"collectionSessionRecord_reflections_interaction_participants", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_interaction_participantsAndFacilitator", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_interaction_stories", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_learningHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"collectionSessionRecord_reflections_learning_special", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_learning_surprise", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_learning_workedWell", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_learning_newIdeas", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_reflections_learning_wantToRemember", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    return {
        "id": "page_addCollectionSessionRecord",
        "name": "Add story collection session record",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});