import generateRandomUuid = require("../lib/dojox/uuid/generateRandomUuid");
import lang = require("../lib/dojo/_base/lang");
import m = require("../lib/mithril/mithril");

"use strict";

// Accessibility References:
// http://usabilitygeek.com/10-free-web-based-web-site-accessibility-evaluation-tools/
// http://validator.w3.org/mobile/
// http://achecker.ca/checker/index.php#output_div [first used testing tool]
// http://webaim.org/techniques/forms/controls

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
 X Dialog version
 X Call validation for each story
 * (Optional) Reporting validation errors inline
 * (Optional for now) Call translate
 X After survey is sent, make the form read-only somehow
 X Accessibility [at least the basics]
 */

export function buildSurveyForm(surveyDiv, questionnaire, doneCallback, previewMode) {  
    console.log("buildSurveyForm questions", questionnaire);
    
    var startText = questionnaire.startText;
    // TODO: Translate
    if (!startText) startText = 'Please help by taking a short survey. The data you enter will be sent to the server only at the end when you press the "submit survey" button.';
    
    var startQuestions = [];
    
    if (previewMode) {
        startQuestions.push({id: "__survey-local_" + "previewMode", displayName: "previewMode", displayClass: "narrafirma-preview", displayPrompt: "Previewing story form; results will not be saved.", displayType: "header", valueOptions:[]});
    }
    
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
    initialStoryQuestions.push({id: "__survey_" + "storyName", displayName: "storyName", displayPrompt: "Please give your story a name.", displayType: "text", valueOptions:[]});
    
    var allStoryQuestions = initialStoryQuestions.concat(questionnaire.storyQuestions);
            
    var participantQuestions = [{id: "__survey_" + "participantHeader", displayName: "participantHeader", displayPrompt: "About you", displayType: "header", valueOptions: []}];
    participantQuestions = participantQuestions.concat(questionnaire.participantQuestions);

    // TODO: For testing
    // participantQuestions.push({id: "test1", displayName: "test1", displayPrompt: "test checkbox", displayType: "checkbox", valueOptions:[]});
    // participantQuestions.push({id: "test2", displayName: "test2", displayPrompt: "test boolean", displayType: "boolean", valueOptions:[]});
    // participantQuestions.push({id: "test3", displayName: "test3", displayPrompt: "test radiobuttons", displayType: "radiobuttons", valueOptions:["one", "two", "three"]});
    
    var timestampStart = new Date();
    
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
    
    var stories = surveyResult.stories;
    
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
    
    function makeLabelForStory(story, index) {
        var storyLabel = story.__survey_storyName;
        if (storyLabel) storyLabel = storyLabel.trim();
        if (!storyLabel) {
            storyLabel = 'untitled story #' + (index + 1);
        } else {
            storyLabel = '"' + storyLabel + '"';
        }
        return storyLabel;
    }
         
    // submitted can be one of: "never", "pending", "failed", "success"
    var submitted = "never";
    
    function submitSurvey(surveyResult, wizardPane, doneCallback) {
        console.log("submitting survey...");
        
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
   
    var idsMade = {};
    var idCount = 0;
    
    function getIdForText(text) {
        if (!idsMade["$" + text]) {
            idsMade["$" + text] = idCount++;
        }
            
        return "surveyField_" + idsMade["$" + text];
    }
    
    function displayQuestion(model, fieldSpecification) {
        var fieldID = fieldSpecification.id;
        if (model) {
            fieldID = (model._storyID || model._participantID) + "__" + fieldID;
        }

        var displayType = fieldSpecification.displayType;
        var questionLabel = [
            m("span", {"class": "narrafirma-survey-prompt"}, fieldSpecification.displayPrompt),
            m("br")
        ];
        
        function makeLabel() {
            // The for attribute of the label element must refer to a form control.
            questionLabel[0].attrs["for"] = getIdForText(fieldID);
            questionLabel[0].tag = "label";
        }
        
        var parts = [];
        function makeLegend() {
            // Do nothing for now
            parts.unshift(m("legend", questionLabel[0]));
            questionLabel = [];
        }
        
        var value = null;
        if (model) value = model[fieldSpecification.id];
        if (value === undefined) value = "";
        
        function change(event, value) {
            if (event) value = event.target.value;
            // console.log("onchange", fieldSpecification.id, value);
            model[fieldSpecification.id] = value;
            // TODO: redraw on value change seems not needed in this survey case, since values do not affect anything about rest of application?
            // redraw();
            // Except for one case. Could there be more?
            if (fieldSpecification.id === "__survey_storyName") redraw();
        }
        
        var standardValueOptions = {
            value: value,
            id: getIdForText(fieldID),
            onchange: change
        };
        
        if (displayType === "label") {
            // Nothing to do
        } else if (displayType === "header") {
            // Nothing to do; bolding done using style
        } else if (displayType === "text") {
            makeLabel();
            parts = [
                m("input", standardValueOptions),
                m("br")
            ];
        } else if (displayType === "textarea") {
            makeLabel();
            parts = [
                m("textarea", standardValueOptions),
                m("br")
            ];
        } else if (displayType === "checkbox") {
            makeLabel();
            parts = [
                 m("input[type=checkbox]", {id: getIdForText(fieldID), checked: value, onchange: function(event) {change(null, event.target.checked);}}),
                 m("br")
             ];
        } else if (displayType === "checkboxes") {
            // The for attribute of the label element must refer to a form control.
            delete questionLabel[0].attrs["for"];
            if (!value) {
                value = {};
                model[fieldSpecification.id] = value;
            }
            parts = [
                fieldSpecification.valueOptions.map(function (option, index) {
                    var optionID = getIdForText(fieldID + "_" + option);
                    return [
                        m("input[type=checkbox]", {id: optionID, checked: !!value[option], onchange: function(event) {value[option] = event.target.checked; change(null, value); } }),
                        m("label", {"for": optionID}, option),
                        m("br")
                    ];
                })
            ];
            makeLegend();
            parts = [m("fieldset", parts)];
        } else if (displayType === "radiobuttons") {
            // The for attribute of the label element must refer to a form control.
            delete questionLabel[0].attrs["for"];
            parts = [
                fieldSpecification.valueOptions.map(function (option, index) {
                    var optionID = getIdForText(fieldID + "_" + option);
                    return [
                        m("input[type=radio]", {id: optionID, value: option, name: fieldSpecification.id, checked: value === option, onchange: lang.partial(change, null, option) }),
                        m("label", {"for": optionID}, option), 
                        m("br")
                    ];
                })
            ];
            makeLegend();
            parts = [m("fieldset", parts)];
        } else if (displayType === "boolean") {
            // The for attribute of the label element must refer to a form control.
            delete questionLabel[0].attrs["for"];
            parts = [
                m("input[type=radio]", {id: getIdForText(fieldID + "_yes"), value: true, name: fieldSpecification.id, checked: value === true, onchange: lang.partial(change, null, true) }),
                m("label", {"for": getIdForText(fieldID + "_yes")}, "yes"),
                m("br"),
                m("input[type=radio]", {id: getIdForText(fieldID + "_no"), value: false, name: fieldSpecification.id, checked: value === true, onchange: lang.partial(change, null, false) }),
                m("label", {"for": getIdForText(fieldID + "_no")}, "no"),
                m("br")
            ];
            makeLegend();
            parts = [m("fieldset", parts)];
        } else if (displayType === "select") {
            makeLabel();
            var selectOptions = [];
            var defaultOptions = {value: ''};
            if (!value) defaultOptions.selected = 'selected';
            selectOptions.push(m("option", defaultOptions, '-- select --'));
            selectOptions = selectOptions.concat(
                fieldSpecification.valueOptions.map(function (optionValue, index) {
                    var optionOptions = {value: optionValue};
                    // console.log("optionValue, value", optionValue, value, optionValue === value);
                    if (optionValue === value) optionOptions.selected = 'selected';
                    return m("option", optionOptions, optionValue);
                })
            );
            
            parts = [
                m("select", standardValueOptions, selectOptions),
                m("br")
            ];
        } else if (displayType === "slider") {
            makeLabel();
            // Could suggest 0-100 to support <IE10 that don't have range input -- or coudl do polyfill
            // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";
            parts = [
                m("span", {class: "narrafirma-survey-low"}, fieldSpecification.displayConfiguration[0]),
                m('span', {class: "narrafirma-survey-slider"}, m('input[type="range"]', standardValueOptions)),
                m('span', {class: "narrafirma-survey-high"}, fieldSpecification.displayConfiguration[1])
            ];
        } else {
            parts = [
                m("span", {style: {"font-weight": "bold"}}, "UNFINISHED: " + fieldSpecification.displayType),
                m("br")
            ];
        }

        if (parts.length) {
            parts = m("div", {class: "narrafirma-survey-question-internal"}, parts);
        }
        
        if (questionLabel) {
            parts = questionLabel.concat(parts);
        }
        
        var classString = "narrafirma-survey-question-external narrafirma-survey-question-type-" + displayType;
        if (fieldSpecification.displayClass) {
        	classString += " " + fieldSpecification.displayClass;
        }
        return m("div", {class: classString}, parts);
    }
    
    function displayStoryQuestions(story, index) {
        var storylabel = makeLabelForStory(story, index);
        var result = [
            // m("span", {class: "narrafirma-survey-story-label", style: {"font-weight": "bold"}}, "Story #" + (index + 1)),
            // m("br"),

            m("button", {
                class: "narrafirma-survey-delete-story-button",
                onclick: function () {
                    // TODO: Only confirm if the story has a title or text
                    if (!confirm("Are you sure you want to delete this story (" + storylabel + ")?")) return;
                    stories.splice(index, 1);
                    redraw();
                }
            //}, "Delete this story (" + storylabel + ")"),
            }, "Delete this story"),
            m("hr"),
            
            allStoryQuestions.map(lang.partial(displayQuestion, story))
        ];
        
        var evenOrOdd = (index % 2 === 1) ? "narrafirma-survey-story-odd" : "narrafirma-survey-story-even";
        // A locally unique key needs to be defined so Mithril can track deletions and inserts without rebuilding DOM nodes
        return m("div", {key: story._storyID, "class": "narrafirma-survey-story " + evenOrOdd}, result); 
    }
    
    function redraw() {
        console.log("About to redraw");
        m.render(surveyDiv, view());
    }
    
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
        
        console.log("Submit survey validated");
        
        // TODO: Fix no-longer-correct name from Dojo version
        var wizardPane = {
            forward: function () {
                console.log("survey sending success" + (previewMode ? " [preview mode only]" : ""));
                submitted = "success";
                redraw();
            },
            failed: function () {
                console.log("survey sending failed");
                submitted = "failed";
                redraw();
            }
        };
        
        submitted = "pending";
        submitSurvey(surveyResult, wizardPane, doneCallback);
        
        redraw();
    }
    
    function submitButtonOrWaitOrFinal() {
        if (submitted === "never") {
            return m("button", {class: "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed}, "Submit Survey"+ (previewMode ? " [preview mode only]" : ""));
        } else if (submitted === "failed") {
            return m("div", [
                "Sending to server failed. Please try again...",
                m("br"),
                m("button", {class: "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed}, "Resubmit Survey"+ (previewMode ? " [preview mode only]" : ""))
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
    
    var tagsToMakeReadOnly = {
        "input": true,
        "select": true,
        "textarea": true,
        "button": true
    };
    
    // Make survey read-only after sent to server
    // Recursive function derived from: http://lhorie.github.io/mithril-blog/when-css-lets-you-down.html
    function makeReadOnly(root, parent) {
        if (!root) {
            return root;
        } 
       
        if (root instanceof Array) {
            for (var i = 0; i < root.length; i++) {
                makeReadOnly(root[i], parent);
            }
            return;
        } 
        
        if (root.children) {
            makeReadOnly(root.children, root);
        } 
        
        if (typeof root === "object" && root.tag in tagsToMakeReadOnly) {
            // console.log("makeReadOnly", root);
            if (root.tag === "textarea" || (root.tag === "input" && !root.attrs.type)) {
                // Ensure text fields still have copy available
                root.attrs.readOnly = true;
            } else {
                root.attrs.disabled = true;
            }
        }
        
        return root;
    }
    
    function anotherStoryButton() {
    	return m("div", {"class": "narrafirma-survey-tell-another-story-button-panel"}, [
			"Would you like to tell another story?",
			 m("button", {class: "narrafirma-survey-tell-another-story-button", onclick: tellAnotherStory}, "Yes, I'd like to tell another story")
		]);
    }

    var view = function() {
        var result = m("div", [
            startQuestions.map(function(question, index) {
                return m("div", [displayQuestion(null, question)]);
            }),
            stories.map(function(story, index) {
                return displayStoryQuestions(story, index);
            }),
            anotherStoryButton(),
            participantQuestions.map(function(question, index) {
                return m("div", [displayQuestion(surveyResult.participantData, question)]);
            }),
            submitButtonOrWaitOrFinal()
            /* 
            m("hr"),
            m("button", {
                onclick: function() {
                    redraw();
                    console.log("stories", stories);
                    console.log("participantData", surveyResult.participantData);
                }
            }, "Redraw (for debugging)") 
            */
        ]);
        
        if (submitted === "pending" || submitted === "success") {
            makeReadOnly(result);
        }
        
        return result;
    };
    
    redraw();
}