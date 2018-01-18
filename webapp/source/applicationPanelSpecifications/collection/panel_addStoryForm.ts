import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addStoryForm",
    modelClass: "StoryForm",
    panelFields: [

        // start
        {
            id: "questionForm_startHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Starting the form"
        },
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
            displayPrompt: "Enter a web link (URL) for an <strong>image</strong> to be shown at the top of the form.",
        },

        // choose eliciting question
        {
            id: "questionForm_startHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Choosing an eliciting question"
        },
        {
            id: "questionForm_chooseQuestionText",
            valueType: "string",
            displayType: "text",
            displayName: "Choose question text",
            displayPrompt: `
                How do you want to ask participants to <strong>choose a question</strong> they want to answer? 
                If this box is left blank, the story form will say, \"Please choose a question to which you would like to respond.\"`,
        },
        {
            id: "questionForm_errorMessage_noElicitationQuestionChosen",
            valueType: "string",
            displayType: "text",
            displayName: "Message for no elicitation question chosen",
            displayPrompt: `If the <b>participant does not choose an elicitation question</b>, what do you want the reminder message to say?
                If this box is left blank, the message will say, \"Please select the question to which story # is a response.\"
                A number sign (#) in this box will be replaced with the number of the story on the page.`
        },
        {
            id: "questionForm_elicitingQuestions",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_chooseElicitingQuestion",
            displayName: "Eliciting questions",
            displayPrompt: "Add one or more <strong>eliciting questions</strong> to your story form, choosing from those you have already written."
        },

        // enter story
        {
            id: "questionForm_enterStoryHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Entering and naming the story"
        },
        {
            id: "questionForm_enterStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Enter story text",
            displayPrompt: `
                How do you want to ask participants to <strong>enter</strong> their story? 
                If this box is left blank, the story form will say, \"Please enter your response in the box below.\"`,
        },
        {
            id: "questionForm_errorMessage_noStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Message for no story text",
            displayPrompt: `If the <b>participant does not enter any text</b> for a story, what do you want the reminder message to say?
                If this box is left blank, the message will say, \"Please enter some text for story #.\"
                A number sign (#) in this box will be replaced with the number of the story on the page.`
        },
        {
            id: "questionForm_nameStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Name story text",
            displayPrompt: `
                How do you want to ask participants to <strong>name</strong> their story? 
                If this box is left blank, the story form will say, \"Please give your story a name.\"`,
        },
        {
            id: "questionForm_errorMessage_noStoryName",
            valueType: "string",
            displayType: "text",
            displayName: "Message for no story name",
            displayPrompt: `If a <b>story has no name</b>, what do you want the reminder message to say?
                If this box is left blank, the message will say, \"Please give story # a name.\"
                A number sign (#) in this box will be replaced with the number of the story on the page.`
        },

        // answer questions about story
        {
            id: "questionForm_answerQuestionsAboutStoryHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Answering questions about the story"
        },
        {
            id: "questionForm_storyQuestions",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_chooseStoryQuestion",
            displayName: "Story questions",
            displayPrompt: "Add one or more <strong>questions about stories</strong> to your story form, choosing from those you have already written."
        },
        {
            id: "questionForm_sliderValuePrompt",
            valueType: "string",
            displayType: "text",
            displayName: "Slider value prompt",
            displayPrompt: `
                What do you want the popup dialog to say if the participant clicks on a <b>slider value</b> to change it? 
                If this box is left blank, the popup dialog will say, \"Enter a new value\".`
        },

        // tell another story, delete story
        {
            id: "questionForm_tellAnotherOrDeleteHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Telling another story, deleting a story"
        },
        {
            id: "questionForm_tellAnotherStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Tell another story text",
            displayPrompt: `
                How do you want to ask participants if they want to <strong>tell another</strong> story? 
                If this box is left blank, the story form will say, \"Would you like to tell another story?\"`,
        },
        {
            id: "questionForm_tellAnotherStoryButtonText",
            valueType: "string",
            displayType: "text",
            displayName: "Tell another story button text",
            displayPrompt: `
                What do you want the <strong>tell another story button</strong> to say? 
                If this box is left blank, the button will say, \"Yes, I'd like to tell another story\"`,
        },
        {
            id: "questionForm_deleteStoryButtonText",
            valueType: "string",
            displayType: "text",
            displayName: "Delete story button text",
            displayPrompt: `What would you like the <b>delete a story</b> button to say?
                If this box is left blank, the button will say, \"Delete this story.\"`
        },
        {
            id: "questionForm_deleteStoryDialogPrompt",
            valueType: "string",
            displayType: "text",
            displayName: "Delete story dialog prompt",
            displayPrompt: `What would you like the <b>confirm dialog</b> button to say when somebody wants to delete a story?
                If this box is left blank, the button will say, \"Are you sure you want to delete this story?\"`
        },

        // answer questions about participant
        {
            id: "questionForm_answerQuestionsAboutParticipantHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Answering questions about the participant"
        },
        {
            id: "questionForm_aboutYouText",
            valueType: "string",
            displayType: "text",
            displayName: "About you text",
            displayPrompt: `
                How would you like to introduce your <strong>participant questions</strong>? 
                If this box is left blank, the story form will say, \"About you\".
                `
        },
        {
            id: "questionForm_participantQuestions",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_chooseParticipantQuestion",
            displayName: "Participant questions",
            displayPrompt: "Add one or more <strong>questions about participants</strong> to your story form, choosing from those you have already written."
        },

        // submit survey
        {
            id: "questionForm_submitFormHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Submitting the form"
        },
        {
            id: "questionForm_submitSurveyButtonText",
            valueType: "string",
            displayType: "text",
            displayName: "Submit survey button text",
            displayPrompt: `What would you like the button to <b>submit</b> the story form to say?
                If this box is left blank, the button will say, \"Submit Survey.\"`
        },
        {
            id: "questionForm_sendingSurveyResultsText",
            valueType: "string",
            displayType: "text",
            displayName: "Sending survey results text",
            displayPrompt: `When survey results are <b>being sent</b> to the server, what message should the participant see?
                If this box is left blank, the button will say, \"Now sending survey result to server. Please wait . . .\"`
        },
        {
            id: "questionForm_couldNotSaveSurveyText",
            valueType: "string",
            displayType: "text",
            displayName: "Could not save survey text",
            displayPrompt: `If there is a <b>problem connecting</b> to the server, what message should be shown to the participant?
                If this box is left blank, the message will read, \"The server could not save your survey. Please try again.\"`
        },
        {
            id: "questionForm_resubmitSurveyButtonText",
            valueType: "string",
            displayType: "text",
            displayName: "Re-submit survey button text",
            displayPrompt: `If there has been a problem connecting to the server, what would you like the button to <b>re-submit</b> the story form to say?
                If this box is left blank, the button will say, \"Resubmit Survey.\"`
        },
        {
            id: "questionForm_surveyStoredText",
            valueType: "string",
            displayType: "text",
            displayName: "Survey stored",
            displayPrompt: `How would you like to tell the participant that their <b>survey has been stored</b>?
                If this box is left blank, the story form will say, \"Your survey has been accepted and stored.\"`
        },
        {
            id: "questionForm_endText",
            valueType: "string",
            displayType: "textarea",
            displayName: "End of form text",
            displayPrompt: `Please enter some <strong>closing text</strong> to be shown on the form after the survey has been accepted. 
                It might be a thank you or an invitation to participate further.
                If this box is left blank, the story form will say, \"Thank you for taking the survey.\"`
        },
        {
            id: "questionForm_thankYouPopupText",
            valueType: "string",
            displayType: "textarea",
            displayName: "Thank you text",
            displayPrompt: `Please enter a message to be shown in the <strong>pop-up alert</strong> after the participant submits their story.
            If this box is left blank, the story form will say, \"Your contribution has been added to the story collection. Thank you.\"`
        },
        {
            id: "questionForm_showSurveyResultPane",
            valueType: "string",
            displayType: "select",
            valueOptions: ["never", "only on survey", "only on data entry", "always"],
            displayName: "Show survey result pane?",
            displayPrompt: "Should participants to be able to <strong>view and copy</strong> their stories after they have been submitted?"
        },
        {
            id: "questionForm_surveyResultPaneHeader",
            valueType: "string",
            displayType: "textarea",
            displayName: "Survey result pane header",
            displayPrompt: `What should the <strong>header above the submitted stories</strong> say? If this box is left blank, the header will say, 
            \"Here are the stories you contributed. You can copy this text and paste it somewhere else to keep your own copy of what you said.\"`
        },
       

        // other customizations
        {
            id: "questionForm_otherCustomizationsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Other customizations"
        },
        {
            id: "questionForm_customCSS",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom CSS",
            displayPrompt: "You can enter <strong>custom CSS</strong> that modifies the survey elements here. (For more information on how this works, see the help system.)"
        },
        {
            id: "questionForm_customCSSForPrint",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom CSS for Printing",
            displayPrompt: "You can enter additional custom CSS to use when the story form is <strong>printed</strong>."
        },
        {
            id: "questionForm_maxNumStories",
            valueType: "string",
            displayType: "select",
            valueOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "no limit"],
            displayName: "Maximum stories",
            displayPrompt: "<b>How many stories</b> should a participant be able to enter in one session?"
        },

        // notes to self
        {
            id: "questionForm_otherNotesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Notes to yourself"
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

