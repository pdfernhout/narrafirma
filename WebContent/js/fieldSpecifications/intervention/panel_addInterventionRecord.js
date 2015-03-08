define([], function() {
    "use strict";
    return [
        {
            id: "panel_addInterventionRecord",
            displayName: "Add intervention record",
            displayType: "panel",
            section: "intervention",
            modelClass: "InterventionRecordModel"
        },
        {
            id: "interventionRecord_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this intervention record a name."
        },
        {
            id: "interventionRecord_description",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please describe what happened during the intervention, in general."
        },
        {
            id: "interventionRecord_groups",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "Which participant group(s) were involved?"
        },
        {
            id: "interventionRecord_reflectLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "Use the questions below to reflect on the intervention."
        },
        {
            id: "interventionRecord_reflectionsOnChangeHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Change"
        },
        {
            id: "interventionRecord_reflections_change_participantPerceptions",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Change in participant perceptions",
            displayPrompt: "How did the perceptions of the participants change from the start to the end of the intervention?"
        },
        {
            id: "interventionRecord_reflections_change_yourPerceptions",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Change in facilitator perceptions",
            displayPrompt: "How did <i>your</i> perceptions change?"
        },
        {
            id: "interventionRecord_reflections_change_project",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Changes to the project",
            displayPrompt: "How has the overall project changed as a result of this intervention?"
        },
        {
            id: "interventionRecord_interactionsHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Interactions"
        },
        {
            id: "interventionRecord_reflections_interaction_participants",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Interactions among participants",
            displayPrompt: "Describe the interactions between participants in this intervention."
        },
        {
            id: "interventionRecord_reflections_interaction_participantsAndFacilitator",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Interactions between participants and facilitators",
            displayPrompt: "Describe interactions between participants and facilitators."
        },
        {
            id: "interventionRecord_reflections_interaction_stories",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Stories",
            displayPrompt: "What did you notice about the stories people told, retold, chose, and worked with during the intervention?"
        },
        {
            id: "interventionRecord_learningHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Learning"
        },
        {
            id: "interventionRecord_reflections_learning_special",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Unique features",
            displayPrompt: "What was special about this intervention?"
        },
        {
            id: "interventionRecord_reflections_learning_surprise",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Surprise",
            displayPrompt: "What surprised you about this intervention?"
        },
        {
            id: "interventionRecord_reflections_learning_workedWell",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Worked and didn't work",
            displayPrompt: "Which parts of your plans for this intervention worked out well? Which parts didn't?"
        },
        {
            id: "interventionRecord_reflections_learning_newIdeas",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "What new ideas did you gain from this intervention? What did you learn from it?"
        },
        {
            id: "interventionRecord_reflections_learning_wantToRemember",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "What else do you want to remember about this intervention?"
        }
    ];
});
