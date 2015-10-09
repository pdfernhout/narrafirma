import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addSensemakingSessionRecord",
    modelClass: "SensemakingSessionRecord",
    panelFields: [
        {
            id: "sensemakingSessionRecord_name",
            valueType: "string",
            displayType: "text",
            displayName: "Sensemaking session record name",
            displayPrompt: "Please give this session record a <strong>name</strong>."
        },
        {
            id: "sensemakingSessionRecord_whenWhere",
            valueType: "string",
            displayType: "textarea",
            displayName: "When and where",
            displayPrompt: "<strong>When and where</strong> did this session take place?"
        },
        {
            id: "sensemakingSessionRecord_groups",
            valueType: "string",
            displayType: "textarea",
            displayName: "Participant groups",
            displayPrompt: "Which participant <strong>group</strong> (or groups) attended the session?"
        },
        {
            id: "sensemakingSessionRecord_participants",
            valueType: "string",
            displayType: "textarea",
            displayName: "Who attended",
            displayPrompt: "Describe the <strong>participants</strong> at this session."
        },
        {
            id: "sensemakingSessionRecord_plan",
            valueType: "string",
            displayType: "textarea",
            displayName: "Plan",
            displayPrompt: "Which of your sensemaking <strong>plans</strong> did you follow in this session? (And did you stick to the plan?)"
        },
        {
            id: "sensemakingSessionRecord_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Here you can enter general <strong>notes</strong> on the session. Your notes can include links to images or other documents."
        },
        {
            id: "sensemakingSessionRecord_resonantStoriesList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addResonantStory",
            displayName: "Sensemaking session resonant stories",
            displayPrompt: "If you discovered any <strong>resonant stories</strong> (pivot, voice, discovery) in this session, you can enter them here."
        },
        {
            id: "sensemakingSessionRecord_resonantPatternsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addResonantPattern",
            displayName: "Sensemaking session resonant patterns",
            displayPrompt: "If you discovered any <strong>resonant patterns</strong> (pivot, voice, discovery) in this session, you can enter them here."
        },
        {
            id: "sensemakingSessionRecord_outcomesList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_newSensemakingSessionOutcome",
            displayName: "Sensemaking session outcomes",
            displayPrompt: "If your session ended with creating lists of <strong>outcomes</strong> (like discoveries and ideas), you can enter them here."
        },
        {
            id: "sensemakingSessionRecord_constructionsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_newSensemakingSessionConstruction",
            displayName: "Sensemaking session constructions",
            displayPrompt: "If your session involve creating any group <strong>constructions</strong> (like landscapes or timelines), you can describe them here."
        },
        {
            id: "sensemakingSessionRecord_reflectionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "You can use the questions below to <strong>reflect</strong> on the session."
        },
        {
            id: "sensemakingSessionRecord_reflectionsOnChangeHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Change"
        },
        {
            id: "sensemakingSessionRecord_reflections_change_participantPerceptions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Change in participant perceptions",
            displayPrompt: "How did the perceptions of the <strong>participants</strong> change from the start to the end of the session?"
        },
        {
            id: "sensemakingSessionRecord_reflections_change_yourPerceptions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Change in facilitator perceptions",
            displayPrompt: "How did <strong>your</strong> perceptions change?"
        },
        {
            id: "sensemakingSessionRecord_reflections_change_project",
            valueType: "string",
            displayType: "textarea",
            displayName: "Changes to the project",
            displayPrompt: "How has the overall <strong>project</strong> changed as a result of this session?"
        },
        {
            id: "sensemakingSessionRecord_interactionsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Interactions"
        },
        {
            id: "sensemakingSessionRecord_reflections_interaction_participants",
            valueType: "string",
            displayType: "textarea",
            displayName: "Interactions among participants",
            displayPrompt: "Describe the interactions <strong>among participants</strong> in this session."
        },
        {
            id: "sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator",
            valueType: "string",
            displayType: "textarea",
            displayName: "Interactions between participants and facilitators",
            displayPrompt: "Describe the interactions <strong>between participants and facilitators</strong>."
        },
        {
            id: "sensemakingSessionRecord_reflections_interaction_stories",
            valueType: "string",
            displayType: "textarea",
            displayName: "Stories",
            displayPrompt: "What did you notice about the <strong>stories</strong> people told, retold, chose, and worked with during the session?"
        },
        {
            id: "sensemakingSessionRecord_learningHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Learning"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_special",
            valueType: "string",
            displayType: "textarea",
            displayName: "Unique features",
            displayPrompt: "What was <strong>special</strong> about these people in this place on this day?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_surprise",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprise",
            displayPrompt: "What <strong>surprised</strong> you about this session?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_workedWell",
            valueType: "string",
            displayType: "textarea",
            displayName: "Worked and didn't work",
            displayPrompt: "Which parts of your <strong>plans</strong> for this session worked out well? Which parts didn't?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_newIdeas",
            valueType: "string",
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "What <strong>new ideas</strong> did you gain from this session? What did you <strong>learn</strong> from it?"
        },
        {
            id: "sensemakingSessionRecord_reflections_learning_wantToRemember",
            valueType: "string",
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "<strong>What else</strong> do you want to remember about this session?"
        }
    ]
};

export = panel;

