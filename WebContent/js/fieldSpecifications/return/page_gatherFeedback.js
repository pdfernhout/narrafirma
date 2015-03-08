define([], function() {
    "use strict";
    return [
        {
            id: "page_gatherFeedback",
            displayName: "Gather feedback",
            displayType: "page",
            section: "return",
            modelClass: "ProjectModel"
        },
        {
            id: "project_feedbackLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will enter any feedback you gather about your project."
        },
        {
            id: "project_feedbackItemsList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_enterFeedbackPiece",
            displayName: "Pieces of feedback",
            displayPrompt: "You can enter specific pieces of feedback you have gathered here."
        },
        {
            id: "feedback_generalNotes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "If you would like to enter any general notes on the feedback you've seen to the project, write them here."
        }
    ];
});
