import m = require("mithril");

import generateRandomUuid = require("./pointrel20150417/generateRandomUuid");
import sanitizeHTML = require("./sanitizeHTML");

"use strict";

const writeInTag = "WriteInEntry_";

// TODO: Fix overly long lines and remove next line disabling check
/* tslint:disable:max-line-length */

const idsMade = {};
let idCount = 0;
let currentLanguage = "";

export const defaultFormTexts = {
    startText: 'Please help by taking a short survey. The data you enter will be sent to the server only at the end when you press the "submit survey" button.',
    sliderValuePrompt: "Type a new value",
    selectNoChoiceName: "-- select --",
    booleanYesNoNames: "yes/no",
    maxNumAnswersPrompt: "(Please choose up to # answers.)",
    endText: "Thank you for taking the survey.",
    thankYouPopupText: "Your contribution has been added to the story collection. Thank you.",
    chooseQuestionText: "Please choose a question to which you would like to respond.",
    enterStoryText: "Please enter your response in the box below.",
    nameStoryText: "Please give your story a name.",
    aboutYouText: "About you",
    errorMessage_noElicitationQuestionChosen: "Please select the question to which story # is a response.",
    errorMessage_noStoryText: "Please enter some text for story #.",
    errorMessage_noStoryName: "Please give story # a name.",
    deleteStoryButtonText: "Delete this story",
    deleteStoryDialogPrompt: "Are you sure you want to delete this story?",
    submitSurveyButtonText: "Submit Survey",
    couldNotSaveSurveyText:"The server could not save your survey. Please try again.",
    sendingSurveyResultsText: "Now sending survey result to server. Please wait . . .",
    resubmitSurveyButtonText: "Resubmit Survey",
    surveyStoredText: "Your survey has been accepted and stored.",
    surveyResultPaneHeader: "Here are the stories you contributed. You can copy this text and paste it somewhere else to keep your own copy of what you said.",
    tellAnotherStoryText: "Would you like to tell another story?",
    tellAnotherStoryButtonText: "Yes, I'd like to tell another story",
}

function translate(storyForm, language, text) {
    if (!language) return text;
    if (!storyForm.translationDictionary) return text;
    if (!storyForm.translationDictionary[text]) return text;
    if (!storyForm.translationDictionary[text][language]) return text;
    return storyForm.translationDictionary[text][language];
}

function getIdForText(text) {
    if (!idsMade["$" + text]) {
        idsMade["$" + text] = idCount++;
    }
    return "panelField_" + idsMade["$" + text];
}

export function loadCSS(document, cssText) {
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(styleElement);

    if (styleElement.styleSheet) { // IE
        styleElement.styleSheet.cssText = cssText;
    } else { // other browsers
        styleElement.innerHTML = cssText;
    }
  }

function stringUpTo(aString: string, upToWhat: string) {
    if (upToWhat !== "") {
        return aString.split(upToWhat)[0];
    } else {
        return aString;
    }
}

function stringBeyond(aString: string, beyondWhat: string) {
    if (beyondWhat !== "") {
        return aString.split(beyondWhat).pop();
    } else {
        return aString;
    }
}

function stringBetween(wholeString: string, startString: string, endString: string) {
    if (wholeString.indexOf(startString) < 0 || wholeString.indexOf(endString) < 0) return "";
    return stringUpTo(stringBeyond(wholeString.trim(), startString), endString);
}

function mithrilForVideoInfo(videoInfoString) {
    if (!videoInfoString) return m("div");
    if (videoInfoString.indexOf("iframe") >= 0) {
        const width = stringBetween(videoInfoString, 'width="', '"');
        const height = stringBetween(videoInfoString, 'height="', '"');
        const source = stringBetween(videoInfoString, 'src="', '"');
        const title = stringBetween(videoInfoString, 'title="', '"');
        const allow = stringBetween(videoInfoString, 'allow="', '"');
        return m("iframe", {
            src: source,
            width: width || 560,
            title: title || "Introductory video",
            height: height || 315,
            class: "narrafirma-survey-introductory-video-streaming",
            allow: allow,
        })
    } else {
        return m("video", {
            src: videoInfoString,
            type: "video/mp4",
            controls: "controls",
            class: "narrafirma-survey-introductory-video-mp4"
        });
    }
}
  
// Redrawing

let globalRedrawCallback;

export function setGlobalRedrawFunction(callback) {
    globalRedrawCallback = callback;
}

function globalRedraw(source = undefined) {
    globalRedrawCallback(source);
}

function addAllowedHTMLToPrompt(text) {
    let result;
    try {
        result = sanitizeHTML.generateSanitizedHTMLForMithril(text);
        return result;
    } catch (error) {
        alert(error);
        return text;
    }
}

// Builder is used by main application, and is passed in for compatibility
function displayQuestion(builder, model, fieldSpecification, storyForm) {

    function buildQuestionLabel(fieldSpecification, storyForm) {

        let displayPrompt = tr(fieldSpecification.displayPrompt);
    
        if (fieldSpecification.displayType === "checkboxes" && fieldSpecification.displayConfiguration) {
            if (storyForm.maxNumAnswersPrompt) {
                displayPrompt += " " + tr(storyForm.maxNumAnswersPrompt).replace("#", fieldSpecification.displayConfiguration);
            } else { 
                displayPrompt += " " + tr(defaultFormTexts.maxNumAnswersPrompt).replace("#", fieldSpecification.displayConfiguration);
            }
        }
        
        return [
            // TODO: Generalize this css class name
            m("span", {"class": "narrafirma-survey-prompt"}, addAllowedHTMLToPrompt(displayPrompt)),
            m("br")
        ];
    }

    let fieldID = fieldSpecification.id;
    if (model) {
        fieldID = (model.storyID || model.participantID) + "__" + fieldID;
    }

    let questionLabel = buildQuestionLabel(fieldSpecification, storyForm);
    let parts: any = [];

    let value = null;
    if (model) value = model[fieldSpecification.id];
    if (value === undefined) value = "";

    function tr(text) {
        return translate(storyForm, currentLanguage, text);
    }

    function standardChangeMethod(event, value) {
        if (event) value = event.target.value;
        model[fieldSpecification.id] = value;
        // TODO: redraw on value change seems not needed in this survey case, since values do not affect anything about rest of application?
        // redraw();
        // Except for one case. Could there be more?
        if (fieldSpecification.id === "storyName") globalRedraw();
        // yes, there is one more case - the slider needs to interact with the "Does not apply" checkbox
        if (fieldSpecification.displayType === "slider") globalRedraw();
    }
    
    const standardValueOptions = {
        value: value,
        id: getIdForText(fieldID),
        onchange: standardChangeMethod
    };

    //////////////////////////////////////////////////////////////// text, textarea ////////////////////////////////////////////////////////////////
    function displayTextOrTextAreaQuestion(type) {
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";
        if (type === "input") {
            const lengthAsNumber = Number(fieldSpecification.displayConfiguration);
            if (!isNaN(lengthAsNumber)) {
                const valueOptionsWithWidth = {
                    value: value,
                    style: "width: " + lengthAsNumber + "%",
                    id: getIdForText(fieldID),
                    onchange: standardChangeMethod,
                };
                return [m(type, valueOptionsWithWidth), m("br")];
            } else {
                return [m(type, standardValueOptions), m("br")];
            }
        } else {
            return [m(type, standardValueOptions), m("br")];
        }
    }

    //////////////////////////////////////////////////////////////// one checkbox ////////////////////////////////////////////////////////////////
    function displayCheckBoxQuestion() {
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";
        return [
            m("input[type=checkbox]", {
                id: getIdForText(fieldID), 
                checked: value, 
                onchange: function(event) { standardChangeMethod(null, event.target.checked); }
            }),
            m("label", {"for": getIdForText(fieldID)}, tr(fieldSpecification.displayConfiguration || "")),
            m("br")
        ];    
    }

    //////////////////////////////////////////////////////////////// set of checkboxes ////////////////////////////////////////////////////////////////
    function displayCheckboxesQuestion() {

        function disableUncheckedBoxesIfReachedMaxNumAnswers(checkBoxIDs) {
            let numOptionsChecked = 0;
            checkBoxIDs.map(function (anOptionID, index) {
                if (document.querySelector('#' + anOptionID + ':checked')) numOptionsChecked++;
            })
            let maxAsNumber = Number(fieldSpecification.displayConfiguration);
            if (isNaN(maxAsNumber)) maxAsNumber = null;
            const disableUncheckedBoxes = (maxAsNumber && numOptionsChecked >= maxAsNumber);
            checkBoxIDs.map(function (anOptionID, index) {
                const element = document.querySelector('#' + anOptionID) as HTMLInputElement;
                if (element && !element.checked) {
                    element.disabled = disableUncheckedBoxes;
                    const label = document.querySelector('label[for="' + anOptionID + '"]');
                    if (label) label.setAttribute("style", "opacity: " + (disableUncheckedBoxes ? "0.5" : "1.0"));
                }
            })
        }

        delete questionLabel[0].attrs["for"];
        if (!value) {
            value = {};
            model[fieldSpecification.id] = value;
        }
    
        const checkBoxIDsForThisQuestion = [];
        if (fieldSpecification.displayConfiguration) {
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionID = getIdForText(fieldID + "_" + option);
                checkBoxIDsForThisQuestion.push(optionID);
            });
        }

        let questionParts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionName = (typeof option === "string") ? option : option.name;
                const optionValue = (typeof option === "string") ? option : option.value;
                const optionID = getIdForText(fieldID + "_" + option);
                 
                const checkboxPart = m("input[type=checkbox]", {
                    id: optionID, 
                    checked: !!value[optionValue], 
                    onchange: function(event) {
                        value[optionValue] = event.target.checked; 
                        standardChangeMethod(null, value); 
                        if (fieldSpecification.displayConfiguration) {
                            disableUncheckedBoxesIfReachedMaxNumAnswers(checkBoxIDsForThisQuestion);
                        }
                    }
                });

                let optionParts = [];
                if (fieldSpecification.optionImageLinks && index < fieldSpecification.optionImageLinks.length) {
                    let imageHTML = "";
                    imageHTML = "img[src='" +  fieldSpecification.optionImageLinks[index] + "'][class='narrafirma-survey-answer-image']";
                    if (fieldSpecification.optionImagesWidth) imageHTML += '[style="width: ' + fieldSpecification.optionImagesWidth + 'px"]';
                    optionParts = [m("td.narrafirma-survey-answer-images", [
                        checkboxPart,
                        m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName)), m("br"), m(imageHTML), m("br"))])
                    ];
                } else {
                    optionParts = [
                        checkboxPart,
                        m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName))), m("br")
                    ];
                }
                return optionParts;
            })
        ];
        if (fieldSpecification.optionImageLinks) {
            questionParts = [m("table.narrafirma-survey-answer-images", m("tr.narrafirma-survey-answer-images", questionParts))];
        }
        questionParts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
        return questionParts;     
    }

    //////////////////////////////////////////////////////////////// radio buttons ////////////////////////////////////////////////////////////////
    function displayRadioButtonsQuestion() {
        delete questionLabel[0].attrs["for"];
        let questionParts = [];
        questionParts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionName = (typeof option === "string") ? option : option.name;
                const optionValue = (typeof option === "string") ? option : option.value;
                const optionID = getIdForText(fieldID + "_" + optionValue);
                let optionParts = [];
                if (fieldSpecification.optionImageLinks && index < fieldSpecification.optionImageLinks.length) {
                    let imageHTML = "";
                    imageHTML = "img[src='" +  fieldSpecification.optionImageLinks[index] + "'][class='narrafirma-survey-answer-image']";
                    if (fieldSpecification.optionImagesWidth) imageHTML += '[style="width: ' + fieldSpecification.optionImagesWidth + 'px"]';
                    optionParts = [m("td.narrafirma-survey-answer-images", [
                        m("input[type=radio]", {id: optionID, value: optionValue, name: fieldSpecification.id, checked: value === optionValue, onchange: standardChangeMethod.bind(null, null, optionValue) }),
                        m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName)), m("br"), m(imageHTML), m("br"))])
                    ];
                } else {
                    optionParts = [
                        m("input[type=radio]", {id: optionID, value: optionValue, name: fieldSpecification.id, checked: value === optionValue, onchange: standardChangeMethod.bind(null, null, optionValue) }),
                        m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName))), m("br")
                    ];
                }
                return optionParts;
            })
        ];
        if (fieldSpecification.optionImageLinks) {
            questionParts = [m("table.narrafirma-survey-answer-images", m("tr.narrafirma-survey-answer-images", questionParts))];
        }
        questionParts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
        return questionParts;
    }

    //////////////////////////////////////////////////////////////// boolean ////////////////////////////////////////////////////////////////
    function displayBooleanQuestion() {
        delete questionLabel[0].attrs["for"];
        let yesName = "yes";
        let noName = "no";
        const yesNoParts = tr(storyForm.booleanYesNoNames || defaultFormTexts.booleanYesNoNames).split("/");
        if (yesNoParts.length > 0) yesName = yesNoParts[0]; 
        if (yesNoParts.length > 1) noName = yesNoParts[1]; 
        const questionParts = [
            m("input[type=radio]", {id: getIdForText(fieldID + "_yes"), value: true, name: fieldSpecification.id, checked: value === true, onchange: standardChangeMethod.bind(null, null, true) }),
            m("label", {"for": getIdForText(fieldID + "_yes")}, yesName), 
            m("br"),
            m("input[type=radio]", {id: getIdForText(fieldID + "_no"), value: false, name: fieldSpecification.id, checked: value === false, onchange: standardChangeMethod.bind(null, null, false) }),
            m("label", {"for": getIdForText(fieldID + "_no")}, noName), 
            m("br")
        ];
        questionParts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
        return questionParts;
    }

    //////////////////////////////////////////////////////////////// select ////////////////////////////////////////////////////////////////
    function displaySelectQuestion() {
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";

        let selectOptions = [];
        let defaultOptions = {name: '', value: '', selected: undefined};
        if (!value) defaultOptions.selected = 'selected';
        if (!fieldSpecification.displayConfiguration) { selectOptions.push(m("option", defaultOptions, tr(storyForm.selectNoChoiceName || defaultFormTexts.selectNoChoiceName))); }

        selectOptions = selectOptions.concat(
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionName = (typeof option === "string") ? option : option.name;
                const optionValue = (typeof option === "string") ? option : option.value;
                 let optionOptions = {value: optionValue, selected: undefined};
                if (optionValue === value) optionOptions.selected = 'selected';
                return m("option", optionOptions, tr(optionName));
            })
        );
        
        let sizeAsNumber = Number(fieldSpecification.displayConfiguration);
        if (!isNaN(sizeAsNumber)) standardValueOptions["size"] = sizeAsNumber;
        const questionParts = [
            m("select", standardValueOptions, selectOptions),
            m("br")
        ];
        return questionParts;
    }

    //////////////////////////////////////////////////////////////// slider ////////////////////////////////////////////////////////////////
    function displaySliderQuestion() {

        function setSliderValueWithPopup(event, valuePrompt, value, sliderValueOptions, fieldSpecification, model) {
            let newValueText = prompt(valuePrompt, value);
            let newValue = parseInt(newValueText);
            if (newValue && newValue >= 0 && newValue <= 100) { 
                sliderValueOptions.value = newValue;
                model[fieldSpecification.id] = "" + newValue; 
                globalRedraw();
            }
        }

        function isEmpty(value) {
            return value === undefined || value === null || value === "";
        }
        
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";

        const checkboxID = getIdForText(fieldID) + "_doesNotApply";
        const popupPrompt = tr(storyForm.sliderValuePrompt || defaultFormTexts.sliderValuePrompt);
        
        let leftSideText = "";
        let rightSideText = "";
        let doesNotApplyText = "Does not apply";
        if (fieldSpecification.displayConfiguration) {
            if (fieldSpecification.displayConfiguration.length > 1) {
                leftSideText = fieldSpecification.displayConfiguration[0];
                rightSideText = fieldSpecification.displayConfiguration[1];
            }
            // fieldSpecification.displayConfiguration[2] can exist but be undefined
            if (fieldSpecification.displayConfiguration.length > 2 && fieldSpecification.displayConfiguration[2]) {
                doesNotApplyText = fieldSpecification.displayConfiguration[2];
            }
        }
        
        // Could suggest 0-100 to support <IE10 that don't have range input -- or could do polyfill
        // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";
        
        const sliderValueOptions = {value: value, id: getIdForText(fieldID), onchange: standardChangeMethod, min: 0, max: 100, step: 1};
        const questionParts = [
            m("span", {"class": "narrafirma-survey-low-arrow"}, "◀ "),
            m("span", {"class": "narrafirma-survey-low"}, tr(leftSideText)),
            m('span', {"class": "narrafirma-survey-slider"}, m('input[type="range"]', sliderValueOptions)),
            m('span', {"class": "narrafirma-survey-high"}, tr(rightSideText)),
            m('span', {"class": "narrafirma-survey-high-arrow"}, " ▶"),
            m("span", {"class": "narrafirma-survey-value", "tabindex": "0", 
                onclick: function(event) { setSliderValueWithPopup(event, popupPrompt, value, sliderValueOptions, fieldSpecification, model) }, 
                onkeypress: function(event) { if (event.keyCode == 13) setSliderValueWithPopup(event, popupPrompt, value, sliderValueOptions, fieldSpecification, model); }
                }, 
                value
            ),
            m("br"),
            m('input[type="checkbox"]', {
                "class": "narrafirma-survey-does-not-apply",
                id: checkboxID,
                checked: isEmpty(sliderValueOptions.value),
                onclick: function(event) { 
                    const isChecked = event.target.checked; 
                    if (isChecked) { 
                        model[fieldSpecification.id] = ""; 
                        globalRedraw();
                    } else {
                        model[fieldSpecification.id] = "50";
                        globalRedraw();
                    }
                }
            }),
            m("label", {"for": checkboxID}, tr(doesNotApplyText))
        ];
        return questionParts;
    }

    ///////////////////////////////////////////////////////////////////// write-in (extra) text box ///////////////////////////////////////////////////////////
    function displayWriteInQuestion() {
        if (!model.hasOwnProperty("writeInTexts")) model["writeInTexts"] = {};

        let label = fieldSpecification.writeInTextBoxLabel;
        let mString = "input[type=text].narrafirma-survey-write-in-input";
        if (label.indexOf("**") == 0) {
            mString = "textarea.narrafirma-survey-write-in-textarea";
            label = label.replace("**", "");
        }

        const writeInDivParts = [
            m("span.narrafirma-survey-write-in-prompt"), addAllowedHTMLToPrompt(tr(label)),
            m(mString, {
                id: getIdForText(fieldID + "_writeIn"),
                value: model[writeInTag + fieldSpecification.id] || "", 
                onchange: function(event) { 
                    if (event && event.target.value) {
                        model[writeInTag + fieldSpecification.id] = event.target.value; 
                    }
                }
            }),
            m("br")
        ];
        return m("div.narrafirma-survey-write-in-div", writeInDivParts);
    }

    ///////////////////////////////////////////////////////////////////// now call the methods ///////////////////////////////////////////////////////////////
    
    if (fieldSpecification.displayType === "label") {
        // Nothing to do
    } else if (fieldSpecification.displayType === "header") {
        // Nothing to do; bolding done using style
    } else if (fieldSpecification.displayType === "text") {
        parts = displayTextOrTextAreaQuestion("input");
    } else if (fieldSpecification.displayType === "textarea") {
        parts = displayTextOrTextAreaQuestion("textarea");
    } else if (fieldSpecification.displayType === "checkbox") {
        parts = displayCheckBoxQuestion();
    } else if (fieldSpecification.displayType === "checkboxes") {
        parts = [m("fieldset", displayCheckboxesQuestion())];
    } else if (fieldSpecification.displayType === "radiobuttons") {
        parts = [m("fieldset", displayRadioButtonsQuestion())];
    } else if (fieldSpecification.displayType === "boolean") {
        parts = [m("fieldset", displayBooleanQuestion())];
    } else if (fieldSpecification.displayType === "select") {
        parts = displaySelectQuestion();
    } else if (fieldSpecification.displayType === "slider") {
        parts = displaySliderQuestion();
    } else {
        parts = [
            m("span", {style: {"font-weight": "bold"}}, "UNFINISHED: " + fieldSpecification.displayType),
            m("br")
        ];
    }

    if (fieldSpecification.writeInTextBoxLabel) {
        parts.push(displayWriteInQuestion());
    }

    if (parts.length) {
        parts = m("div", {"class": "narrafirma-survey-question-internal"}, parts);
    }
    
    if (questionLabel) {
        parts = questionLabel.concat(parts);
    }
    
    let classString = "narrafirma-survey-question-external narrafirma-survey-question-type-" + fieldSpecification.displayType;
    if (fieldSpecification.displayClass) {
        classString += " " + fieldSpecification.displayClass;
    }
    return m("div", {key: fieldID, "class": classString}, parts);
}

interface SurveyOptions {
    previewMode?: boolean;
    ignoreTitleChange?: boolean;
    dataEntry?: boolean;
}

export function buildSurveyForm(surveyDiv, storyForm, doneCallback, surveyOptions: SurveyOptions = {}) {  

    function tr(text) {
        return translate(storyForm, currentLanguage, text);
    }

    console.log("buildSurveyForm questions", storyForm);
    
    const startQuestions = [];
    
    if (surveyOptions.previewMode) {
        startQuestions.push({id: "previewMode_header", displayName: "previewMode", displayClass: "narrafirma-preview", displayPrompt: "Previewing story form; results will not be saved.", displayType: "header", valueOptions: []});
    }
    
    if (storyForm.title) {
        startQuestions.push({id: "title_header", displayName: "title", displayPrompt: tr(storyForm.title), displayType: "header", valueOptions: [], displayClass: "narrafirma-survey-title"});
        if (!surveyOptions.ignoreTitleChange) document.title = sanitizeHTML.removeHTMLTags(tr(storyForm.title));
    }

    const startText = tr(storyForm.startText || defaultFormTexts.startText);
    startQuestions.push({id: "startText_label", displayName: "startText", displayPrompt: startText, displayType: "label", valueOptions: [], displayClass: "narrafirma-survey-start-text"});

    const endText = tr(storyForm.endText || defaultFormTexts.endText);
    const endQuestions = [];
    endQuestions.push({id: "endText_label", displayName: "endText", displayPrompt: endText, displayType: "label", valueOptions: [], displayClass: "narrafirma-survey-end-text"});

    // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
    const elicitingQuestionOptions = [];
    for (let elicitingQuestionIndex in storyForm.elicitingQuestions) {
        const elicitingQuestionSpecification = storyForm.elicitingQuestions[elicitingQuestionIndex];
        const value = elicitingQuestionSpecification.id || elicitingQuestionSpecification.text;
        const option = {name: tr(elicitingQuestionSpecification.text), value: value};
        elicitingQuestionOptions.push(option);
    }
    
    // TODO: What if these IDs for storyText and storyName are not unique?
    const initialStoryQuestions = [];
    let singlePrompt = null;

    if (elicitingQuestionOptions.length !== 1) {
        const chooseQuestionText = tr(storyForm.chooseQuestionText || defaultFormTexts.chooseQuestionText);
        initialStoryQuestions.push({id: "elicitingQuestion", displayName: "elicitingQuestion", displayPrompt: chooseQuestionText, displayType: "radiobuttons", valueOptions: elicitingQuestionOptions, displayClass: "narrafirma-eliciting-questions"});
        const enterStoryText = tr(storyForm.enterStoryText || defaultFormTexts.enterStoryText);
        initialStoryQuestions.push({id: "storyText", displayName: "storyText", displayPrompt: enterStoryText, displayType: "textarea", valueOptions: [], displayClass: "narrafirma-story-text"});
    } else {
        singlePrompt = elicitingQuestionOptions[0];
        initialStoryQuestions.push({id: "storyText", displayName: "storyText", displayPrompt: tr(singlePrompt.name), displayType: "textarea", valueOptions: [], displayClass: "narrafirma-story-text"});
    }
    const nameStoryText = tr(storyForm.nameStoryText || defaultFormTexts.nameStoryText);
    initialStoryQuestions.push({id: "storyName", displayName: "storyName", displayPrompt: nameStoryText, displayType: "text", valueOptions: [], displayConfiguration: "20", displayClass: "narrafirma-story-name"});
    
    const allStoryQuestions = initialStoryQuestions.concat(storyForm.storyQuestions);
            
    const aboutYouText = tr(storyForm.aboutYouText || defaultFormTexts.aboutYouText);
    let participantQuestions = [];
    if (storyForm.participantQuestions.length > 0) {
        participantQuestions = [{id: "participantHeader", displayName: "participantHeader", displayPrompt: aboutYouText, displayType: "header", valueOptions: [], displayClass: "narrafirma-participant-header"}];
        participantQuestions = participantQuestions.concat(storyForm.participantQuestions);
    }

    const timestampStart = new Date();
    
    const surveyResult = {
        __type: "org.workingwithstories.storyFormResponse",
        // TODO: Think about whether to include entire storyForm or something else perhaps
        storyForm: storyForm,
        responseID: generateRandomUuid("storyFormResponse"),
        stories: [],
        language: currentLanguage,
        participantData: null,
        timestampStart: "" + timestampStart.toISOString()
    };
    
    const participantID = generateRandomUuid("Participant");
    const participantDataModel = {
        __type: "org.workingwithstories.ParticipantData",
        participantID: participantID
    };
    
    surveyResult.participantData = participantDataModel;

    // m.render(surveyDiv, m("div", ["Hello survey ============== b", "More!!"]));
    
    const stories = surveyResult.stories;
    
    function addStory() {
        const storyQuestionsModel = {
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
        let storyLabel = story.storyName;
        if (storyLabel) storyLabel = storyLabel.trim();
        if (!storyLabel) {
            storyLabel = 'Untitled story #' + (index + 1);
        } else {
            storyLabel = '"' + storyLabel + '"';
        }
        return storyLabel;
    }
         
    // submitted can be one of: "never", "pending", "failed", "success"
    let submitted = "never";
    
    function submitSurvey(surveyResult, wizardPane, doneCallback) {
        console.log("submitting survey...");

        const timestampEnd = new Date();
        
        surveyResult.timestampEnd = timestampEnd.toISOString();
        surveyResult.timeDuration_ms = timestampEnd.getTime() - timestampStart.getTime(); 
           
        console.log("survey answers", surveyResult);
        
        doneCallback("submitted", surveyResult, wizardPane);
    }

    function validateStoryQuestionsModel(storyQuestionsModel, index) {
        const elicitingQuestion = storyQuestionsModel.elicitingQuestion;
        const storyName = storyQuestionsModel.storyName;
        const storyText = storyQuestionsModel.storyText;

        if (!elicitingQuestion) {
            let prompt = tr(storyForm.errorMessage_noElicitationQuestionChosen || defaultFormTexts.errorMessage_noElicitationQuestionChosen);
            prompt = prompt.replace("#", index + 1);
            alert(prompt);
            return false;
        }

        if (!storyText) {
            let prompt = tr(storyForm.errorMessage_noStoryText || defaultFormTexts.errorMessage_noStoryText);
            prompt = prompt.replace("#", index + 1);
            alert(prompt);
            return false;
        }

        if (!storyName) {
            let prompt = tr(storyForm.errorMessage_noStoryName || defaultFormTexts.errorMessage_noStoryName);
            prompt = prompt.replace("#", index + 1);
            alert(prompt);
            return false;
        }

        return true;
    }
    
    function displayStoryQuestions(story, index) {
        const storylabel = makeLabelForStory(story, index);
        const storyQuestionsPart = allStoryQuestions.map(function(question, index) {
            return displayQuestion(null, story, question, storyForm)
        });

        const deleteStoryButtonText = tr(storyForm.deleteStoryButtonText || defaultFormTexts.deleteStoryButtonText);
        const deleteStoryPrompt = tr(storyForm.deleteStoryDialogPrompt || defaultFormTexts.deleteStoryDialogPrompt);
        const result = [
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
        
        // invert even and odd to match up with numbers starting at 1, not zero
        const evenOrOdd = (index % 2 === 1) ? "narrafirma-survey-story-even" : "narrafirma-survey-story-odd";
        // A locally unique key needs to be defined so Mithril can track deletions and inserts without rebuilding DOM nodes
        return m("div", {key: story.storyID, "class": "narrafirma-survey-story " + evenOrOdd}, <any>result); 
    }
    
    function validate() {
        // TODO: Improve validation
        if (!stories.length) {
            alert("Please add at least one story before proceeding."); // this is never used?
            return false;
        }
        for (let i = 0; i < stories.length; i++) {
            if (!validateStoryQuestionsModel(stories[i], i)) return false;
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
        const wizardPane = {
            forward: function () {
                console.log("survey sending success" + (surveyOptions.previewMode ? " (preview)" : ""));
                submitted = "success";
                const thankYouPopupText = tr(storyForm.thankYouPopupText || defaultFormTexts.thankYouPopupText);
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

        const submitSurveyButtonText = tr(storyForm.submitSurveyButtonText || defaultFormTexts.submitSurveyButtonText);
        const couldNotSaveSurveyText = tr(storyForm.couldNotSaveSurveyText || defaultFormTexts.couldNotSaveSurveyText);
        const sendingSurveyResultsText = tr(storyForm.sendingSurveyResultsText || defaultFormTexts.sendingSurveyResultsText);

        if (submitted === "never") {
            return m("button", {"class": "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed}, submitSurveyButtonText + (surveyOptions.previewMode ? " (preview)" : ""));
        } else if (submitted === "failed") {
            const resubmitSurveyButtonText = tr(storyForm.resubmitSurveyButtonText || defaultFormTexts.resubmitSurveyButtonText);
            return m("div.narrafirma-could-not-save-survey", [
                couldNotSaveSurveyText,
                m("br"),
                m("button", {"class": "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed}, resubmitSurveyButtonText + (surveyOptions.previewMode ? " (preview)" : ""))
            ]);
        } else if (submitted === "pending") {
            return m("div.narrafirma-sending-survey", m("br"), [sendingSurveyResultsText]);
        } else {
            const surveyStoredText = tr(storyForm.surveyStoredText || defaultFormTexts.surveyStoredText);
            return endQuestions.map(function(question, index) {
                return m("div", [
                    m("br"),
                    m("div.narrafirma-survey-accepted", [surveyStoredText,
                        m("br"),
                        displayQuestion(null, null, question, storyForm),
                        m("br")
                ])
                ]);
            });
        }
    }

    function questionNameForResultsPane(question) {
        let questionName = "";
        if (question.displayType !== "header" && question.displayType !== "label") {
            questionName = "* " + tr(question.displayPrompt);
        }
        if (question.displayType === "slider") {
            if (question.displayConfiguration) { // for stories
                if (question.displayConfiguration.length > 1) {
                    questionName += " (0 = " + tr(question.displayConfiguration[0]) + "; 100 = " + tr(question.displayConfiguration[1]) + ")";
                }
            } else if (question.valueOptions) { // for participant data
                if (question.valueOptions.length > 1) {
                    questionName += " (0 = " + tr(question.valueOptions[0]) + "; 100 = " + tr(question.valueOptions[1]) + ")";
                }
            }
        }
        return questionName;
    }

    function surveyResultPane() {
        const parts = [];
        stories.forEach((story) => {
            allStoryQuestions.forEach((question) => {
                const questionName = tr(questionNameForResultsPane(question));
                if (questionName) parts.push(questionName);
                if (question.id in story) {
                    const response = story[question.id];
                    if (typeof response == "object") {
                        const answers = Object.keys(response);
                        for (const answer of answers) {
                            if (response[answer]) parts.push(tr(answer));
                        }
                    } else {
                        parts.push(response);
                    }
                }
            });
            parts.push("");
        });
        participantQuestions.forEach((question) => {
            const questionName = tr(questionNameForResultsPane(question));
            if (questionName) parts.push(questionName);
            if (question.id in surveyResult.participantData) {
                const response = surveyResult.participantData[question.id];
                if (typeof response == "object") {
                    const answers = Object.keys(response);
                    for (const answer of answers) {
                        if (response[answer]) parts.push(tr(answer));
                    }
                } else {
                    parts.push(response);
                }
            }
        });
        const surveyResultPaneHeader = tr(storyForm.surveyResultPaneHeader || defaultFormTexts.surveyResultPaneHeader);
        return [m("div", {"class": "narrafirma-survey-result-summary-header"}, surveyResultPaneHeader), 
            m("textarea", {"class": "narrafirma-survey-result-summary"}, parts.join("\n"))];
    }
    
    function tellAnotherStory() {
        addStory();
        redraw();
    }
    
    const tagsToMakeReadOnly = {
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
            for (let i = 0; i < root.length; i++) {
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
    
    const view = function() {

        function anotherStoryButton(storyForm) {
            const tellAnotherStoryText = tr(storyForm.tellAnotherStoryText || defaultFormTexts.tellAnotherStoryText);
            const tellAnotherStoryButtonText = tr(storyForm.tellAnotherStoryButtonText || defaultFormTexts.tellAnotherStoryButtonText);
            return m("div", {"class": "narrafirma-survey-tell-another-story-button-panel"}, [
                tellAnotherStoryText,
                 m("button", {"class": "narrafirma-survey-tell-another-story-button", onclick: tellAnotherStory}, tellAnotherStoryButtonText)
            ]);
        }

        function chooseLanguageHTML() {
            if (!storyForm.defaultLanguage) return ""; 
            if (!storyForm.languageChoiceQuestion_text) return "";
            if (!storyForm.languageChoiceQuestion_choices) return "";

            const languageChoiceQuestionText = sanitizeHTML.removeHTMLTags(storyForm.languageChoiceQuestion_text);

            let languageNames = [];
            const nonDefaultLanguages = storyForm.languageChoiceQuestion_choices.split("\n").map(function(item) { return item.trim(); } );
            languageNames = languageNames.concat([storyForm.defaultLanguage], nonDefaultLanguages);
            const selectOptions = languageNames.map(function (aLanguage) { return m("option", {value: aLanguage, selected: aLanguage === currentLanguage}, aLanguage); });

            let defaultOptions = {name: '', value: '', selected: undefined};
            if (!currentLanguage) defaultOptions.selected = 'selected';
            selectOptions.push(m("option", defaultOptions,  tr(storyForm.selectNoChoiceName || defaultFormTexts.selectNoChoiceName)));

            const questionParts = [
                m("div.narrafirma-language-choice-question-text", languageChoiceQuestionText),
                m("select", {
                    value: currentLanguage,
                    id: "languageChoiceQuestion",
                    onchange: function(event) {
                        if (event.target.value !== currentLanguage) {
                            currentLanguage = event.target.value;
                            globalRedraw();
                        }
                    }}, 
                    selectOptions),
                m("br")
            ];
            return questionParts;
        }
        
        const imageHTML = storyForm.image ? "img[src='" + tr(storyForm.image) + "'][class='narrafirma-survey-image']" : "";
        const videoPart = mithrilForVideoInfo(tr(storyForm.video));

        let showSurveyResultPane = false;
        if (submitted === "success") {
            switch (storyForm.showSurveyResultPane) {
                case "never":
                    showSurveyResultPane = false;
                    break;
                case "only on survey":
                    showSurveyResultPane = !surveyOptions.dataEntry;
                    break;
                case "only on data entry":
                    showSurveyResultPane = surveyOptions.dataEntry;
                    break;
                case "always":
                    showSurveyResultPane = true;
                    break;
            }
        }

        const languageHTML = chooseLanguageHTML();
        const result = m("div", [
            languageHTML,
            m(imageHTML || ""),
            startQuestions.map(function(question, index) {
                return displayQuestion(null, null, question, storyForm);
            }),
            videoPart,
            m("div.narrafirma-survey-text-after-introductory-video", storyForm.textAfterVideo || ""),
            
            stories.map(function(story, index) {
                return displayStoryQuestions(story, index);
            }),
            (!storyForm.maxNumStories || storyForm.maxNumStories === "no limit" || stories.length < storyForm.maxNumStories) ? anotherStoryButton(storyForm) : "",
            // A locally unique key needs to be defined so Mithril can track deletions and inserts without rebuilding DOM nodes
            m("div", {key: "participant", "class": "narrafirma-survey-participant"}, 
                participantQuestions.map(function(question, index) {
                    return displayQuestion(null, surveyResult.participantData, question, storyForm);
                })),
            submitButtonOrWaitOrFinal(),
            showSurveyResultPane ? surveyResultPane() : ""
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
