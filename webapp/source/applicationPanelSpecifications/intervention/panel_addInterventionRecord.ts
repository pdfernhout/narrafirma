import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addInterventionRecord",
    displayName: "Add intervention record",
    modelClass: "InterventionRecord",
    panelFields: [
        {
            id: "interventionRecord_name",
            valueType: "string",
            displayType: "text",
            displayName: "Intervention record name",
            displayPrompt: "Please give this intervention record a <strong>name</strong>."
        },
        {
            id: "interventionRecord_groups",
            valueType: "string",
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "Which participant <strong>group</strong> (or groups) were involved?"
        },
        {
            id: "interventionRecord_timeandplace",
            valueType: "string",
            displayType: "textarea",
            displayName: "When and where",
            displayPrompt: "<strong>When and where</strong> did the intervention take place?"
        },
        {
            id: "interventionRecord_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please <strong>describe</strong> what happened during the intervention, in general."
        },
        {
            id: "interventionRecord_plan",
            valueType: "string",
            displayType: "textarea",
            displayName: "Plan",
            displayPrompt: "Which of your intervention plans did you follow in this intervention? (And did you stick to the plan?)"
        },
        {
            id: "interventionRecord_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter additional <strong>notes</strong> on the intervention here. Your notes can include links to images or other documents."
        },
        {
            id: "interventionRecord_reflectLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "You can use the questions below to <strong>reflect</strong> on the intervention."
        },
        {
            id: "interventionRecord_reflectionsOnChangeHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Change"
        },
        {
            id: "interventionRecord_reflections_change_participantPerceptions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Change in participant perceptions",
            displayPrompt: "How did the perceptions of the <strong>participants</strong> change from the start to the end of the intervention?"
        },
        {
            id: "interventionRecord_reflections_change_yourPerceptions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Change in facilitator perceptions",
            displayPrompt: "How did <strong>your</strong> perceptions change?"
        },
        {
            id: "interventionRecord_reflections_change_project",
            valueType: "string",
            displayType: "textarea",
            displayName: "Changes to the project",
            displayPrompt: "How has the overall <strong>project</strong> changed as a result of this intervention?"
        },
        {
            id: "interventionRecord_interactionsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Interactions"
        },
        {
            id: "interventionRecord_reflections_interaction_participants",
            valueType: "string",
            displayType: "textarea",
            displayName: "Interactions among participants",
            displayPrompt: "Describe the interactions <strong>among participants</strong> in this intervention."
        },
        {
            id: "interventionRecord_reflections_interaction_participantsAndFacilitator",
            valueType: "string",
            displayType: "textarea",
            displayName: "Interactions between participants and facilitators",
            displayPrompt: "Describe the interactions <strong>between participants and facilitators</strong>."
        },
        {
            id: "interventionRecord_reflections_interaction_stories",
            valueType: "string",
            displayType: "textarea",
            displayName: "Stories",
            displayPrompt: "What did you notice about the <strong>stories</strong> people told, retold, chose, and worked with during the intervention?"
        },
        {
            id: "interventionRecord_learningHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Learning"
        },
        {
            id: "interventionRecord_reflections_learning_special",
            valueType: "string",
            displayType: "textarea",
            displayName: "Unique features",
            displayPrompt: "What was <strong>special</strong> about this intervention?"
        },
        {
            id: "interventionRecord_reflections_learning_surprise",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprise",
            displayPrompt: "What <strong>surprised</strong> you about this intervention?"
        },
        {
            id: "interventionRecord_reflections_learning_workedWell",
            valueType: "string",
            displayType: "textarea",
            displayName: "Worked and didn't work",
            displayPrompt: "Which parts of your <strong>plans</strong> for this intervention worked out well? Which parts didn't?"
        },
        {
            id: "interventionRecord_reflections_learning_newIdeas",
            valueType: "string",
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "What <strong>new ideas</strong> did you gain from this intervention? What did you <strong>learn</strong> from it?"
        },
        {
            id: "interventionRecord_reflections_learning_wantToRemember",
            valueType: "string",
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "<strong>What else</strong> do you want to remember about this intervention?"
        }
    ]
};

export = panel;

