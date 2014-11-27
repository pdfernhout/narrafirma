// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"interventionRecord_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_description", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_groups", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflectLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"interventionRecord_reflectionsOnChangeHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"interventionRecord_reflections_change_participantPerceptions", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_change_yourPerceptions", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_change_project", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_interactionsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"interventionRecord_reflections_interaction_participants", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_interaction_participantsAndFacilitator", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_interaction_stories", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_learningHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"interventionRecord_reflections_learning_special", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_learning_surprise", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_learning_workedWell", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_learning_newIdeas", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_reflections_learning_wantToRemember", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addInterventionRecord",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});