import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addCollectionSessionRecord",
    modelClass: "CollectionSessionRecord",
    panelFields: [
        {
            id: "collectionSessionRecord_name",
            valueType: "string",
            displayType: "text",
            displayName: "Collection session record name",
            displayPrompt: "Please give this session record a <strong>name</strong>."
        },
        {
            id: "collectionSessionRecord_whenWhere",
            valueType: "string",
            displayType: "textarea",
            displayName: "When and where",
            displayPrompt: "<strong>When and where</strong> did the session take place?"
        },
        {
            id: "collectionSessionRecord_groups",
            valueType: "string",
            displayType: "textarea",
            displayName: "Participant groups",
            displayPrompt: "Which participant <strong>groups</strong> were involved in this session?"
        },
        {
            id: "collectionSessionRecord_participants",
            valueType: "string",
            displayType: "textarea",
            displayName: "Who attended",
            displayPrompt: "Describe the <strong>participants</strong> at this session."
        },
        {
            id: "collectionSessionRecord_plan",
            valueType: "string",
            displayType: "textarea",
            displayName: "Plan",
            displayPrompt: "Which of your collection session <strong>plans</strong> did you follow in this session? (And did you stick to the plan?)"
        },
        {
            id: "collectionSessionRecord_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter additional <strong>notes</strong> on the session here. Your notes can include links to images or other documents."
        },
        {
            id: "collectionSessionRecord_constructionsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_newCollectionSessionConstruction",
            displayName: "Story collection session constructions",
            displayPrompt: "People in your story collection sessions might have created <strong>constructions</strong> such as timelines or landscapes. You can enter details about those here."
        },
        {
            id: "collectionSessionRecord_reflectionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "You can use the questions below to <strong>reflect</strong> on the session."
        },
        {
            id: "collectionSessionRecord_reflectionsOnChangeHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Change"
        },
        {
            id: "collectionSessionRecord_reflections_change_participantPerceptions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Change in participant perceptions",
            displayPrompt: "How did the perceptions of the <strong>participants</strong> change from the start to the end of the session?"
        },
        {
            id: "collectionSessionRecord_reflections_change_yourPerceptions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Change in facilitator perceptions",
            displayPrompt: "How did <strong>your</strong> perceptions change?"
        },
        {
            id: "collectionSessionRecord_reflections_change_project",
            valueType: "string",
            displayType: "textarea",
            displayName: "Changes to the project",
            displayPrompt: "How has the overall <strong>project</strong> changed as a result of this session?"
        },
        {
            id: "collectionSessionRecord_interactionsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Interactions"
        },
        {
            id: "collectionSessionRecord_reflections_interaction_participants",
            valueType: "string",
            displayType: "textarea",
            displayName: "Interactions among participants",
            displayPrompt: "Describe the interactions <strong>among participants</strong> in this session."
        },
        {
            id: "collectionSessionRecord_reflections_interaction_participantsAndFacilitator",
            valueType: "string",
            displayType: "textarea",
            displayName: "Interactions between participants and facilitators",
            displayPrompt: "Describe the interactions <strong>between participants and facilitators</strong>."
        },
        {
            id: "collectionSessionRecord_reflections_interaction_stories",
            valueType: "string",
            displayType: "textarea",
            displayName: "Stories",
            displayPrompt: "What did you notice about the <strong>stories</strong> people told, retold, chose, and worked with during the session?"
        },
        {
            id: "collectionSessionRecord_learningHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Learning"
        },
        {
            id: "collectionSessionRecord_reflections_learning_special",
            valueType: "string",
            displayType: "textarea",
            displayName: "Unique features",
            displayPrompt: "What was <strong>special</strong> about these people, in this place, on this day?"
        },
        {
            id: "collectionSessionRecord_reflections_learning_surprise",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprise",
            displayPrompt: "What <strong>surprised</strong> you about this session?"
        },
        {
            id: "collectionSessionRecord_reflections_learning_workedWell",
            valueType: "string",
            displayType: "textarea",
            displayName: "Worked and didn't work",
            displayPrompt: "Which parts of your <strong>plans</strong> for this session worked out well? Which parts didn't?"
        },
        {
            id: "collectionSessionRecord_reflections_learning_newIdeas",
            valueType: "string",
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "What <strong>new ideas</strong> did you gain from this session? What did you <strong>learn</strong> from it?"
        },
        {
            id: "collectionSessionRecord_reflections_learning_wantToRemember",
            valueType: "string",
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "<strong>What else</strong> do you want to remember about this session?"
        }
    ]
};

export = panel;

