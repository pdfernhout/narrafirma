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
            displayPrompt: "Please enter a short <strong>name</strong> for the story form, so we can refer to it elsewhere in the project. <strong>It must be unique within the project.</strong>"
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
            displayPrompt: "Enter the web link (URL) for an <strong>image</strong> to be shown at the top of the form.",
        },
        {
            id: "questionForm_chooseQuestionText",
            valueType: "string",
            displayType: "text",
            displayName: "Choose question text",
            displayPrompt: `
                How do you want to ask participants to <strong>choose a question</strong> they want to answer? 
                (If this field is left blank, the story form will say, \"Please choose a question to which you would like to respond.\")`,
        },
        {
            id: "questionForm_enterStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Enter story text",
            displayPrompt: `
                How do you want to ask participants to <strong>enter</strong> their story? 
                (If this field is left blank, the story form will say, \"Please enter your response in the box below.\")`,
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
            id: "questionForm_nameStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Name story text",
            displayPrompt: `
                How do you want to ask participants to <strong>name</strong> their story? 
                (If this field is left blank, the story form will say, \"Please give your story a name.\")`,
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
            id: "questionForm_tellAnotherStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Tell another story text",
            displayPrompt: `
                How do you want to ask participants if they want to <strong>tell another</strong> story? 
                (If this field is left blank, the story form will say, \"Would you like to tell another story?\")`,
        },
        {
            id: "questionForm_tellAnotherStoryButtonText",
            valueType: "string",
            displayType: "text",
            displayName: "Tell another story button text",
            displayPrompt: `
                What do you want the <strong>tell another story button</strong> to say? 
                (If this field is left blank, the button will say, \"Yes, I'd like to tell another story\")`,
        },
        {
            id: "questionForm_aboutYouText",
            valueType: "string",
            displayType: "text",
            displayName: "About you text",
            displayPrompt: `
                How would you like to title the <strong>participant questions</strong>? 
                (If this field is left blank, the story form will say, \"About you\".)
                `
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
            displayPrompt: `Please enter any <strong>closing text</strong> to be shown on the form after the survey has been accepted. 
                It might be a thank you or an invitation to participate further.
                (If this field is left blank, the story form will say, \"Thank you for taking the survey.\")`
        },
        {
            id: "questionForm_thankYouPopupText",
            valueType: "string",
            displayType: "textarea",
            displayName: "Thank you text",
            displayPrompt: `Please enter a message to be shown in the <strong>pop-up alert</strong> after the participant submits their story.
            (If this field is left blank, the story form will say, \"Your contribution has been added to the story collection. Thank you.\")`
        },
        {
            id: "questionForm_customCSS",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom CSS",
            displayPrompt: "You can enter <strong>custom CSS</strong> that modifies the survey elements here. (For more information on how this works, see the help system.)"
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
            displayPrompt: "Preview Story Form",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        }        
    ]
};

export = panel;

