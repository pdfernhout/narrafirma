define([
    "dijit/Dialog",
    "dojox/uuid/generateRandomUuid",
    "dojo/_base/lang",
    "lib/mithril/mithril"
], function(
    Dialog,
    generateRandomUuid,
    lang,
    m
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
     X Storing data in model
     X Add styling classes
     * Dialog version
     X Call validation for each story
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
    
    function submitSurvey(surveyResult, wizardPane, doneCallback) {
        var answers = {};
        console.log("submitSurvey pressed");
        
        var timestampEnd = new Date();
        
        surveyResult.timestampEnd = timestampEnd.toISOString();
        surveyResult.timeDuration_ms = timestampEnd.getTime() - timestampStart.getTime(); 
           
        console.log("survey answers", surveyResult);
        
        doneCallback("submitted", surveyResult, wizardPane);
    }

    function validateStoryQuestionsModel(storyQuestionsModel, index) {
        var storyIndex = "story #" + (index + 1);
        
        // TODO: Translate
        var elicitingQuestion = storyQuestionsModel.__survey_elicitingQuestion;
        var storyName = storyQuestionsModel.__survey_storyName;
        var storyText = storyQuestionsModel.__survey_storyText;

        if (!elicitingQuestion) {
            alert("Before proceeding, please select the question to which you are responding for " + storyIndex);
            return false;
        }

        if (!storyText) {
            alert("Please enter a story before proceeding for " + storyIndex);
            return false;
        }

        if (!storyName) {
            alert("Please give your story a name before proceeding for " + storyIndex);
            return false;
        }

        return true;
    }
   
    function displayQuestion(model, fieldSpecification) {
        var displayType = fieldSpecification.displayType;
        var questionLabel = [
            m("span", {class: "narrafirma-prompt"}, fieldSpecification.displayPrompt),
            m("br")
        ];

        var value = null;
        if (model) value = model[fieldSpecification.id];
        if (value === undefined) value = "";
        
        function change(event, value) {
            if (event) value = event.target.value;
            console.log("onchange", fieldSpecification.id, value);
            model[fieldSpecification.id] = value;
            // TODO: redraw on value change seems not needed in this survey case, since values do not affect anything about rest of application?
            // redraw();
        }
        
        var standardValueOptions = {
            value: value,
            onchange: change
        };
        
        var parts = [];
        if (displayType === "label") {
            // Nothing to do
        } else if (displayType === "header") {
            // Nothing to do -- bolding done using style
        } else if (displayType === "text") {
            parts = [
                m("input", standardValueOptions),
                m("br")
            ];
        } else if (displayType === "textarea") {
            parts = [
                m("textarea", standardValueOptions),
                m("br")
            ];
        } else if (displayType === "checkbox") {
            parts = [
                 m("input[type=checkbox]", {checked: value, onchange: function(event) {change(null, event.target.checked);}}),
                 m("br")
             ];
        } else if (displayType === "checkboxes") {
            if (!value) {
                value = {};
                model[fieldSpecification.id] = value;
            }
            parts = [
                fieldSpecification.valueOptions.map(function (option, index) {
                    return [
                        m("input[type=checkbox]", {checked: !!value[option], onchange: function(event) {value[option] = event.target.checked; change(null, value); } }),
                        option,
                        m("br")
                    ];
                })
            ];
        } else if (displayType === "radiobuttons") {
            parts = [
                fieldSpecification.valueOptions.map(function (option, index) {
                    return [
                        m("input[type=radio]", {value: option, name: fieldSpecification.id, checked: value === option, onchange: lang.partial(change, null, option) }),
                        option, 
                        m("br")
                    ];
                })
            ];
        } else if (displayType === "boolean") {
            parts = [
                m("input[type=radio]", {value: true, name: fieldSpecification.id, checked: value === true, onchange: lang.partial(change, null, true) }),
                "yes",
                m("br"),
                m("input[type=radio]", {value: false, name: fieldSpecification.id, checked: value === true, onchange: lang.partial(change, null, false) }),
                "no",
                m("br")
            ];
        } else if (displayType === "select") {
            var selectOptions = [];
            if (!value) selectOptions.push(m("option", {selected: "selected", disabled: "disabled", hidden: "hidden", value: ''}, ''));
            selectOptions = selectOptions.concat(
                fieldSpecification.valueOptions.map(function (optionValue, index) {
                    var optionOptions = {value: optionValue};
                    if (optionValue === value) optionOptions.selected = 'selected';
                    return m("option", optionOptions, optionValue);
                })
            );
            
            parts = [
                m("select", standardValueOptions, selectOptions),
                m("br")
            ];
        } else if (displayType === "slider") {
            // Could suggest 0-100 to support <IE10 that don't have range input -- or coudl do polyfill
            // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";
            parts = [
                m("span", {class: "narrafirma-low"}, fieldSpecification.displayConfiguration[0]),
                m('span', {class: "narrafirma-slider"}, m('input[type="range"]', standardValueOptions)),
                m('span', {class: "narrafirma-high"}, fieldSpecification.displayConfiguration[1])
            ];
        } else {
            parts = [
                m("span", {style: {"font-weight": "bold"}}, "UNFINISHED: " + fieldSpecification.displayType),
                m("br")
            ];
        }

        if (parts.length) {
            parts = m("div", {class: "narrafirma-question-internal"}, parts);
        }
        
        return m("div", {class: "narrafirma-question-external narrafirma-question-type-" + displayType}, questionLabel.concat(parts));
    }
    
    var redraw;
    
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
        /*
        participantQuestions.push({id: "test1", displayName: "test1", displayPrompt: "test checkbox", displayType: "checkbox", valueOptions:[]});
        participantQuestions.push({id: "test2", displayName: "test2", displayPrompt: "test boolean", displayType: "boolean", valueOptions:[]});
        participantQuestions.push({id: "test3", displayName: "test3", displayPrompt: "test radiobuttons", displayType: "radiobuttons", valueOptions:["one", "two", "three"]});
        */
        
        timestampStart = new Date();
        
        var surveyResult = {
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
        
        surveyResult.participantData = participantDataModel;

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
                m("span", {class: "narrafirma-story-label", style: {"font-weight": "bold"}}, "Story #" + (index + 1)),
                m("br"),

                allStoryQuestions.map(lang.partial(displayQuestion, story)),
                
                m("button", {
                    class: "narrafirma-delete-story-button",
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
        
        function redrawFunction() {
            console.log("About to redraw");
            m.render(surveyDiv, view());
        }
        
        redraw = redrawFunction;
        
        function validate() {
            // TODO: Improve validation
            if (!stories.length) {
                alert("Please add at least one story before proceeding.");
                return false;
            }
            for (var i = 0; i < stories.length; i++) {
                var story = stories[i];
                if (!validateStoryQuestionsModel(story, i)) return false;
            }
            return true;
        }
        
        function submitButtonPressed() {
            if (!validate()) return;
            
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
                return m("button", {class: "narrafirma-submit-survey-button", onclick: submitButtonPressed}, "Submit survey");
            } else if (submitted === "failed") {
                return m("div", [
                    "Sending to server failed. Please try again...",
                    m("br"),
                    m("button", {class: "narrafirma-submit-survey-button", onclick: submitButtonPressed}, "Submit survey")
                ]);
            } else if (submitted === "pending") {
                return m("div", ["Sending survey result to server... Please wait..."]);
            } else {
                return endQuestions.map(function(question, index) {
                    return m("div", [
                        "Server accepted survey OK",
                        m("br"),
                        displayQuestion(null, question),
                        m("br"),
                        m("br")
                    ]);
                });
            }
        }
        
        function tellAnotherStory() {
            addStory();
            redraw();
        }
        
        var view = function() {
            return m("div", [
                startQuestions.map(function(question, index) {
                    return m("div", [displayQuestion(null, question)]);
                }),
                m("hr"),
                stories.map(function(story, index) {
                    return displayStoryQuestions(story, index).concat(m("hr"));
                }),
                "If you would like to, you can tell another story.",
                m("button", {class: "narrafirma-tell-another-story-button", onclick: tellAnotherStory}, "Add another story"),
                m("hr"),
                participantQuestions.map(function(question, index) {
                    return m("div", [displayQuestion(surveyResult.participantData, question)]);
                }),
                m("hr"),
                submitButtonOrWaitOrFinal(),
                m("hr"),
                m("button", {
                    onclick: function() {
                        redraw();
                        console.log("stories", stories);
                        console.log("participantData", surveyResult.participantData);
                    }
                }, "Redraw (for debugging)")
            ]);
        };
        
        redraw();
    }

    // Caller should call wizard.forward() on successful save to see the last page, and provide a retry message otherwise
    // Caller may also want to call (the returned) surveyDialog.hide() to close the window, or let the user do it.
    function openSurveyDialog(questionnaire, callback) {  
        console.log("openSurveyDialog questionnaire", questionnaire);
        
        var surveyDiv = document.createElement("div");
        
        buildSurveyForm(surveyDiv, questionnaire, callback);
   
        var surveyDialog = new Dialog({
            title: "Take Survey",
            content: surveyDiv
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