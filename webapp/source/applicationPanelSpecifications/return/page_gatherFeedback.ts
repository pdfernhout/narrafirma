import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_gatherFeedback",
    displayName: "Gather feedback",
    tooltipText: "Enter things people told you about the project so you can remember them and learn from them.",
    headerAbove: "Think About What Happened",
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
            displayName: "Pieces of feedback",
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

