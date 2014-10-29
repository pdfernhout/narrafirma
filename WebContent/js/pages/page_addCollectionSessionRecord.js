// Generated from design
"use strict";

define([], function() {

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

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addCollectionSessionRecord",
        "name": "Add story collection session record",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});