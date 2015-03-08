define([], function() {
    "use strict";
    return [
        {
            id: "panel_addParticipantQuestion",
            displayName: "Add participant question",
            displayType: "panel",
            section: "collection_design",
            modelClass: "ParticipantQuestionModel"
        },
        {
            id: "participantQuestion_text",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: "Enter a question to ask people about themselves."
        },
        {
            id: "participantQuestion_type",
            dataType: "string",
            dataOptions: ["boolean","label","header","checkbox","checkboxes","text","textarea","select","radiobuttons","slider"],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What type of question is this?"
        },
        {
            id: "participantQuestion_shortName",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Short name",
            displayPrompt: "Enter a short name we can use to refer to the question. (It must be unique within the project.)"
        },
        {
            id: "participantQuestion_options",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Options",
            displayPrompt: "If your question has choices, enter them here (one per line)."
        },
        {
            id: "participantQuestion_help",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Help",
            displayPrompt: "If you want to provide help to people answering the question, enter it here."
        },
        {
            id: "SPECIAL_templates_participantQuestions",
            dataType: "none",
            displayType: "templateList",
            displayConfiguration: "participantQuestions",
            displayPrompt: "You can copy a question from this list."
        }
    ];
});
