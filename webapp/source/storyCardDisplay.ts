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
    let lowLabel = "";
    let highLabel = "";
    if (fieldSpecification.displayConfiguration !== undefined && fieldSpecification.displayConfiguration.length > 1) {
        lowLabel = fieldSpecification.displayConfiguration[0];
        highLabel = fieldSpecification.displayConfiguration[1];
    }
    const sliderText = [];
    let sliderTextBefore = "";
    let sliderTextAfter = "";
    // Assumes values go from 0 to 100; places 100.0 in last bucket
    const bucketCount = 50;
    const bucketSize = 100.0 / bucketCount;
    let placed = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    if (value !== undefined && value !== "") {
        for (let i = 0; i < bucketCount; i++) {
            const bucketLow = i * bucketSize;
            const bucketHigh = i * bucketSize + bucketSize;
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
    const options = [];
    let atLeastOneOptionWasChecked = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    options.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    const optionsAlreadyConsidered = [];
    for (let i = 0; i < fieldSpecification.valueOptions.length; i++) {
        const option = fieldSpecification.valueOptions[i];
        if (optionsAlreadyConsidered.indexOf(option) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        optionsAlreadyConsidered.push(option);
        //console.log("checkboxes", option, fieldSpecification, value);
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
    const options = [];
    let atLeastOneOptionWasChecked = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    options.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    const optionsAlreadyConsidered = [];
    for (let i = 0; i < fieldSpecification.valueOptions.length; i++) {
        const option = fieldSpecification.valueOptions[i];
        if (optionsAlreadyConsidered.indexOf(option) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        optionsAlreadyConsidered.push(option);
        //console.log("checkboxes", option, fieldSpecification, value);
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
    const options = [];
    let atLeastOneOptionWasChecked = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    options.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    const optionsAlreadyConsidered = [];
    for (let i = 0; i < fieldSpecification.valueOptions.length; i++) {
        const option = fieldSpecification.valueOptions[i];
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
    const value = storyModel.fieldValue(fieldSpecification.id);
    const isAnnotationQuestion = fieldSpecification.id.indexOf("A_") >= 0;
    // TODO: extra checking here for problems with test data -- could probably be changed back to just displayName eventually
    const fieldName = fieldSpecification.displayName || fieldSpecification.displayPrompt;
    const result = [];
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    if (fieldSpecification.displayType === "slider") {
        result.push(displayHTMLForSlider(fieldSpecification, fieldName, value, options));
    } else if (fieldSpecification.displayType === "checkboxes") {
        const optionsAndChecked = displayHTMLForCheckboxes(fieldSpecification, fieldName, value);
        if (optionsAndChecked[1]) {
            result.push(wrap("div", "narrafirma-story-card-question-line-with-selected-item", optionsAndChecked[0]));
        } else {
            result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", optionsAndChecked[0]));
        }
    } else if (fieldSpecification.displayType === "select") {
        const optionsAndChecked = displayHTMLForSelect(fieldSpecification, fieldName, value);
        if (optionsAndChecked[1]) {
            result.push(wrap("div", "narrafirma-story-card-question-line-with-selected-item", optionsAndChecked[0]));
        } else {
            result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", optionsAndChecked[0]));
        }
    } else if (fieldSpecification.displayType === "radiobuttons") {
        const optionsAndChecked = displayHTMLForRadioButtons(fieldSpecification, fieldName, value);
        if (optionsAndChecked[1]) {
            result.push(wrap("div", "narrafirma-story-card-question-line-with-selected-item", optionsAndChecked[0]));
        } else {
            result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", optionsAndChecked[0]));
        }
    } else if (fieldSpecification.displayType === "boolean") {
        const thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
        if (value) {
            thisBit.push(m("span", {"class": answerClass}, "yes"));
        } else {
            thisBit.push(m("span", {"class": answerClass}, "no"));
        }
        result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", thisBit));
    } else if (fieldSpecification.displayType === "checkbox") {
        const thisBit = [];
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
        const thisBit = [];
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
    const elicitingQuestion = storyModel.elicitingQuestion();
    const numStoriesTold = storyModel.numStoriesTold();
    const storyLength = storyModel.storyLength();
    let storyName = storyModel.storyName();
    if (options.includeIndex) {
        storyName = storyModel.indexInStoryCollection() + ". " + storyName;
    }

    let storyText = storyModel.storyText();
    if (options.cutoff && options.cutoff !== "no limit") {
        const cutoffValue = parseInt(options.cutoff);
        const cutoffMessageToUse = options.cutoffMessage || "... (truncated)";
        if (!isNaN(cutoffValue)) {
            if (storyText.length > cutoffValue) {
                storyText = storyText.slice(0, cutoffValue) + cutoffMessageToUse;
            }
        }
    }

    let formattedFields = [];

    let questionnaire = storyModel.questionnaire();
    if (options.questionnaire) questionnaire = options.questionnaire;

    let allQuestions = [];
    if (questionnaire) {
        allQuestions = allQuestions.concat(questionnaire.storyQuestions);
        allQuestions = allQuestions.concat(questionnaire.participantQuestions);
        const allAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(Globals.project().collectAllAnnotationQuestions(), "A_");
        if (allAnnotationQuestions) allQuestions = allQuestions.concat(allAnnotationQuestions);
    }

    let questions = [];
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

    const sortAlphabetically = options.order != undefined && options.order.indexOf("alphabetical") >= 0;
    const sortScalesSeparately = options.order != undefined && options.order.indexOf("scales separate") >= 0;

    if (sortAlphabetically) {
        questions.sort(function(a, b) {
            let aName = a.displayName || a.displayPrompt || "";
            aName = aName.toLowerCase();
            let bName = b.displayName || b.displayPrompt || "";
            bName = bName.toLowerCase();
                
            const aIsAnnotationQuestion = a.id.indexOf("A_") >= 0;
            const bIsAnnotationQuestion = b.id.indexOf("A_") >= 0;

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
    
    let question;
    let i;
    
    // Put sliders in a table at the start, so loop twice with different conditions (but only if they chose that option)
    if (sortScalesSeparately) {
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType !== "slider") continue;
            const fieldHTML = displayHTMLForField(storyModel, question, options, "nobreak");
            formattedFields.push(fieldHTML);
        }
        if (formattedFields.length) formattedFields = [m("table", {"class": "narrafirma-story-card-sliders-table"}, formattedFields)];
    }
    
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (sortScalesSeparately && question.displayType === "slider") continue;
        let fieldHTML = displayHTMLForField(storyModel, question, options);
        if (!sortScalesSeparately && question.displayType === "slider") {
            const fieldName = question.displayName || question.displayPrompt;
            fieldHTML = [m("div", {"class": "narrafirma-story-card-question-line-with-slider"}, m("table", {"class": "narrafirma-story-card-one-slider-table"}, fieldHTML))];
        }
        formattedFields.push(fieldHTML);
    }

    let textForElicitingQuestion: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("elicitingQuestion") >= 0) {
        textForElicitingQuestion = m(
            ".narrafirma-story-card-eliciting-question", 
            [wrap("span", "narrafirma-story-card-eliciting-question-name", "Eliciting question: "), 
            elicitingQuestion]);
    }
    
    let textForNumStoriesTold: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("numStoriesTold") >= 0) {
        textForNumStoriesTold = m(
            ".narrafirma-story-card-num-stories-question", 
            [wrap("span", "narrafirma-story-card-num-stories-question-name", "Number of stories told by this participant: "), 
            numStoriesTold]);
    }

    let textForStoryLength: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || Object.keys(questionsToInclude).indexOf("storyLength") >= 0) {
        textForStoryLength = m(
            ".narrafirma-story-card-story-length-question", 
            [wrap("span", "narrafirma-story-card-story-length-question-name", "Story length: "), 
            storyLength, " characters", m("br")]);
    }
    
    let storyTextAtTop: any = [];
    let storyTextClass = "";
    if (options["location"] && options["location"] === "storyBrowser") {
        storyTextClass = "narrafirma-story-card-story-text-in-story-browser";
    } else {
        storyTextClass = "narrafirma-story-card-story-text-in-printed-story-cards";
    }
    let storyTextAtBottom: any = wrap("div", storyTextClass, storyText);
    
    if (options.storyTextAtTop) {
        storyTextAtTop = storyTextAtBottom;
        storyTextAtBottom = [];
    }
    
    const storyCardContent = m("div[class=storyCard]", [
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
