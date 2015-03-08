define([], function() {
    "use strict";
    return [
        {
            id: "panel_addSensemakingSessionRecord",
            displayName: "Add sensemaking session record",
            displayType: "panel",
            section: "sensemaking",
            modelClass: "SensemakingSessionRecordModel"
        },
        {
            id: "sensemakingSessionRecord_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this session record a name."
        },
        {
            id: "sensemakingSessionRecord_whenWhere",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "When and where",
            displayPrompt: "When and where did this session take place?"
        },
        {
            id: "sensemakingSessionRecord_groups",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "Which participant group(s) were at the session?"
        },
        {
            id: "sensemakingSessionRecord_participants",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Who attended",
            displayPrompt: "Describe the participants at this session."
        },
        {
            id: "sensemakingSessionRecord_plan",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Plan",
            displayPrompt: "Which of your collection session plans did you follow in this session? (And did you stick to the plan?)"
        },
        {
            id: "sensemakingSessionRecord_notes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter general notes on the session here.\nYour notes can include links to images or other documents."
        },
        {
            id: "sensemakingSessionRecord_resonantStoriesList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addResonantStory",
            displayName: "Sensemaking session resonant stories",
            displayPrompt: "If you discovered any resonant stories (pivot, voice, discovery) in this session,\nenter them here."
        },
        {
            id: "sensemakingSessionRecord_outcomesList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_newSensemakingSessionOutcome",
            displayName: "Sensemaking session outcomes",
            displayPrompt: "If your session ended with creating lists of outcomes (like discoveries and ideas),\nyou can enter them here."
        },
        {
            id: "sensemakingSessionRecord_constructionsList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_newSensemakingSessionConstruction",
            displayName: "Sensemaking session constructions",
            displayPrompt: "If your session involve creating any group constructions (like landscapes or timelines),\nyou can describe them here."
        },
        {
            id: "sensemakingSessionRecord_reflectionsLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "Use the questions below to reflect on the session."
        },
        {
            id: "sensemakingSessionRecord_reflectionsOnChangeHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Change"
        },
        {
            id: "sensemakingSessionRecord_reflections_change_participantPerceptions",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Change in participant perceptions",
            displayPrompt: "How did the perceptions of the participants change from the start to the end of the session?"
        },
        {
            id: "sensemakingSessionRecord_reflections_change_yourPerceptions",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Change in facilitator perceptions",
            displayPrompt: "How did <i>your</i> perceptions change?"
        },
        {
            id: "sensemakingSessionRecord_reflections_change_project",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Changes to the project",
            displayPrompt: "How has the overall project changed as a result of this session?"
        },
        {
            id: "sensemakingSessionRecord_interactionsHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Interactions"
        },
        {
            id: "sensemakingSessionRecord_reflections_interaction_participants",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Interactions among participants",
            displayPrompt: "Describe the interactions between participants in this session."
        },
        {
            id: "sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Interactions between participants and facilitators",
            displayPrompt: "Describe interactions between participants and facilitators."
        },
        {
            id: "sensemakingSessionRecord_reflections_interaction_stories",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Stories",
            displayPrompt: "What did you notice about the stories people told, retold, chose, and worked with during the session?"
        },
        {
            id: "sensemakingSessionRecord_learningHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Learning"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_special",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Unique features",
            displayPrompt: "What was special about these people in this place on this day?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_surprise",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Surprise",
            displayPrompt: "What surprised you about this session?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_workedWell",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Worked and didn't work",
            displayPrompt: "Which parts of your plans for this session worked out well? Which parts didn't?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_newIdeas",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "What new ideas did you gain from this session? What did you learn from it?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_wantToRemember",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "What else do you want to remember about this session?"
        }
    ];
});
