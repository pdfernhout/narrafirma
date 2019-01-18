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
            displayName: "Short name",
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
            id: "questionForm_elicitingQuestionGraphName",
            valueType: "string",
            displayType: "text",
            displayName: "Eliciting question graph name",
            displayPrompt: `
                What do you want to call the graph that shows <strong>which eliciting question people answered</strong>?
                If this box is left blank, the graphs will say, \"Eliciting question.\"`,
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

        //  import
        {
            id: "questionForm_import_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import options"
        },
        {
            id: "questionForm_import_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "Use these options to specify how you want to <strong>read stories from a CSV file</strong>. If you are not importing data, you can ignore them."
        },

        {
            id: "questionForm_import_storyTitleColumnName",
            valueType: "string",
            displayType: "text",
            displayName: "Story title column name",
            displayPrompt: "In your data file, what is the data column header for the  <strong>story title</strong>?"
        },
        {
            id: "questionForm_import_storyTextColumnName",
            valueType: "string",
            displayType: "text",
            displayName: "Story text column name",
            displayPrompt: "What is the data column header for the  <strong>story text</strong>?"
        },
        {
            id: "questionForm_import_columnsToAppendToStoryText",
            valueType: "string",
            displayType: "textarea",
            displayName: "Columns to append to story text",
            displayPrompt: "If you want to <strong>append additional text columns to your story text</strong>, enter the column names here, one per line. (See the help system for more details.)"
        },
        {
            id: "questionForm_import_textsToWriteBeforeAppendedColumns",
            valueType: "string",
            displayType: "textarea",
            displayName: "Texts in front of columns to append to story text",
            displayPrompt: 'If you entered columns to append to story texts above, enter <strong>introductory texts</strong> to be written before each appended text. (If this box is left blank, the separator " --- " will be used.)'
        },

        {
            id: "questionForm_import_elicitingQuestionColumnName",
            valueType: "string",
            displayType: "text",
            displayName: "Eliciting question column name",
            displayPrompt: "What is the data column header for the  <strong>eliciting question</strong>? (If you have only one eliciting question, you can leave this field blank.)"
        },
        {
            id: "questionForm_import_participantIDColumnName",
            valueType: "string",
            displayType: "text",
            displayName: "Participant ID column name",
            displayPrompt: "What is the data column header for the  <strong>participant ID</strong> field? (If participants are not identified in your data file, you can leave this field blank.)"
        },
        {
            id: "questionForm_import_minWordsToIncludeStory",
            valueType: "string",
            displayType: "select",
            valueOptions: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "25", "30", "35", "40", "45", "50", "60", "70", "80", "90", "100"],
            displayName: "Minimum words to include story",
            displayPrompt: "<strong>How many words</strong> should a row have in its story text field to be imported?"
        },
        {
            id: "questionForm_import_columnsToIgnore",
            valueType: "string",
            displayType: "textarea",
            displayName: "Columns to ignore",
            displayPrompt: "If your story data file has <strong>columns you want to ignore</strong>, enter the column headers here, one per line."
        },
        {
            id: "questionForm_import_stringsToRemoveFromHeaders",
            valueType: "string",
            displayType: "textarea",
            displayName: "Texts to remove from headers",
            displayPrompt: "If your story data file has <strong>texts you need to remove from your column names</strong>, enter the texts here, one per line. (See the help system for an explanation of this function.)"
        },

        {
            id: "questionForm_import_minScaleValue",
            valueType: "string",
            displayType: "text",
            displayName: "Minimum scale value",
            displayPrompt: "In your data file, what is the <strong>minimum value</strong> for your scale questions? (If your scales have different minima, you can enter them separately for each scale question.)"
        },
        {
            id: "questionForm_import_maxScaleValue",
            valueType: "string",
            displayType: "text",
            displayName: "Maximum scale value",
            displayPrompt: "What is the <strong>maximum value</strong> for your scale questions? (If your scales have different maxima, you can enter them separately for each scale question.)"
        },
        {
            id: "questionForm_import_multiChoiceDelimiter",
            valueType: "string",
            displayType: "text",
            displayName: "Multi choice delimiter",
            displayPrompt: `If you have any questions of the type "Multi-choice single-column delimited" or "Multi-choice single-column delimited indexed",
                what text <strong>separates the items</strong> within each cell? (If the separator is a space, don't enter a space here; enter the <i>word</i> "space".)`
        },
        {
            id: "questionForm_import_multiChoiceYesIndicator",
            valueType: "string",
            displayType: "text",
            displayName: "Multi choice yes indicator",
            displayPrompt: `If you have any questions of the type "Multi-choice multi-column yes/no", what text <strong>indicates a "Yes" answer</strong>?`
        },
        {
            id: "questionForm_import_multiChoiceYesQASeparator",
            valueType: "string",
            displayType: "text",
            displayName: "Multi choice Q-A separator",
            displayPrompt: `If you have any questions of the type "Multi-choice multi-column yes/no",
                your column headers must describe the question and answer to be found in each column. 
                NarraFirma assumes that the question name will come first, followed by some text, followed by the answer name, followed by some text (e.g., "Feel about [happy]").
                What is the text <strong>between the question name and the answer name</strong> in each column header?` 
        },
        {
            id: "questionForm_import_multiChoiceYesQAEnding",
            valueType: "string",
            displayType: "text",
            displayName: "Multi choice Q-A separator",
            displayPrompt: `If you have any questions of the type "Multi-choice multi-column yes/no",
                what is the text <strong>after the answer name</strong> in each column header?` 
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
        },
        {
            id: "questionForm_checkCSVDataFile",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "checkCSVDataFileWhileEditingStoryForm",
            displayName: "CSV file check",
            displayPrompt: "Check stories in CSV file (view log in browser console) ...",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        },
        {
            id: "questionForm_exportForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportStoryFormWhileEditingIt_NativeFormat",
            displayName: "Export story form",
            displayPrompt: "Export story form with options for NarraFirma-native import...",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        },
        {
            id: "questionForm_exportForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportStoryFormWhileEditingIt_ExternalFormat",
            displayName: "Export story form",
            displayPrompt: "Export story form with options for external import...",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        }          
        
    ]
};

export = panel;

