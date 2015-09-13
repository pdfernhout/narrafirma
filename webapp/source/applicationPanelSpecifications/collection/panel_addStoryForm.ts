import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addStoryForm",
    modelClass: "StoryForm",
    panelFields: [
        {
            id: "questionForm_shortName",
            valueType: "string",
            displayType: "text",
            displayName: "Title",
            displayPrompt: "Please enter a short <strong>name</strong> for the story form, so we can refer to it elsewhere in the project. (It must be unique within the project.)"
        },
        {
            id: "questionForm_title",
            valueType: "string",
            displayType: "text",
            displayName: "Title",
            displayPrompt: "Please enter a <strong>title</strong> to be shown at the top of the story form."
        },
        {
            id: "questionForm_startText",
            valueType: "string",
            displayType: "textarea",
            displayName: "Introduction",
            displayPrompt: "Please enter an <strong>introduction</strong> to be shown at the start of the story form, after the title."
        },
        {
            id: "questionForm_image",
            valueType: "string",
            displayType: "text",
            displayName: "Image",
            displayPrompt: "You can link to a <strong>logo</strong> or other image to show at the top of the form."
        },
        {
            id: "questionForm_elicitingQuestions",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_chooseElicitingQuestion",
            displayName: "Eliciting questions",
            displayPrompt: "Add one or more <strong>eliciting questions</strong>, choosing from those you already wrote."
        },
        {
            id: "questionForm_storyQuestions",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_chooseStoryQuestion",
            displayName: "Story questions",
            displayPrompt: "Add one or more <strong>questions about stories</strong>, choosing from those you already wrote."
        },
        {
            id: "questionForm_participantQuestions",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_chooseParticipantQuestion",
            displayName: "Participant questions",
            displayPrompt: "Add one or more <strong>questions about participants</strong>, choosing from those you already wrote."
        },
        {
            id: "questionForm_endText",
            valueType: "string",
            displayType: "textarea",
            displayName: "End of form text",
            displayPrompt: "Please enter any <strong>closing text</strong> to be shown at the end of the form."
        },
        {
            id: "questionForm_participantGroups",
            valueType: "string",
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "Which participant <strong>groups</strong> is this story form intended for? (This information will not appear on the form; it's just for your records.)"
        },
        {
            id: "questionForm_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "If you'd like to make any <strong>notes</strong> to yourself about this form, you can make them here. (They won't appear on the form.)"
        },
        {
            id: "questionForm_preview",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "previewQuestionForm",
            displayName: "Question form preview",
            displayPrompt: "Preview question form"
        }        
    ]
};

export = panel;

