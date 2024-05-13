import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "panel_addStoryForm",
    modelClass: "StoryForm",
    panelFields: [

        {
            id: "questionForm_shortName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            required: true,
            displayName: "Short name",
            displayPrompt: "Enter a short <strong>name</strong> for the story form. It is required and must be unique within the project."
        },

        // show/hide buttons
        {
            id: "questionForm_preview",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "previewQuestionForm",
            displayName: "Question form preview",
            displayPrompt: "Preview",
            displayIconClass: "previewButtonImage",
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },
        {
            id: "questionForm_showOrHideAdvancedOptions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideAdvancedOptions",
            displayName: "Show/hide advanced options",
            displayIconClass: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "hideButtonImage" : "showButtonImage"; },
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "Hide advanced options" : "Show advanced options"; },
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },
        {
            id: "questionForm_showOrHideImportOptions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideImportOptions",
            displayName: "Show/hide import options",
            displayIconClass: function(panelBuilder, model) { return Globals.clientState().showImportOptions() ? "hideButtonImage" : "showButtonImage"; },
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showImportOptions() ? "Hide import options" : "Show import options"; },
            displayPreventBreak: false,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },

        // start - basic
        {
            id: "questionForm_header_start",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Starting out"
        },
        {
            id: "questionForm_image",
            valueType: "string",
            displayType: "text",
            displayName: "Image",
            displayPrompt: "To show an <strong>image</strong> at the top of the form (above the title), enter a web link (URL) here.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_title",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Title",
            displayPrompt: "Enter a <strong>title</strong> to be shown at the top of the story form."
        },
        {
            id: "questionForm_startText",
            valueType: "string",
            displayType: "textarea",
            displayName: "Introduction",
            displayPrompt: "Enter an <strong>introduction</strong> to be shown at the start of the story form, after the title."
        },
        // start - advanced
        
        {
            id: "questionForm_video",
            valueType: "string",
            displayType: "text",
            displayName: "Video",
            displayPrompt: `To display an <strong>introductory video</strong> (after the text introduction), enter one of two things here.
                For an <strong>mp4 file</strong> hosted on a web site, enter the video's web link (URL).
                For a <strong>streaming</strong> video, login to your streaming service (YouTube, Vimeo, etc.), select the video,
                click Share or Embed, copy the HTML code given to you (it should start with an "iframe" tag), and paste it here.
                (You may have to set embedding permissions for the video.)`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_textAfterVideo",
            valueType: "string",
            displayType: "textarea",
            displayName: "Introduction",
            displayPrompt: "Enter any text you want to show <strong>after the introductory video</strong> here.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        // choose eliciting question(s) - basic
        {
            id: "questionForm_header_chooseElicitingQuestions",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Choosing a story-eliciting question"
        },
        {
            id: "questionForm_elicitingQuestions",
            valueType: "none",
            displayType: "storyFormQuestionsChooser",
            displayConfiguration: "Eliciting",
            displayName: "Eliciting questions",
            displayPrompt: "Add one or more <strong>eliciting questions</strong> to your story form, choosing from those you have already written."
        },
        // choose eliciting question(s) - advanced
        {
            id: "questionForm_chooseElicitingQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "These questions only apply if you have more than one elicitation question.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },       
        {
            id: "questionForm_chooseQuestionText",
            valueType: "string",
            displayType: "text",
            displayName: "Choose question text",
            displayPrompt: `How do you want to ask participants to <strong>choose a question to answer</strong>? 
                (Default: \"Please choose a question to which you would like to respond.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_elicitingQuestionGraphName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Eliciting question graph name",
            displayPrompt: `What do you want to call the graph that shows <strong>which eliciting question people answered</strong>? (Default:  \"Eliciting question.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_errorMessage_noElicitationQuestionChosen",
            valueType: "string",
            displayType: "text",
            displayName: "Message for no elicitation question chosen",
            displayPrompt: `If the <b>participant does not choose an elicitation question</b>, what do you want the reminder message to say?
                (Default:  \"Please select the question to which story # is a response.\"
                with the number sign (#) replaced with the number of the story on the page.)`,
                displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },


        // tell and name story - basic
        {
            id: "questionForm_header_enterStory",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Writing and naming a story"
        },
        {
            id: "questionForm_enterStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Enter story text",
            displayPrompt: `How do you want to ask participants to <strong>enter</strong> their story? 
                (Default:  \"Please enter your response in the box below.\")`
        },
        {
            id: "questionForm_nameStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Name story text",
            displayPrompt: `
                How do you want to ask participants to <strong>name</strong> their story? 
                (Default: \"Please give your story a name.\")`
        },
        // tell and name story - advanced
        {
            id: "questionForm_errorMessage_noStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Message for no story text",
            displayPrompt: `If the <b>participant does not enter any text</b> for a story, what do you want the reminder message to say?
                (Default:  \"Please enter some text for story #.\"
                with the number sign (#) replaced with the number of the story on the page.)`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_errorMessage_noStoryName",
            valueType: "string",
            displayType: "text",
            displayName: "Message for no story name",
            displayPrompt: `If a <b>story has no name</b>, what do you want the reminder message to say?
                (Default:  \"Please give story # a name.\"
                with the number sign (#) replaced with the number of the story on the page.`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        // answer questions about story - basic
        {
            id: "questionForm_header_answerQuestionsAboutStory",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Answering questions about the story"
        },
        {
            id: "questionForm_storyQuestions",
            valueType: "none",
            displayType: "storyFormQuestionsChooser",
            displayConfiguration: "Story",
            displayName: "Story questions",
            displayPrompt: "Add one or more <strong>questions about stories</strong> to your story form, choosing from those you have already written."
        },
        // answer questions about story - advanced
        {
            id: "questionForm_sliderValuePrompt",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Slider value prompt",
            displayPrompt: `
                What do you want the popup dialog to say if the participant clicks on a <b>slider value</b> to change it? 
                (Default: \"Enter a new value.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_sliderDoesNotApply",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Slider does-not-apply label",
            displayPrompt: `
                What do you want the slider <b>does not apply</b> label to say? 
                (Default: \"Does not apply\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_selectNoChoiceName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Select no-choice name",
            displayPrompt: `
                For a drop-down <strong>select</strong> question, what do you want the choice to say when the participant has made no choice? 
                (Default: \"-- select --\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_booleanYesNoNames",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Boolean yes/no names",
            displayPrompt: `
                For a <strong>boolean</strong> (yes/no) question, what do you want the yes/no choices to actually say?
                Please enter them with a forward slash (/) between them. 
                (Default: \"yes/no")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_maxNumAnswersPrompt",
            valueType: "string",
            displayType: "text",
            displayName: "Max number of answers prompt",
            displayPrompt: `
                For <b>multi-choice questions with a maximum number of answers</b>, 
                how do you want to <i>tell</i> participants how many answers they can choose?
                Enter what you want the story form to say <i>after</i> each limited-answer question text.
                Include a hashtag sign (#) where you want the number to appear.
                If this box is left blank, \"(Please choose up to # answers.)\" will be added to each limited-answer question text.`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        // answer questions about participant - basic
        {
            id: "questionForm_header_answerQuestionsAboutParticipant",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Answering questions about the participant"
        },
        {
            id: "questionForm_participantQuestions",
            valueType: "none",
            displayType: "storyFormQuestionsChooser",
            displayConfiguration: "Participant",
            displayName: "Participant questions",
            displayPrompt: "Add one or more <strong>questions about participants</strong> to your story form, choosing from those you have already written."
        },
        // answer questions about participant - advanced
        {
            id: "questionForm_aboutYouText",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "About you text",
            displayPrompt: `
                How would you like to introduce your <strong>participant questions</strong>? 
                (Default: \"About you\").`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        // tell another story, delete story - basic
        {
            id: "questionForm_header_tellAnotherOrDelete",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Telling another story"
        },
        {
            id: "questionForm_tellAnotherStoryText",
            valueType: "string",
            displayType: "text",
            displayName: "Tell another story text",
            displayPrompt: `
                How do you want to ask participants if they want to <strong>tell another</strong> story? 
                (Default: \"Would you like to tell another story?\")`
        },
        // tell another story, delete story - advanced
        {
            id: "questionForm_tellAnotherStoryButtonText",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Tell another story button text",
            displayPrompt: `
                What do you want the <strong>tell another story button</strong> to say? 
                (Default: \"Yes, I'd like to tell another story\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_deleteStoryButtonText",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Delete story button text",
            displayPrompt: `What would you like the <b>delete a story</b> button to say?
                (Default:  \"Delete this story.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_deleteStoryDialogPrompt",
            valueType: "string",
            displayType: "text",
            displayName: "Delete story dialog prompt",
            displayPrompt: `What would you like the <b>confirm dialog</b> button to say when somebody wants to delete a story?
                (Default: \"Are you sure you want to delete this story?\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        // submit survey - basic
        {
            id: "questionForm_submitFormHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Finishing the form"
        },
        {
            id: "questionForm_endText",
            valueType: "string",
            displayType: "textarea",
            displayName: "End of form text",
            displayPrompt: `Please enter some <strong>closing text</strong> to be shown on the form after the survey has been accepted. 
                It might be a thank you or an invitation to participate further.
                (Default: \"Thank you for taking the survey.\")`
        },
        {
            id: "questionForm_maxNumStories",
            valueType: "string",
            displayType: "select",
            valueOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "no limit"],
            displayName: "Maximum stories",
            displayPrompt: "<b>How many stories</b> should a participant be able to enter in one session?"
        },
        {
            id: "questionForm_showSurveyResultPane",
            valueType: "string",
            displayType: "select",
            valueOptions: ["never", "only on survey", "only on data entry", "always"],
            displayName: "Show survey result pane?",
            displayPrompt: "Should participants to be able to <strong>view and copy</strong> their stories after they have been submitted?"
        },
        // submit survey - advanced
        {
            id: "questionForm_submitSurveyButtonText",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Submit survey button text",
            displayPrompt: `What would you like the button to <b>submit</b> the story form to say?
                (Default: \"Submit Survey.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_sendingSurveyResultsText",
            valueType: "string",
            displayType: "text",
            displayName: "Sending survey results text",
            displayPrompt: `When survey results are <b>being sent</b> to the server, what message should the participant see?
                (Default: \"Now sending survey result to server. Please wait . . .\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_couldNotSaveSurveyText",
            valueType: "string",
            displayType: "text",
            displayName: "Could not save survey text",
            displayPrompt: `If there is a <b>problem connecting</b> to the server, what message should be shown to the participant?
                (Default:  \"The server could not save your survey. Please try again.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_resubmitSurveyButtonText",
            valueType: "string",
            displayType: "text",
            displayName: "Re-submit survey button text",
            displayPrompt: `If there has been a problem connecting to the server, what would you like the button to <b>re-submit</b> the story form to say?
                (Default: \"Resubmit Survey.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_surveyStoredText",
            valueType: "string",
            displayType: "text",
            displayName: "Survey stored",
            displayPrompt: `How would you like to tell the participant that their <b>survey has been stored</b>?
                (Default: \"Your survey has been accepted and stored.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_thankYouPopupText",
            valueType: "string",
            displayType: "textarea",
            displayName: "Thank you text",
            displayPrompt: `Please enter a message to be shown in the <strong>pop-up alert</strong> after the participant submits their story.
                (Default: \"Your contribution has been added to the story collection. Thank you.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_surveyResultPaneHeader",
            valueType: "string",
            displayType: "textarea",
            displayName: "Survey result pane header",
            displayPrompt: `What should the <strong>header above the submitted stories</strong> say?  
            (Default: \"Here are the stories you contributed. You can copy this text and paste it somewhere else to keep your own copy of what you said.\")`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        // other customizations - basic
        {
            id: "questionForm_header_otherCustomizations",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Other customizations",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "questionForm_customCSS",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom CSS",
            displayPrompt: "You can enter <strong>custom CSS</strong> that modifies the survey elements here. (For more information on how this works, see the help system.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },
        // other customizations - advanced
        {
            id: "questionForm_customCSSForPrint",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom CSS for Printing",
            displayPrompt: "You can enter additional custom CSS to use when the story form is <strong>printed</strong>.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        //  import
        {
            id: "questionForm_import_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import options",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_showImportGuide",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showImportGuide",
            displayName: "Show import help",
            displayPreventBreak: true,
            displayIconClass: "showButtonImage",
            displayPrompt: "Show import help",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_storyTitleColumnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Story title column name",
            displayPrompt: "In your data file, what is the data column header for the  <strong>story title</strong>?",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_storyTextColumnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Story text column name",
            displayPrompt: "What is the data column header for the  <strong>story text</strong>?",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_storyCollectionDateColumnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Story collection date column name",
            displayPrompt: "What is the data column header for the  <strong>date of story collection</strong>?",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_storyFormLanguageColumnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Story form language column name",
            displayPrompt: "What is the data column header for the <strong>language</strong> of the survey on which the story was entered?",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },

        {
            id: "questionForm_import_columnsToAppendToStoryText",
            valueType: "string",
            displayType: "textarea",
            displayName: "Columns to append to story text",
            displayPrompt: "If you want to <strong>append additional text columns to your story text</strong>, enter the column names here, one per line. (See the help system for more details.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_textsToWriteBeforeAppendedColumns",
            valueType: "string",
            displayType: "textarea",
            displayName: "Texts in front of columns to append to story text",
            displayPrompt: 'If you entered columns to append to story texts above, enter <strong>introductory texts</strong> to be written before each appended text. (If this box is left blank, the separator " --- " will be used.)',
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },

        {
            id: "questionForm_import_elicitingQuestionColumnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Eliciting question column name",
            displayPrompt: "What is the data column header for the  <strong>eliciting question</strong>? (If you have only one eliciting question, you can leave this field blank.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_participantIDColumnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Participant ID column name",
            displayPrompt: "What is the data column header for the  <strong>participant ID</strong> field? (If participants are not identified in your data file, you can leave this field blank.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_minWordsToIncludeStory",
            valueType: "string",
            displayType: "select",
            valueOptions: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "25", "30", "35", "40", "45", "50", "60", "70", "80", "90", "100"],
            displayName: "Minimum words to include story",
            displayPrompt: "<strong>How many words</strong> should a row have in its story text field to be imported?",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_columnsToIgnore",
            valueType: "string",
            displayType: "textarea",
            displayName: "Columns to ignore",
            displayPrompt: "If your story data file has <strong>columns you want to ignore</strong>, enter the column headers here, one per line.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_stringsToRemoveFromHeaders",
            valueType: "string",
            displayType: "textarea",
            displayName: "Texts to remove from headers",
            displayPrompt: "If your story data file has <strong>texts you need to remove from your column names</strong>, enter the texts here, one per line. (See the help system for an explanation of this function.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },

        {
            id: "questionForm_import_minScaleValue",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Minimum scale value",
            displayPrompt: "In your data file, what is the <strong>minimum value</strong> for your scale questions? (If your scales have different minima, you can enter them separately for each scale question.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_maxScaleValue",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Maximum scale value",
            displayPrompt: "What is the <strong>maximum value</strong> for your scale questions? (If your scales have different maxima, you can enter them separately for each scale question.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_multiChoiceDelimiter",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Multi choice delimiter",
            displayPrompt: `If you have any questions of the type "Multi-choice single-column delimited" or "Multi-choice single-column delimited indexed",
                what text <strong>separates the items</strong> within each cell? (If the separator is a space, don't enter a space here; enter the <i>word</i> "space".)`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_multiChoiceYesIndicator",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Multi choice yes indicator",
            displayPrompt: `If you have any questions of the type "Multi-choice multi-column yes/no", what text <strong>indicates a "Yes" answer</strong>?`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_import_multiChoiceYesQASeparator",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Multi choice Q-A separator",
            displayPrompt: `If you have any questions of the type "Multi-choice multi-column yes/no",
                your column headers must describe the question and answer to be found in each column. 
                NarraFirma assumes that the question name will come first, followed by some text, followed by the answer name, followed by some text (e.g., "Feel about [happy]").
                What is the text <strong>between the question name and the answer name</strong> in each column header?`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); } 
        },
        {
            id: "questionForm_import_multiChoiceYesQAEnding",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Multi choice Q-A separator",
            displayPrompt: `If you have any questions of the type "Multi-choice multi-column yes/no",
                what is the text <strong>after the answer name</strong> in each column header?` ,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_checkCSVDataFile",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "checkCSVDataFileWhileEditingStoryForm",
            displayName: "CSV file check",
            displayIconClass: "checkButtonImage",
            displayPreventBreak: true,
            displayPrompt: "Check stories in CSV file (view log in browser console)...",
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly && !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_exportForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportStoryFormWhileEditingIt_NativeFormat",
            displayName: "Export story form",
            displayIconClass: "exportButtonImage",
            displayPrompt: "Export story form for NarraFirma-native import...",
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly && !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "questionForm_exportForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportStoryFormWhileEditingIt_ExternalFormat",
            displayName: "Export story form",
            displayIconClass: "exportButtonImage",
            displayPrompt: "Export story form for external import...",
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly && !!Globals.clientState().showImportOptions(); }
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
        
        // repeat show/hide buttons at bottom
        {
            id: "questionForm_preview_bottom",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "previewQuestionForm",
            displayName: "Question form preview",
            displayPrompt: "Preview",
            displayIconClass: "previewButtonImage",
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },
        {
            id: "questionForm_showOrHideAdvancedOptions_bottom",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideAdvancedOptions",
            displayName: "Show/hide advanced options",
            displayIconClass: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "hideButtonImage" : "showButtonImage"; },
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "Hide advanced options" : "Show advanced options"; },
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },
        {
            id: "questionForm_showOrHideImportOptions_bottom",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideImportOptions",
            displayName: "Show/hide import options",
            displayIconClass: function(panelBuilder, model) { return Globals.clientState().showImportOptions() ? "hideButtonImage" : "showButtonImage"; },
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showImportOptions() ? "Hide import options" : "Show import options"; },
            displayPreventBreak: false,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },
    ]
};

export = panel;

