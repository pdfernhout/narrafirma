import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_gatherFeedback",
    displayName: "Gather feedback",
    pageExplanation: "Make a note of things people told you about the project.",
    pageCategories: "journal",
    headerAbove: "Listen",
    panelFields: [
        {
            id: "project_feedbackLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can record any <strong>feedback</strong> you have gathered about your project."
        },
        {
            id: "project_feedbackItemsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_enterFeedbackPiece",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true,
                    duplicateButton: true,
                    columnsToDisplay: ["feedback_name", "feedback_type", "feedback_text"]
                },
            },
            displayName: "Feedback pieces",
            displayPrompt: "These are the pieces of feedback you have entered so far."
        },
        {
            id: "feedback_generalNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "If you would like to enter any <strong>general notes</strong> on the feedback you've received about the project, you can write them here."
        }
    ]
};

export = panel;

