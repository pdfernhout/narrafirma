import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_enterFeedbackPiece",
    modelClass: "FeedbackPiece",
    panelFields: [
        {
            id: "feedback_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this piece of feedback a <strong>name</strong>."
        },
        {
            id: "feedback_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "What did someone <strong>say or do</strong>?"
        },
        {
            id: "feedback_type",
            valueType: "string",
            valueOptions: [
                "a reference to something from the project",
                "a concern or complaint",
                "a thank you",
                "a suggestion",
                "a hope or wish",
                "a statement of fact",
                "an opinion",
                "a story",
                "an action",
                "other"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of feedback was it?"
        },
        {
            id: "feedback_who",
            valueType: "string",
            displayType: "text",
            displayName: "Source",
            displayPrompt: "<strong>Who</strong> said or did this?"
        },
        {
            id: "feedback_prompt",
            valueType: "string",
            displayType: "textarea",
            displayName: "What led to it",
            displayPrompt: "What did you say or do (if anything) that <strong>led to</strong> this feedback?"
        },
        {
            id: "feedback_response",
            valueType: "string",
            displayType: "textarea",
            displayName: "What I said back",
            displayPrompt: "What did you say or do (if anything) <strong>in response</strong>?"
        },
        {
            id: "feedback_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Please enter any other <strong>notes</strong> you would like to remember about this piece of feedback."
        }
    ]
};

export = panel;

