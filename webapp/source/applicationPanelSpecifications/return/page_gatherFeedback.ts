import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_gatherFeedback",
    displayName: "Gather feedback",
    pageExplanation: "Jot down comments people made about the project.",
    pageCategories: "record",
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
            displayConfiguration: "panel_enterFeedbackPiece",
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

