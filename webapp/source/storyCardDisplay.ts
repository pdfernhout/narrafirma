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
    var lowLabel = "";
    var highLabel = "";
    if (fieldSpecification.displayConfiguration !== undefined && fieldSpecification.displayConfiguration.length > 1) {
        lowLabel = fieldSpecification.displayConfiguration[0];
        highLabel = fieldSpecification.displayConfiguration[1];
    }
    var sliderText = [];
    var sliderTextBefore = "";
    var sliderTextAfter = "";
    // Assumes values go from 0 to 100; places 100.0 in last bucket
    var bucketCount = 50;
    var bucketSize = 100.0 / bucketCount;
    var placed = false;
    var answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    if (value !== undefined && value !== "") {
        for (var i = 0; i < bucketCount; i++) {
            var bucketLow = i * bucketSize;
            var bucketHigh = i * bucketSize + bucketSize;
            if (!placed) {
                if (value && ((value < bucketHigh) || (value && i === bucketCount - 1))) {
                    sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-before " + answerClass + '-slider-bars-before'}, sliderTextBefore));
                    sliderText.push(m("span", {"class": "narrafirma-story-card-slider-button " + answerClass + "-slider-button"}, options.sliderButtonCharacter || "|"));
                    placed = true;
                } else {
                    sliderTextBefore += options.beforeSliderCharacter || "-";
                }
            } else {
                sliderTextAfter += options.afterSliderCharacter || "-";
                //sliderText.push("-");
            }
        }
        sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-after " + answerClass + "-slider-bars-after"}, sliderTextAfter));
    } else {
        // no answer
        sliderTextAfter = new Array(bucketCount + 1).join(options.noAnswerSliderCharacter || "-");
        sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-no-answer " + answerClass + "-slider-bars-no-answer"}, sliderTextAfter));
    }
    return m("tr", [
        wrap("td", "narrafirma-story-card-slider-name", m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName)),
        wrap("td", "narrafirma-story-card-slider-label-left", lowLabel),
        wrap("td", "narrafirma-story-card-slider-contents", sliderText),
        wrap("td", "narrafirma-story-card-slider-label-right", highLabel)
     ]); 
}

function displayHTMLForCheckboxes(fieldSpecification, fieldName, value) {
    var options = [];
    var atLeastOneOptionWasChecked = false;
    var answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    options.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    var optionsAlreadyConsidered = [];
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        if (optionsAlreadyConsidered.indexOf(option) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        optionsAlreadyConsidered.push(option);
        if (options.length-1) options.push(wrap("span", answerClass + "-comma", ", "));
        if (value && value[option]) {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-selected " + answerClass + "-selected", option));
            atLeastOneOptionWasChecked = true;
        } else {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-unselected " + answerClass + "-unselected", option));
        }
    }
    return [options, atLeastOneOptionWasChecked];
}

function displayHTMLForRadioButtons(fieldSpecification, fieldName, value) {
    var options = [];
    var atLeastOneOptionWasChecked = false;
    var answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    options.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    var optionsAlreadyConsidered = [];
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        if (optionsAlreadyConsidered.indexOf(option) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        optionsAlreadyConsidered.push(option);
        if (options.length-1) options.push(wrap("span", answerClass + "-comma", ", "));
        if (value && value === option) {
            options.push(wrap("span", "narrafirma-story-card-radiobuttons-selected " + answerClass + "-selected", option));
            atLeastOneOptionWasChecked = true;
        } else {
            options.push(wrap("span", "narrafirma-story-card-radiobuttons-unselected " + answerClass + "-unselected", option));
        }
    }
    return [options, atLeastOneOptionWasChecked];
}

function displayHTMLForSelect(fieldSpecification, fieldName, value) {
    var options = [];
    var atLeastOneOptionWasChecked = false;
    var answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    options.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    var optionsAlreadyConsidered = [];
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        if (optionsAlreadyConsidered.indexOf(option) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        optionsAlreadyConsidered.push(option);
        if (options.length-1) options.push(wrap("span", answerClass + "-comma", ", "));
        if (value && value === option) {
            options.push(wrap("span", "narrafirma-story-card-select-selected " + answerClass + "-selected", option));
            atLeastOneOptionWasChecked = true;
        } else {
            options.push(wrap("span", "narrafirma-story-card-select-unselected " + answerClass + "-unselected", option));
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
    var answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
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
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
        if (value) {
            thisBit.push(m("span", {"class": answerClass}, "yes"));
        } else {
            thisBit.push(m("span", {"class": answerClass}, "no"));
        }
        result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", thisBit));
    } else if (fieldSpecification.displayType === "checkbox") {
        var thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
        if (value) {
            thisBit.push(m("span", {"class": answerClass}, "true"));
        } else {
            thisBit.push(m("span", {"class": answerClass}, "false"));
        }
        result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", thisBit));
    } else if (fieldSpecification.displayType === "label" || fieldSpecification.displayType === "header") {
        return [];
    } else {
        // TODO: May need more handling here for other cases
        var thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
        thisBit.push(m("span", {"class": answerClass}, value));
        result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", thisBit));
    }

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
    order?: string;
    cutoff?: string,
    cutoffMessage?: string,
    includeIndex?: string,
}

export function generateStoryCardContent(storyModel, questionsToInclude, options: Options = {}) {
    // Encode all user-supplied text to ensure it does not create HTML issues
    var elicitingQuestion = storyModel.elicitingQuestion();
    var numStoriesTold = storyModel.numStoriesTold();
    var storyLength = storyModel.storyLength();
    var storyName = storyModel.storyName();
    if (options.includeIndex) {
        storyName = storyModel.indexInStoryCollection() + ". " + storyName;
    }

    var storyText = storyModel.storyText();
    if (options.cutoff && options.cutoff !== "no limit") {
        var cutoffValue = parseInt(options.cutoff);
        var cutoffMessageToUse = options.cutoffMessage || "... (truncated)";
        if (!isNaN(cutoffValue)) {
            if (storyText.length > cutoffValue) {
                storyText = storyText.slice(0, cutoffValue) + cutoffMessageToUse;
            }
        }
    }

    var formattedFields = [];

    var questionnaire = storyModel.questionnaire();
    if (options.questionnaire) questionnaire = options.questionnaire;

    var allQuestions = [];
    if (questionnaire) {
        if (options["location"] || options["location"] !== "storyAnnotationBrowser") {
            allQuestions = allQuestions.concat(questionnaire.storyQuestions);
            allQuestions = allQuestions.concat(questionnaire.participantQuestions);
        }
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

    //valueOptions: [
    //    "order on story form, scales separate",
    //    "order on story form, scales mixed in",
    //    "alphabetical order, scales separate",
    //    "alphabetical order, scales mixed in"
    //],

    var sortAlphabetically = options.order != undefined && options.order.indexOf("alphabetical") >= 0;
    var sortScalesSeparately = options.order != undefined && options.order.indexOf("scales separate") >= 0;

    if (sortAlphabetically) {
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
    }
    
    var question;
    var i;
    
    // Put sliders in a table at the start, so loop twice with different conditions (but only if they chose that option)
    if (sortScalesSeparately) {
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType !== "slider") continue;
            var fieldHTML = displayHTMLForField(storyModel, question, options, "nobreak");
            formattedFields.push(fieldHTML);
        }
        if (formattedFields.length) formattedFields = [m("table", {"class": "narrafirma-story-card-sliders-table"}, formattedFields)];
    }
    
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (sortScalesSeparately && question.displayType === "slider") continue;
        var fieldHTML = displayHTMLForField(storyModel, question, options);
        if (!sortScalesSeparately && question.displayType === "slider") {
            var fieldName = question.displayName || question.displayPrompt;
            fieldHTML = [m("div", {"class": "narrafirma-story-card-question-line-with-slider"}, m("table", {"class": "narrafirma-story-card-one-slider-table"}, fieldHTML))];
        }
        formattedFields.push(fieldHTML);
    }

    var textForElicitingQuestion: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("elicitingQuestion") >= 0) {
        textForElicitingQuestion = m(
            ".narrafirma-story-card-eliciting-question", 
            [wrap("span", "narrafirma-story-card-eliciting-question-name", "Eliciting question: "), 
            elicitingQuestion]);
    }
    
    var textForNumStoriesTold: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("numStoriesTold") >= 0) {
        textForNumStoriesTold = m(
            ".narrafirma-story-card-num-stories-question", 
            [wrap("span", "narrafirma-story-card-num-stories-question-name", "Number of stories told by this participant: "), 
            numStoriesTold]);
    }

    var textForStoryLength: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("storyLength") >= 0) {
        textForStoryLength = m(
            ".narrafirma-story-card-story-length-question", 
            [wrap("span", "narrafirma-story-card-story-length-question-name", "Story length: "), 
            storyLength, " characters", m("br")]);
    }
    
    var storyTextAtTop: any = [];
    var storyTextClass = "";
    if (options["location"] && options["location"] === "storyBrowser") {
        storyTextClass = "narrafirma-story-card-story-text-in-story-browser";
    } else if (options["location"] && options["location"] === "storyAnnotationBrowser") {
        storyTextClass = "narrafirma-story-card-story-text-in-story-annotation-browser";
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
        textForStoryLength,
        m("hr.narrafirma-story-card-divider")
    ]);
    
    return storyCardContent;
}
