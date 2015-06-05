define([
    "dojo/_base/array",
    "dojox/uuid/generateRandomUuid"
], function(
    array,
    generateRandomUuid
){
    "use strict";
    
    /* TODO:
     * All widget types:
     X   boolean
     X   radiobuttons
     X   checkbox
     *   (maybe) image
     *   (maybe) togglebutton
     * Multiple eliciting questions
     * Storing data in model
     * Add styling classes
     * Dialog version
     * Call validation for each story
     * (Optional) Reporting validation errors inline
     * (Optional for now) Call translate
     */
    
    /* global m */

    var timestampStart;
    
    // Panel builder needs to be configured further if buttons or grids are used
    // var panelBuilder = new PanelBuilder();
    
    function storeSurveyResult(pointrelClient, projectIdentifier, storyCollectionIdentifier, completedSurvey, wizardPane) {
        var surveyResultWrapper  = {
            projectIdentifier: projectIdentifier,
            storyCollectionIdentifier: storyCollectionIdentifier,
            surveyResult: completedSurvey
        };
        
        pointrelClient.createAndSendChangeMessage("surveyResults", "surveyResult", surveyResultWrapper, null, function(error, result) {
            if (error) {
                console.log("Problem saving survey result", error);
                // TODO: Translate
                // alert("Problem saving survey result");
                alert("Problem saving survey result.\nPlease try to submit the survey result later;\nCould not write new survey result to server:\n" + error);
                return;
            }
            console.log("Survey result stored");
            if (wizardPane) alert("Survey result stored");
            if (wizardPane) wizardPane.forward();
        });
    }
    
    function submitSurvey(surveyResultsWithModels, wizardPane, doneCallback) {
        var answers = {};
        console.log("submitSurvey pressed");
        
        var timestampEnd = new Date();
        
        surveyResultsWithModels.timestampEnd = timestampEnd.toISOString();
        surveyResultsWithModels.timeDuration_ms = timestampEnd.getTime() - timestampStart.getTime(); 
        
        var surveyResult = getPlainValue(surveyResultsWithModels);
           
        console.log("survey answers", surveyResult);
        
        doneCallback("submitted", surveyResult, wizardPane);
    }

   function validateStoryQuestionsModel(storyQuestionsModel, allowEmptyBypass) {
       // TODO: Translate
       var elicitingQuestion = storyQuestionsModel.get("__survey_elicitingQuestion");
       var storyName = storyQuestionsModel.get("__survey_storyName");
       var storyText = storyQuestionsModel.get("__survey_storyText");
       
       // Until support deleting stories, allow progress with out entering anything...
       if (allowEmptyBypass && !storyText && !storyName) {
           // alert("It looks like you don't want to tell a story right now for this page; that's OK");
           return true;
       }
       
       if (!elicitingQuestion) {
           alert("Please select a question before proceeding");
           return false;
       }
       
       var bypassText = "\n(or clear both the story name field and the story response field if you don't want to enter a story on this page)";
       if (!allowEmptyBypass) bypassText = "";
       
       if (!storyText) {
           alert("Please enter some text in the story response field before proceeding" + bypassText);
           return false;
       }
       
       if (!storyName) {
           alert("Please give your story a name before proceeding" + bypassText);
           return false;
       }
       
       return true;
   }
   
   function displayQuestion(question) {
       var displayType = question.displayType;
       if (displayType === "label") {
           return m("div", [question.displayPrompt, m("br"), m("br")]);
       } else if (displayType === "header") {
           return m("div", {style: {"font-weight": "bold"}}, [question.displayPrompt, m("br"), m("br")]);
       } else if (displayType === "text") {
           return m("div", [
               question.displayPrompt,
               m("br"),
               m("input"),
               m("br"),
               m("br")
           ]);
       } else if (displayType === "textarea") {
           return m("div", [
               question.displayPrompt,
               m("br"),
               m("textarea"),
               m("br"),
               m("br")
           ]);
       } else if (displayType === "checkbox") {
           return m("div", [
                question.displayPrompt,
                m("br"),
                m("input[type=checkbox]"),
                m("br"),
                m("br")
            ]);
       } else if (displayType === "checkboxes") {
           return m("div", [
                question.displayPrompt,
                m("br"),
                question.valueOptions.map(function (option, index) {
                    return [m("input[type=checkbox]"), option, m("br")];
                }),
                m("br")
            ]);
       } else if (displayType === "radiobuttons") {
           return m("div", [
                question.displayPrompt,
                m("br"),
                question.valueOptions.map(function (option, index) {
                    return [m("input[type=radio]", {value: option, name: question.id}), option, m("br")];
                }),
                m("br")
            ]);
       } else if (displayType === "boolean") {
           return m("div", [
                question.displayPrompt,
                m("br"),
                m("input[type=radio]", {value: true, name: question.id}),
                "yes",
                m("br"),
                m("input[type=radio]", {value: false, name: question.id}),
                "no",
                m("br"),
                m("br")
            ]);
       } else if (displayType === "select") {
           return m("div", [
                question.displayPrompt,
                m("br"),
                m("select",
                    // TODO: Would not select frst item if had value
                    [m("option", {selected: "selected", disabled: "disabled", hidden: "hidden", value: ''}, '')].concat(
                        question.valueOptions.map(function (value, index) {
                        var optionOptions = {value: value};
                        // if (??value.indexOf(option) !== -1) opts.selected = 'selected';
                        return m("option", optionOptions, value);
                    }))
                ),
                m("br"),
                m("br")
            ]);
       } else if (displayType === "slider") {
           console.log("slider", question);
           return m("div", [
               question.displayPrompt + " (0-100)",
               m("br"),
               question.displayConfiguration[0],
               m('input[type="range"]'),
               question.displayConfiguration[1],
               m("br"),
               m("br")
           ]);
       } else {
           return m("div", {style: {"font-weight": "bold"}}, ["UNFINISHED: " + question.displayType, m("br"), m("br")]);
       }
   }
    
    function buildSurveyForm(surveyDiv, questionnaire, doneCallback) {  
        console.log("buildSurveyForm questions", questionnaire);
        
        var startText = questionnaire.startText;
        // TODO: Translate
        if (!startText) startText = 'Please help by taking a short survey. The data you enter will be sent to the server only at the end when you press the "submit survey" button.';
        
        var startQuestions = [];
        if (questionnaire.title) {
            startQuestions.push({id: "__survey-local_" + "title", displayName: "title", displayPrompt: questionnaire.title, displayType: "header", valueOptions:[]});
            document.title = questionnaire.title;
        }
        
        startQuestions.push({id: "__survey-local_" + "startText", displayName: "startText", displayPrompt: startText, displayType: "label", valueOptions:[]});

        var endText = questionnaire.endText;
         // TODO: Translate
        if (!endText) endText = "Thank you for taking the survey.";
            
        var endQuestions = [];
        endQuestions.push({id: "__survey-local_" + "endText", displayName: "endText", displayPrompt: endText, displayType: "label", valueOptions:[]});

        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: What if these IDs for storyText and storyName are not unique?
        var initialStoryQuestions = [];
        var singlePrompt = null;
        // initialStoryQuestions.push({id: "__survey_" + "questionHeader", displayName: "questionHeader", displayPrompt: "Story", displayType: "header", valueOptions: []});
        if (elicitingQuestionPrompts.length !== 1) {
            initialStoryQuestions.push({id: "__survey_" + "elicitingQuestion", displayName: "elicitingQuestion", displayPrompt: "Please choose a question to which you would like to respond:", displayType: "radiobuttons", valueOptions: elicitingQuestionPrompts});
            initialStoryQuestions.push({id: "__survey_" + "storyText", displayName: "storyText", displayPrompt: "Please enter your response in the box below:", displayType: "textarea", valueOptions:[]});
        } else {
            singlePrompt = elicitingQuestionPrompts[0];
            initialStoryQuestions.push({id: "__survey_" + "storyText", displayName: "storyText", displayPrompt: singlePrompt, displayType: "textarea", valueOptions:[]});
        }
        initialStoryQuestions.push({id: "__survey_" + "storyName", displayName: "storyName", displayPrompt: "Please give your story a name", displayType: "text", valueOptions:[]});
        
        var allStoryQuestions = initialStoryQuestions.concat(questionnaire.storyQuestions);
                
        var participantQuestions = [{id: "__survey_" + "participantHeader", displayName: "participantHeader", displayPrompt: "About you", displayType: "header", valueOptions: []}];
        participantQuestions = participantQuestions.concat(questionnaire.participantQuestions);

        // TODO: For testing
        participantQuestions.push({id: "test1", displayName: "test1", displayPrompt: "test checkbox", displayType: "checkbox", valueOptions:[]});
        participantQuestions.push({id: "test2", displayName: "test2", displayPrompt: "test boolean", displayType: "boolean", valueOptions:[]});
        participantQuestions.push({id: "test3", displayName: "test3", displayPrompt: "test radiobuttons", displayType: "radiobuttons", valueOptions:["one", "two", "three"]});

        
        timestampStart = new Date();
        
        var surveyResultsWithModels = {
            __type: "org.workingwithstories.QuestionnaireResponse",
            // TODO: Think about whether to include entire questionnaire or something else perhaps
            questionnaire: questionnaire,
            responseID: generateRandomUuid(),
            stories: [],
            participantData: null,
            timestampStart: "" + timestampStart.toISOString()
        };
        
        var participantID = generateRandomUuid();
        var participantDataModel = {
            __type: "org.workingwithstories.ParticipantData",
            _participantID: participantID
        };
        
        surveyResultsWithModels.participantData = participantDataModel;

        // m.render(surveyDiv, m("div", ["Hello survey ============== b", "More!!"]));
        
        console.log("startQuestions", startQuestions);
        
        var stories = [];
        
        function addStory() {
            var storyQuestionsModel = {
                __type: "org.workingwithstories.Story",
                _storyID: generateRandomUuid(),
                _participantID: participantID
            };
            if (singlePrompt) storyQuestionsModel.__survey_elicitingQuestion = singlePrompt;         
            stories.push(storyQuestionsModel);
        }
            
        addStory();
        
        function displayStoryQuestions(story, index) {
            var result = [
                m("span", {style: {"font-weight": "bold"}}, "Story #" + (index + 1)),
                m("br"),

                allStoryQuestions.map(displayQuestion),
                
                m("button", {
                    onclick: function () {
                        // TODO: Only confirm if the story has a title or text
                        if (!confirm("Are you sure you want to delete this story?")) return;
                        stories.splice(index, 1);
                        redraw();
                    }
                }, "Delete this story (#" + (index + 1) + ")")
            ];
            
            return result; 
        }
        
        var submitted = false;
        
        function redraw() {
            console.log("About to redraw");
            m.render(surveyDiv, view());
        }
        
        function submitButtonPressed() {
            submitted = "pending";
            setTimeout(function() {
                if (Math.random() > 0.5) {
                    submitted = true;
                } else {
                    submitted = "failed";
                }
                redraw();
            }, 2000);
            redraw();
        }
        
        function submitButtonOrWaitOrFinal() {
            if (submitted === false) {
                return m("button", {onclick: submitButtonPressed}, "Submit survey");
            } else if (submitted === "failed") {
                return m("div", [
                    "Sending to server failed. Please try again...",
                    m("br"),
                    m("button", {onclick: submitButtonPressed}, "Submit survey")
                ]);
            } else if (submitted === "pending") {
                return m("div", ["Sending survey result to server... Please wait..."]);
            } else {
                return endQuestions.map(function(question, index) {
                    console.log("question", question);
                    return m("div", [
                        "Server accepted survey OK",
                        m("br"),
                        displayQuestion(question),
                        m("br"),
                        m("br")
                    ]);
                });
            }
        }
        
        function tellAnotherStory() {
            stories.push({});
            redraw();
        }
        
        var view = function() {
            return m("div", [
                startQuestions.map(function(question, index) {
                    console.log("question", question);
                    return m("div", [displayQuestion(question)]);
                }),
                m("hr"),
                stories.map(function(story, index) {
                    console.log("story map", story);
                    return displayStoryQuestions(story, index).concat(m("hr"));
                }),
                "If you would like to, you can tell another story.",
                m("button", {onclick: tellAnotherStory}, "Add another story"),
                m("hr"),
                participantQuestions.map(function(question, index) {
                    console.log("question", question);
                    return m("div", [displayQuestion(question)]);
                }),
                submitButtonOrWaitOrFinal(),
                m("button", {onclick: function() { redraw(); console.log("stories", stories);} }, "Redraw (for debugging)")
            ]);
        };
        
        redraw();
    }

    // Caller should call wizard.forward() on successful save to see the last page, and provide a retry message otherwise
    // Caller may also want to call (the returned) surveyDialog.hide() to close the window, or let the user do it.
    function openSurveyDialog(questionnaire, callback) {  
        console.log("openSurveyDialog questionnaire", questionnaire);
        
        var surveyDialog;
        var form;
        
        form = buildSurveyForm(questionnaire, callback);
   
        surveyDialog = new Dialog({
            title: "Take Survey",
            content: form
            // style: "width: 800px; height: 700px;"
        });
        
        // This will free the dialog when it is closed to avoid a memory leak
        surveyDialog.connect(surveyDialog, "onHide", function(e) {
            console.log("destroying surveyDialog");
            surveyDialog.destroyRecursive();
        });
                
        surveyDialog.show();
        
        return surveyDialog;
    }

    return {
        openSurveyDialog: openSurveyDialog,
        buildSurveyForm: buildSurveyForm,
        storeSurveyResult: storeSurveyResult
    };
});