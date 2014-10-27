// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "interventionRecord_name");
        widgets.add_textarea(contentPane, model, "interventionRecord_notes");
        widgets.add_label(contentPane, model, "interventionRecord_reflectLabel");
        widgets.add_header(contentPane, model, "interventionRecord_reflectionsOnChangeHeader");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_change_participantPerceptions");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_change_yourPerceptions");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_change_project");
        widgets.add_header(contentPane, model, "interventionRecord_interactionsHeader");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_interaction_participants");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_interaction_participantsAndFacilitator");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_interaction_stories");
        widgets.add_header(contentPane, model, "interventionRecord_learningHeader");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_learning_special");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_learning_surprise");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_learning_workedWell");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_learning_newIdeas");
        widgets.add_textarea(contentPane, model, "interventionRecord_reflections_learning_wantToRemember");
    }

    var questions = [
        {"id":"interventionRecord_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"interventionRecord_notes", "type":"textarea", "isInReport":true, "isGridColumn":true},
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

    return {
        "id": "page_addInterventionRecord",
        "name": "Add intervention record",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});