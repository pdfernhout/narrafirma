define([], function() {
    "use strict";
    return [
        {
            id: "panel_addElicitingQuestion",
            displayName: "Add story eliciting question",
            displayType: "panel",
            section: "collection_design",
            modelClass: "ElicitingQuestionModel"
        },
        {
            id: "elicitingQuestion_text",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: "Enter a story-eliciting question."
        },
        {
            id: "elicitingQuestion_shortName",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Short Name",
            displayPrompt: "Enter a short name for this story-eliciting question to use as a reference to it."
        },
        {
            id: "elicitingQuestion_type",
            dataType: "dictionary",
            dataOptions: ["what happened","directed question","undirected questions","point in time","event","extreme","surprise","people, places, things","fictional scenario","other"],
            displayType: "checkboxes",
            displayName: "Type",
            displayPrompt: "What type of question is this?"
        },
        {
            id: "SPECIAL_templates_elicitingQuestions",
            dataType: "none",
            displayType: "templateList",
            displayConfiguration: "elicitationQuestions",
            displayPrompt: "You can copy a question from this list."
        }
    ];
});
