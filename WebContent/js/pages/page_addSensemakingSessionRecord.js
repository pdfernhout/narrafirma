// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"sensemakingSessionRecord_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_whenWhere", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_participants", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_plan", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_notes", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_resonantStoriesList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addResonantStory"]},
        {"id":"sensemakingSessionRecord_outcomesList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_newSensemakingSessionOutcome"]},
        {"id":"sensemakingSessionRecord_constructionsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_newSensemakingSessionConstruction"]},
        {"id":"sensemakingSessionRecord_reflectionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_reflectionsOnChangeHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_reflections_change_participantPerceptions", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_change_yourPerceptions", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_change_project", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_interactionsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_reflections_interaction_participants", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_interaction_stories", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_learningHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_reflections_learning_special", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_learning_surprise", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_learning_workedWell", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_learning_newIdeas", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_reflections_learning_wantToRemember", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addSensemakingSessionRecord",
        "name": "Add sensemaking session record",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});