import m = require("mithril");
import surveyCollection = require("surveyCollection");
import questionnaireGeneration = require("./questionnaireGeneration");
import Globals = require("./Globals");

"use strict";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function replaceSpacesWithDashes(text) {
    if (text) {
        return replaceAll(text.trim(), " ", "-");
    } else {
        return "";
    }
}

function wrap(elementType, cssClass, text) {
    return m(elementType, {"class": cssClass}, text);
}

function displayHTMLForSlider(fieldSpecification, fieldName, value, options) {
    if (!fieldSpecification.displayConfiguration || fieldSpecification.displayConfiguration.length < 2) {
        console.log("missing displayConfiguration for slider", fieldSpecification);
        return m("div", "ERROR: Problem displaying slider " + fieldSpecification.id);
    }

    // Assumes values go from 0 to 100; places 100.0 in last bucket
    var lowLabel = fieldSpecification.displayConfiguration[0];
    var highLabel = fieldSpecification.displayConfiguration[1];
    var sliderText = [];
    var sliderTextBefore = "";
    var sliderTextAfter = "";
    var bucketCount = 50;
    var bucketSize = 100.0 / bucketCount;
    var placed = false;
    if (value) {
        for (var i = 0; i < bucketCount; i++) {
            var bucketLow = i * bucketSize;
            var bucketHigh = i * bucketSize + bucketSize;
            if (!placed) {
                if (value && ((value < bucketHigh) || (value && i === bucketCount - 1))) {
                    sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-before"}, sliderTextBefore));
                    sliderText.push(m("span", {"class": "narrafirma-story-card-slider-button"}, options.sliderButtonCharacter || "|"));
                    placed = true;
                } else {
                    sliderTextBefore += options.beforeSliderCharacter || "-";
                }
            } else {
                sliderTextAfter += options.afterSliderCharacter || "-";
                //sliderText.push("-");
            }
        }
        sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-after"}, sliderTextAfter));
    } else {
        // no answer
        sliderTextAfter = new Array(bucketCount + 1).join(options.noAnswerSliderCharacter || "-");
        sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-no-answer"}, sliderTextAfter));
    }
    return m("tr", [
        m("span", {"class": "narrafirma-story-card-field-name " + replaceSpacesWithDashes(fieldName)}, fieldName),
        wrap("td", "narrafirma-story-card-slider-label-left", lowLabel),
        wrap("td", "narrafirma-story-card-slider-contents", sliderText),
        wrap("td", "narrafirma-story-card-slider-label-right", highLabel)
     ]); 
}

function displayHTMLForCheckboxes(fieldSpecification, fieldName, value) {
    var options = [];
    var atLeastOneOptionWasChecked = false;
    options.push(m("span", {"class": "narrafirma-story-card-field-name " + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        //console.log("checkboxes", option, fieldSpecification, value);
        if (options.length-1) options.push(", ");
        if (value && value[option]) {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-selected", option));
            atLeastOneOptionWasChecked = true;
        } else {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-unselected", option));
        }
    }
    return [options, atLeastOneOptionWasChecked];
}

function displayHTMLForRadioButtons(fieldSpecification, fieldName, value) {
    var options = [];
    var atLeastOneOptionWasChecked = false;
    options.push(m("span", {"class": "narrafirma-story-card-field-name " + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        //console.log("checkboxes", option, fieldSpecification, value);
        if (options.length-1) options.push(", ");
        if (value && value === option) {
            options.push(wrap("span", "narrafirma-story-card-radiobuttons-selected", option));
            atLeastOneOptionWasChecked = true;
        } else {
            options.push(wrap("span", "narrafirma-story-card-radiobuttons-unselected", option));
        }
    }
    return [options, atLeastOneOptionWasChecked];
}

function displayHTMLForSelect(fieldSpecification, fieldName, value) {
    var options = [];
    var atLeastOneOptionWasChecked = false;
    options.push(m("span", {"class": "narrafirma-story-card-field-name " + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        if (options.length-1) options.push(", ");
        if (value && value === option) {
            options.push(wrap("span", "narrafirma-story-card-select-selected", option));
            atLeastOneOptionWasChecked = true;
        } else {
            options.push(wrap("span", "narrafirma-story-card-select-unselected", option));
        }
    }
    return [options, atLeastOneOptionWasChecked];
}

function displayHTMLForField(storyModel: surveyCollection.Story, fieldSpecification, options, nobreak = null) {
    // if (!model[fieldSpecification.id]) return "";
    var value = storyModel.fieldValue(fieldSpecification.id);
    var isAnnotationQuestion = fieldSpecification.id.indexOf("A_") >= 0;
    // TODO: extra checking here for problems with test data -- could probably be changed back to just displayName eventually
    var fieldName = fieldSpecification.displayName || fieldSpecification.displayPrompt;
    var result = [];
    if (fieldSpecification.displayType === "slider") {
        result.push(displayHTMLForSlider(fieldSpecification, fieldName, value, options));
    } else if (fieldSpecification.displayType === "checkboxes") {
        var optionsAndChecked = displayHTMLForCheckboxes(fieldSpecification, fieldName, value);
        if (optionsAndChecked[1]) {
            result.push(wrap("div", "narrafirma-story-card-question-line-with-selected-item", optionsAndChecked[0]));
        } else {
            result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", optionsAndChecked[0]));
        }
    } else if (fieldSpecification.displayType === "select") {
        var optionsAndChecked = displayHTMLForSelect(fieldSpecification, fieldName, value);
        if (optionsAndChecked[1]) {
            result.push(wrap("div", "narrafirma-story-card-question-line-with-selected-item", optionsAndChecked[0]));
        } else {
            result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", optionsAndChecked[0]));
        }
    } else if (fieldSpecification.displayType === "radiobuttons") {
        var optionsAndChecked = displayHTMLForRadioButtons(fieldSpecification, fieldName, value);
        if (optionsAndChecked[1]) {
            result.push(wrap("div", "narrafirma-story-card-question-line-with-selected-item", optionsAndChecked[0]));
        } else {
            result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", optionsAndChecked[0]));
        }
    } else if (fieldSpecification.displayType === "boolean") {
        var thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name " + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
        if (value) {
            thisBit.push("yes");
        } else {
            thisBit.push("no");
        }
        result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", thisBit));
    } else if (fieldSpecification.displayType === "checkbox") {
        var thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name " + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
        if (value) {
            thisBit.push("true");
        } else {
            thisBit.push("false");
        }
        result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", thisBit));
    } else if (fieldSpecification.displayType === "label" || fieldSpecification.displayType === "header") {
        return [];
    } else {
        // TODO: May need more handling here for other cases
        var thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name " + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
        thisBit.push(value);
        result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", thisBit));
    }
    //if (!nobreak) {
    //    result.push(m("br"));
    //}

    if (isAnnotationQuestion) {
        return wrap("div", "narrafirma-story-card-annotation", result);
    } else {
        return result;  
    }
}

interface Options {
    storyTextAtTop?: boolean;
    questionnaire?: any;
    location?: string;
    beforeSliderCharacter?: string;
    sliderButtonCharacter?: string;
    afterSliderCharacter?: string;
    noAnswerSliderCharacter?: string;
}

export function generateStoryCardContent(storyModel, questionsToInclude, options: Options = {}) {
    // Encode all user-supplied text to ensure it does not create HTML issues
    var elicitingQuestion = storyModel.elicitingQuestion();
    var numStoriesTold = storyModel.numStoriesTold();
    var storyName = storyModel.storyName();
    var storyText = storyModel.storyText();
    var formattedFields = [];

    var questionnaire = storyModel.questionnaire();
    if (options.questionnaire) questionnaire = options.questionnaire;

    var allQuestions = [];
    if (questionnaire) {
        allQuestions = allQuestions.concat(questionnaire.storyQuestions);
        allQuestions = allQuestions.concat(questionnaire.participantQuestions);
        var allAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(Globals.project().collectAllAnnotationQuestions(), "A_");
        if (allAnnotationQuestions) allQuestions = allQuestions.concat(allAnnotationQuestions);
    }

    var questions = [];
    if (questionsToInclude) {
        allQuestions.forEach((question) => {
            if (questionsToInclude[question.id]) {
                questions.push(question);
            }
        });
    } else {
        questions = allQuestions;
    }

    questions.sort(function(a, b) {
        var aName = a.displayName || a.displayPrompt || "";
        aName = aName.toLowerCase();
        var bName = b.displayName || b.displayPrompt || "";
        bName = bName.toLowerCase();
            
        var aIsAnnotationQuestion = a.id.indexOf("A_") >= 0;
        var bIsAnnotationQuestion = b.id.indexOf("A_") >= 0;

        if ((aIsAnnotationQuestion && bIsAnnotationQuestion) || (!aIsAnnotationQuestion && !bIsAnnotationQuestion)) {
            if (aName < bName) return -1;
            if (aName > bName) return 1;
        } else if (aIsAnnotationQuestion && !bIsAnnotationQuestion) {
            return 1;
        } else if (!aIsAnnotationQuestion && bIsAnnotationQuestion) {
            return -1;
        }
        return 0;
    });
    
    var question;
    var i;
    
    // Put sliders in a table at the start, so loop twice with different conditions
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (question.displayType !== "slider") continue;
        formattedFields.push(displayHTMLForField(storyModel, question, options, "nobreak"));
    }
    if (formattedFields.length) formattedFields = [m("table", formattedFields)];
    
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (question.displayType === "slider") continue;
        formattedFields.push(displayHTMLForField(storyModel, question, options));
    }

    var textForElicitingQuestion: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("elicitingQuestion") >= 0) {
        textForElicitingQuestion = m(
            ".narrafirma-story-card-eliciting-question", 
            [wrap("span", "narrafirma-story-card-eliciting-question-name", "Eliciting question: "), 
            elicitingQuestion, m("br")]);
    }
    
    var textForNumStoriesTold: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("numStoriesTold") >= 0) {
        textForNumStoriesTold = m(
            ".narrafirma-story-card-num-stories-question", 
            [wrap("span", "narrafirma-story-card-num-stories-question-name", "Number of stories told by this participant: "), 
            numStoriesTold, m("br")]);
    }
    
    var storyTextAtTop: any = [];
    var storyTextClass = "";
    if (options["location"] && options["location"] === "storyBrowser") {
        storyTextClass = "narrafirma-story-card-story-text-in-story-browser";
    } else {
        storyTextClass = "narrafirma-story-card-story-text-in-printed-story-cards";
    }
    var storyTextAtBottom: any = wrap("div", storyTextClass, storyText);
    
    if (options.storyTextAtTop) {
        storyTextAtTop = storyTextAtBottom;
        storyTextAtBottom = [];
    }
    
    var storyCardContent = m("div[class=storyCard]", [
        wrap("div", "narrafirma-story-card-story-title", storyName),
        storyTextAtTop,
        formattedFields,
        storyTextAtBottom,
        textForElicitingQuestion,
        textForNumStoriesTold,
        m("hr.narrafirma-story-card-divider")
    ]);
    
    return storyCardContent;
}
