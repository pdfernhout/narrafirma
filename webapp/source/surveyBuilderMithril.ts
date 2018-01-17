import m = require("mithril");

import generateRandomUuid = require("./pointrel20150417/generateRandomUuid");
import sanitizeHTML = require("./sanitizeHTML");

"use strict";

// TODO: Fix overly long lines and remove next line disabling check
/* tslint:disable:max-line-length */

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
 
var idsMade = {};
var idCount = 0;

function getIdForText(text) {
    if (!idsMade["$" + text]) {
        idsMade["$" + text] = idCount++;
    }
        
    return "panelField_" + idsMade["$" + text];
}

export function loadCSS(document, cssText) {
    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(styleElement);

    if (styleElement.styleSheet) { // IE
        styleElement.styleSheet.cssText = cssText;
    } else { // other browsers
        styleElement.innerHTML = cssText;
    }
  }
  
// Redrawing

var globalRedrawCallback;

export function setGlobalRedrawFunction(callback) {
    globalRedrawCallback = callback;
}

function globalRedraw(source = undefined) {
    globalRedrawCallback(source);
}

function addAllowedHTMLToPrompt(text) {
    try {
        var result = sanitizeHTML.generateSanitizedHTMLForMithril(text);
        return result;
    } catch (error) {
        alert(error);
        return text
    }
}

function buildQuestionLabel(fieldSpecification) {
    return [
        // TODO: Generalize this css class name
        m("span", {"class": "narrafirma-survey-prompt"}, addAllowedHTMLToPrompt(fieldSpecification.displayPrompt)),
        m("br")
    ];
}

// Builder is used by main application, and is passed in for compatibility
function displayQuestion(builder, model, fieldSpecification, questionnaire) {
    var fieldID = fieldSpecification.id;
    if (model) {
        fieldID = (model.storyID || model.participantID) + "__" + fieldID;
    }

    var displayType = fieldSpecification.displayType;
    var questionLabel = buildQuestionLabel(fieldSpecification);
    
    function makeLabel() {
        // The for attribute of the label element must refer to a form control.
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";
    }
    
    var parts: any = [];
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
        model[fieldSpecification.id] = value;
        // TODO: redraw on value change seems not needed in this survey case, since values do not affect anything about rest of application?
        // redraw();
        // Except for one case. Could there be more?
        if (fieldSpecification.id === "storyName") globalRedraw();
        // yes, there is one more case - the slider needs to interact with the "Does not apply" checkbox
        if (fieldSpecification.displayType === "slider") globalRedraw();
    }
    
    function isEmpty(value) {
        return value === undefined || value === null || value === "";
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
        var checkboxText = "";
        if (fieldSpecification.displayConfiguration) {
            checkboxText = fieldSpecification.displayConfiguration;
        }
        parts = [
             m("input[type=checkbox]", {
                    id: getIdForText(fieldID), 
                    checked: value, 
                    onchange: function(event) { change(null, event.target.checked); }}),
             m("label", {"for": getIdForText(fieldID)}, checkboxText),
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
                var optionName;
                var optionValue;
                if (typeof option === "string") {
                    optionName = option;
                    optionValue = option;
                } else {
                    optionName = option.name;
                    optionValue = option.value;                    
                }
                var optionID = getIdForText(fieldID + "_" + option);
                return [
                    m("input[type=checkbox]", {
                        id: optionID, 
                        checked: !!value[optionValue], 
                        onchange: function(event) {
                            value[optionValue] = event.target.checked; 
                            change(null, value); 
                        } 
                    }),
                    m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(optionName)),
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
                var optionName;
                var optionValue;
                if (typeof option === "string") {
                    optionName = option;
                    optionValue = option;
                } else {
                    optionName = option.name;
                    optionValue = option.value;                    
                }
                var optionID = getIdForText(fieldID + "_" + optionValue);
                return [
                    m("input[type=radio]", {id: optionID, value: optionValue, name: fieldSpecification.id, checked: value === optionValue, onchange: change.bind(null, null, optionValue) }),
                    m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(optionName)), 
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
            m("input[type=radio]", {id: getIdForText(fieldID + "_yes"), value: true, name: fieldSpecification.id, checked: value === true, onchange: change.bind(null, null, true) }),
            m("label", {"for": getIdForText(fieldID + "_yes")}, "yes"),
            m("br"),
            m("input[type=radio]", {id: getIdForText(fieldID + "_no"), value: false, name: fieldSpecification.id, checked: value === false, onchange: change.bind(null, null, false) }),
            m("label", {"for": getIdForText(fieldID + "_no")}, "no"),
            m("br")
        ];
        makeLegend();
        parts = [m("fieldset", parts)];
    } else if (displayType === "select") {
        makeLabel();
        var selectOptions = [];
        var defaultOptions = {
            name: '',
            value: '',
            selected: undefined
        };
        if (!value) defaultOptions.selected = 'selected';
        selectOptions.push(m("option", defaultOptions, '-- select --'));
        selectOptions = selectOptions.concat(
            fieldSpecification.valueOptions.map(function (option, index) {
                var optionName;
                var optionValue;
                if (typeof option === "string") {
                    optionName = option;
                    optionValue = option;
                } else {
                    optionName = option.name;
                    optionValue = option.value;                    
                }
                var optionOptions = {value: optionValue, selected: undefined};
                if (optionValue === value) optionOptions.selected = 'selected';
                return m("option", optionOptions, optionName);
            })
        );
        
        parts = [
            m("select", standardValueOptions, selectOptions),
            m("br")
        ];
    } else if (displayType === "slider") {
        makeLabel();
        var checkboxID = getIdForText(fieldID) + "_doesNotApply";
        var sliderValueOptions = {
            value: value,
            id: getIdForText(fieldID),
            onchange: change,
            min: 0,
            max: 100,
            step: 1
        };
        
        var leftSideText = "";
        var rightSideText = "";
        var doesNotApplyText = "Does not apply";
        if (fieldSpecification.displayConfiguration) {
            if (fieldSpecification.displayConfiguration.length > 1) {
                leftSideText = fieldSpecification.displayConfiguration[0];
                rightSideText = fieldSpecification.displayConfiguration[1];
            }
            if (fieldSpecification.displayConfiguration.length > 2) {
                doesNotApplyText = fieldSpecification.displayConfiguration[2];
            }
        }
        
        // Could suggest 0-100 to support <IE10 that don't have range input -- or could do polyfill
        // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";
        const valuePrompt = questionnaire.sliderValuePrompt || "Type a new value";
        parts = [
            m("span", {"class": "narrafirma-survey-low-arrow"}, "◀ "),
            m("span", {"class": "narrafirma-survey-low"}, leftSideText),
            m('span', {"class": "narrafirma-survey-slider"}, m('input[type="range"]', sliderValueOptions)),
            m('span', {"class": "narrafirma-survey-high"}, rightSideText),
            m('span', {"class": "narrafirma-survey-high-arrow"}, " ▶"),
            m("span", {"class": "narrafirma-survey-value", onclick: function(event) {
                var newValueText = prompt(valuePrompt, value);
                var newValue = parseInt(newValueText);
                if (newValue && newValue >= 0 && newValue <= 100) { 
                    sliderValueOptions.value = newValue;
                    model[fieldSpecification.id] = "" + newValue; 
                    globalRedraw();
                }
            }}, value),
            m("br"),
            m('input[type="checkbox"]', {
                "class": "narrafirma-survey-does-not-apply",
                id: checkboxID,
                checked: isEmpty(sliderValueOptions.value),
                onclick: function(event) { 
                    var isChecked = event.target.checked; 
                    if (isChecked) { 
                        model[fieldSpecification.id] = ""; 
                        globalRedraw();
                    } else {
                        model[fieldSpecification.id] = "50";
                        globalRedraw();
                    }
                }
            }),
            m("label", {"for": checkboxID}, doesNotApplyText)
        ];
    } else {
        parts = [
            m("span", {style: {"font-weight": "bold"}}, "UNFINISHED: " + fieldSpecification.displayType),
            m("br")
        ];
    }

    if (parts.length) {
        parts = m("div", {"class": "narrafirma-survey-question-internal"}, parts);
    }
    
    if (questionLabel) {
        parts = questionLabel.concat(parts);
    }
    
    var classString = "narrafirma-survey-question-external narrafirma-survey-question-type-" + displayType;
    if (fieldSpecification.displayClass) {
        classString += " " + fieldSpecification.displayClass;
    }
    return m("div", {key: fieldID, "class": classString}, parts);
}

interface SurveyOptions {
    previewMode?: boolean;
    ignoreTitleChange?: boolean;
}

export function buildSurveyForm(surveyDiv, questionnaire, doneCallback, surveyOptions: SurveyOptions = {}) {  
    console.log("buildSurveyForm questions", questionnaire);
    
    var startQuestions = [];
    
    if (surveyOptions.previewMode) {
        startQuestions.push({id: "previewMode_header", displayName: "previewMode", displayClass: "narrafirma-preview", displayPrompt: "Previewing story form; results will not be saved.", displayType: "header", valueOptions: []});
    }
    
    if (questionnaire.title) {
        startQuestions.push({id: "title_header", displayName: "title", displayPrompt: questionnaire.title, displayType: "header", valueOptions: [], displayClass: "narrafirma-survey-title"});
        if (!surveyOptions.ignoreTitleChange) document.title = sanitizeHTML.removeHTMLTags(questionnaire.title);
    }
    
    var startText = questionnaire.startText || 'Please help by taking a short survey. The data you enter will be sent to the server only at the end when you press the "submit survey" button.';
    startQuestions.push({id: "startText_label", displayName: "startText", displayPrompt: startText, displayType: "label", valueOptions: [], displayClass: "narrafirma-survey-start-text"});

    var endText = questionnaire.endText || "Thank you for taking the survey.";
    var thankYouPopupText = questionnaire.thankYouPopupText || "Your contribution has been added to the story collection. Thank you.";
    var endQuestions = [];
    endQuestions.push({id: "endText_label", displayName: "endText", displayPrompt: endText, displayType: "label", valueOptions: [], displayClass: "narrafirma-survey-end-text"});

    // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
    var elicitingQuestionOptions = [];
    for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
        var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
        var value = elicitingQuestionSpecification.id || elicitingQuestionSpecification.text;
        var option = {name: elicitingQuestionSpecification.text, value: value};
        elicitingQuestionOptions.push(option);
    }
    
    // TODO: What if these IDs for storyText and storyName are not unique?
    var initialStoryQuestions = [];
    var singlePrompt = null;

    if (elicitingQuestionOptions.length !== 1) {
        const chooseQuestionText = questionnaire.chooseQuestionText || "Please choose a question to which you would like to respond.";
        initialStoryQuestions.push({id: "elicitingQuestion", displayName: "elicitingQuestion", displayPrompt: chooseQuestionText, displayType: "radiobuttons", valueOptions: elicitingQuestionOptions, displayClass: "narrafirma-eliciting-questions"});
        const enterStoryText = questionnaire.enterStoryText || "Please enter your response in the box below.";
        initialStoryQuestions.push({id: "storyText", displayName: "storyText", displayPrompt: enterStoryText, displayType: "textarea", valueOptions: [], displayClass: "narrafirma-story-text"});
    } else {
        singlePrompt = elicitingQuestionOptions[0];
        initialStoryQuestions.push({id: "storyText", displayName: "storyText", displayPrompt: singlePrompt.name, displayType: "textarea", valueOptions: [], displayClass: "narrafirma-story-text"});
    }
    const nameStoryText = questionnaire.nameStoryText || "Please give your story a name.";
    initialStoryQuestions.push({id: "storyName", displayName: "storyName", displayPrompt: nameStoryText, displayType: "text", valueOptions: [], displayClass: "narrafirma-story-name"});
    
    var allStoryQuestions = initialStoryQuestions.concat(questionnaire.storyQuestions);
            
    const aboutYouText = questionnaire.aboutYouText || "About you";
    var participantQuestions = [{id: "participantHeader", displayName: "participantHeader", displayPrompt: aboutYouText, displayType: "header", valueOptions: [], displayClass: "narrafirma-participant-header"}];
    participantQuestions = participantQuestions.concat(questionnaire.participantQuestions);

    var timestampStart = new Date();
    
    var surveyResult = {
        __type: "org.workingwithstories.QuestionnaireResponse",
        // TODO: Think about whether to include entire questionnaire or something else perhaps
        questionnaire: questionnaire,
        responseID: generateRandomUuid("QuestionnaireResponse"),
        stories: [],
        participantData: null,
        timestampStart: "" + timestampStart.toISOString()
    };
    
    var participantID = generateRandomUuid("Participant");
    var participantDataModel = {
        __type: "org.workingwithstories.ParticipantData",
        participantID: participantID
    };
    
    surveyResult.participantData = participantDataModel;

    // m.render(surveyDiv, m("div", ["Hello survey ============== b", "More!!"]));
    
    var stories = surveyResult.stories;
    
    function addStory() {
        var storyQuestionsModel = {
            __type: "org.workingwithstories.Story",
            storyID: generateRandomUuid("Story"),
            participantID: participantID,
            elicitingQuestion: undefined
        };

        if (singlePrompt) storyQuestionsModel.elicitingQuestion = singlePrompt.value;         
        stories.push(storyQuestionsModel);
    }
        
    addStory();
    
    function makeLabelForStory(story, index) {
        var storyLabel = story.storyName;
        if (storyLabel) storyLabel = storyLabel.trim();
        if (!storyLabel) {
            storyLabel = 'Untitled story #' + (index + 1);
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
        var elicitingQuestion = storyQuestionsModel.elicitingQuestion;
        var storyName = storyQuestionsModel.storyName;
        var storyText = storyQuestionsModel.storyText;

        if (!elicitingQuestion) {
            var prompt = questionnaire.errorMessage_noElicitationQuestionChosen || "Please select the question to which story # is a response.";
            prompt = prompt.replace("#", index + 1);
            alert(prompt);
            return false;
        }

        if (!storyText) {
            var prompt = questionnaire.errorMessage_noStoryText || "Please enter some text for story #.";
            prompt = prompt.replace("#", index + 1);
            alert(prompt);
            return false;
        }

        if (!storyName) {
            var prompt = questionnaire.errorMessage_noStoryName || "Please give story # a name.";
            prompt = prompt.replace("#", index + 1);
            alert(prompt);
            return false;
        }

        return true;
    }
    
    function displayStoryQuestions(story, index) {
        var storylabel = makeLabelForStory(story, index);
        var storyQuestionsPart = allStoryQuestions.map(function(question, index) {
            return displayQuestion(null, story, question, questionnaire)
        });

        const deleteStoryButtonText = questionnaire.deleteStoryButtonText || "Delete this story";
        const deleteStoryPrompt = questionnaire.deleteStoryDialogPrompt || "Are you sure you want to delete this story?";
        var result = [
            m("button", {
                "class": "narrafirma-survey-delete-story-button",
                onclick: function () {
                    if (!confirm(deleteStoryPrompt + " (" + storylabel + ")")) return;
                    stories.splice(index, 1);
                    redraw();
                }
            }, deleteStoryButtonText),
            m("hr"),
            storyQuestionsPart
        ];
        
        var evenOrOdd = (index % 2 === 1) ? "narrafirma-survey-story-odd" : "narrafirma-survey-story-even";
        // A locally unique key needs to be defined so Mithril can track deletions and inserts without rebuilding DOM nodes
        return m("div", {key: story.storyID, "class": "narrafirma-survey-story " + evenOrOdd}, <any>result); 
    }
    
    function validate() {
        // TODO: Improve validation
        if (!stories.length) {
            alert("Please add at least one story before proceeding."); // this is never used?
            return false;
        }
        for (var i = 0; i < stories.length; i++) {
            var story = stories[i];
            if (!validateStoryQuestionsModel(story, i)) return false;
        }
        return true;
    }
    
    function calculateDerivedFields() {
        stories.forEach((story) => {
            story.numStoriesTold = "" + stories.length;
        });
    }
    
    function submitButtonPressed() {
        if (!validate()) return;

        calculateDerivedFields();
        
        console.log("Submit survey validated");
        
        // TODO: Fix no-longer-correct name from Dojo version
        var wizardPane = {
            forward: function () {
                console.log("survey sending success" + (surveyOptions.previewMode ? " (preview)" : ""));
                submitted = "success";
                // TODO: Translate
                alert(thankYouPopupText);
                
                redraw("network");
            },
            failed: function () {
                console.log("survey sending failed");
                submitted = "failed";
                // TODO: Translate
                alert("Problem saving survey result; check the console for details.\nPlease try to submit the survey result later.");
                redraw("network");
            }
        };
        
        submitted = "pending";
        submitSurvey(surveyResult, wizardPane, doneCallback);
        
        redraw();
    }
    
    function submitButtonOrWaitOrFinal(): any {

        const submitSurveyButtonText = questionnaire.submitSurveyButtonText || "Submit Survey";
        const couldNotSaveSurveyText = questionnaire.couldNotSaveSurveyText || "The server could not save your survey. Please try again.";
        const sendingSurveyResultsText = questionnaire.sendingSurveyResultsText || "Now sending survey result to server. Please wait . . .";

        if (submitted === "never") {
            return m("button", {"class": "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed}, submitSurveyButtonText + (surveyOptions.previewMode ? " (preview)" : ""));
        } else if (submitted === "failed") {
            const resubmitSurveyButtonText = questionnaire.resubmitSurveyButtonText || "Resubmit Survey";
            return m("div.narrafirma-could-not-save-survey", [
                couldNotSaveSurveyText,
                m("br"),
                m("button", {"class": "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed}, resubmitSurveyButtonText + (surveyOptions.previewMode ? " (preview)" : ""))
            ]);
        } else if (submitted === "pending") {
            return m("div.narrafirma-sending-survey", m("br"), [sendingSurveyResultsText]);
        } else {
            const surveyStoredText = questionnaire.surveyStoredText || "Your survey has been accepted and stored.";
            return endQuestions.map(function(question, index) {
                return m("div", [
                    m("br"),
                    m("div.narrafirma-survey-accepted", [surveyStoredText,
                        m("br"),
                        displayQuestion(null, null, question, questionnaire),
                        m("br")
                ])
                ]);
            });
        }
    }

    function questionNameForResultsPane(question) {
        var questionName = "";
        if (question.displayType !== "header" && question.displayType !== "label") {
            questionName = "* " + question.displayPrompt;
        }
        if (question.displayType === "slider") {
            if (question.displayConfiguration) { // for stories
                if (question.displayConfiguration.length > 1) {
                    questionName += " (0 = " + question.displayConfiguration[0] + "; 100 = " + question.displayConfiguration[1] + ")";
                }
            } else if (question.valueOptions) { // for participant data
                if (question.valueOptions.length > 1) {
                    questionName += " (0 = " + question.valueOptions[0] + "; 100 = " + question.valueOptions[1] + ")";
                }
            }
        }
        return questionName;
    }

    function surveyResultPanel() {
        var parts = [];

        stories.forEach((story) => {
            allStoryQuestions.forEach((question) => {
                var questionName = questionNameForResultsPane(question);
                if (questionName) parts.push(questionName);
                if (question.id in story) {
                    var response = story[question.id];
                    if (typeof response == "object") {
                        var answers = Object.keys(response);
                        for (const answer of answers) {
                            if (response[answer]) parts.push(answer);
                        }
                    } else {
                        parts.push(response);
                    }
                }
            });
            parts.push("");
        });

        participantQuestions.forEach((question) => {
            var questionName = questionNameForResultsPane(question);
            if (questionName) parts.push(questionName);
            if (question.id in surveyResult.participantData) {
                var response = surveyResult.participantData[question.id];
                if (typeof response == "object") {
                    var answers = Object.keys(response);
                    for (const answer of answers) {
                        if (response[answer]) parts.push(answer);
                    }
                } else {
                    parts.push(response);
                }
            }
        });
        const surveyResultPaneHeader = questionnaire.surveyResultPaneHeader || "Here are the stories you contributed. You can copy this text and paste it somewhere else to keep your own copy of what you said.";
        return [m("div", {"class": "narrafirma-survey-result-summary-header"}, surveyResultPaneHeader), 
            m("textarea", {"class": "narrafirma-survey-result-summary"}, parts.join("\n"))];
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
            if (root.tag === "textarea" || (root.tag === "input" && !root.attrs.type)) {
                // Ensure text fields still have copy available
                root.attrs.readOnly = true;
            } else {
                root.attrs.disabled = true;
            }
        }
        
        return root;
    }
    
    function anotherStoryButton(questionnaire) {
        const tellAnotherStoryText = questionnaire.tellAnotherStoryText || "Would you like to tell another story?";
        const tellAnotherStoryButtonText = questionnaire.tellAnotherStoryButtonText || "Yes, I'd like to tell another story";
        return m("div", {"class": "narrafirma-survey-tell-another-story-button-panel"}, [
            tellAnotherStoryText,
             m("button", {"class": "narrafirma-survey-tell-another-story-button", onclick: tellAnotherStory}, tellAnotherStoryButtonText)
        ]);
    }

    var view = function() {
        var imageHTML;
        if (questionnaire.image) {
            imageHTML = "img[src='" + questionnaire.image + "'][class='narrafirma-survey-image']";
        }
        var result = m("div", [
            m(imageHTML || ""),
            startQuestions.map(function(question, index) {
                return displayQuestion(null, null, question, questionnaire);
            }),
            
            stories.map(function(story, index) {
                return displayStoryQuestions(story, index);
            }),
            (!questionnaire.maxNumStories || questionnaire.maxNumStories === "no limit" || stories.length < questionnaire.maxNumStories) ? anotherStoryButton(questionnaire) : "",
            participantQuestions.map(function(question, index) {
                return displayQuestion(null, surveyResult.participantData, question, questionnaire);
            }),
            submitButtonOrWaitOrFinal(),
            (submitted === "success" && questionnaire.showSurveyResultPane) ? surveyResultPanel() : ""
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
            makeReadOnly(result, null);
        }
        
        return result;
    };
    
    function redraw(source = "gui") {
        if (surveyDiv) {
            m.render(surveyDiv, view());
        } else {
            // When the survey form is used in a Dialog, the code will be calling redraw automatically as a mounted component,
            // so only need to call redraw for an asynchronous server response
            if (source === "network") m.redraw();
        }
    }
    
    setGlobalRedrawFunction(redraw);
    
    redraw();
    
    // Return a function that could be called to produce a survey template, like for a dialog
    return view;
}
