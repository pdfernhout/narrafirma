import m = require("mithril");

"use strict";

function wrap(elementType, cssClass, text) {
    return m(elementType, {"class": cssClass}, text);
}

function displayHTMLForSlider(fieldSpecification, fieldName, value) {
    if (fieldSpecification.displayConfiguration.length !== 2) {
        console.log("missing displayConfiguration for slider", fieldSpecification);
        return m("div", "ERROR: Problem displaying slider " + fieldSpecification.id);
    }
    // Assumes values go from 0 to 100; places 100.0 in last bucket
    var lowLabel = fieldSpecification.displayConfiguration[0];
    var highLabel = fieldSpecification.displayConfiguration[1];
    var sliderText = [];
    var bucketCount = 40;
    var bucketSize = 100.0 / bucketCount;
    var placed = false;
    for (var i = 0; i < bucketCount; i++) {
        var bucketLow = i * bucketSize;
        var bucketHigh = i * bucketSize + bucketSize;
        if (!placed && ((value < bucketHigh) || (value && i === bucketCount - 1))) {
            sliderText.push(m("b", "|"));
            placed = true;
        } else {
            sliderText.push("-");
        }
    }
    return m("tr", [
        wrap("td", "narrafirma-story-card-slider-name", fieldName),
        wrap("td", "narrafirma-story-card-slider-label-left", lowLabel),
        wrap("td", "narrafirma-story-card-slider-contents", sliderText),
        wrap("td", "narrafirma-story-card-slider-label-right", highLabel)
     ]); 
}

function displayHTMLForCheckboxes(fieldSpecification, fieldName, value) {
    var options = [];
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        // console.log("checkboxes", option, fieldSpecification, value);
        if (options.length) options.push(", ");
        if (value && value[option]) {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-selected", option));
        } else {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-unselected", option));
        }
    }
    return [fieldName + ": ", options];
}

function displayHTMLForSelect(fieldSpecification, fieldName, value) {
    var options = [];
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        if (options.length) options.push(", ");
        if (value === option) {
            options.push(wrap("span", "narrafirma-story-card-select-selected", option));
        } else {
            options.push(wrap("span", "narrafirma-story-card-select-unselected", option));
        }
    }
    return [fieldName + ": ", options];
}

function displayHTMLForField(model, fieldSpecification, nobreak = null) {
    // if (!model[fieldSpecification.id]) return "";
    var value = model[fieldSpecification.id];
    // TODO: extra checking here for problems with test data -- could probably be changed back to just displayName eventually
    var fieldName = fieldSpecification.displayName || fieldSpecification.displayPrompt;
    var result = [];
    if (fieldSpecification.displayType === "slider") {
        result.push(displayHTMLForSlider(fieldSpecification, fieldName, value));
    } else if (fieldSpecification.displayType === "checkboxes") {
        result.push(displayHTMLForCheckboxes(fieldSpecification, fieldName, value));
    } else if (fieldSpecification.displayType === "select") {
        result.push(displayHTMLForSelect(fieldSpecification, fieldName, value));
    } else {
        // TODO: May need more handling here for other cases
        result.push(fieldName + ": ");
        result.push(value);
    }
    if (!nobreak) {
        result.push(m("br"));
        result.push(m("br"));
    }
    return result;  
}

interface Options {
    excludeElicitingQuestion?: boolean;
    storyTextAtTop?: boolean;
}

export function generateStoryCardContent(storyModel, currentQuestionnaire, options: Options = {}) {
    // Encode all user-supplied text to ensure it does not create HTML issues
    var elicitingQuestion = storyModel.elicitingQuestion;
    console.log("elicitingQuestion", elicitingQuestion);
    var storyName = storyModel.storyName;
    var storyText = storyModel.storyText;
    var otherFields = [];
    
    var questions = [];
    if (currentQuestionnaire) questions = questions.concat(currentQuestionnaire.storyQuestions);
    if (currentQuestionnaire) questions = questions.concat(currentQuestionnaire.participantQuestions);
    
    var question;
    var i;
    
    // Put sliders in a table at the start, so loop twice with different conditions
    
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (question.displayType !== "slider") continue;
        // console.log("making slider", question);
        otherFields.push(displayHTMLForField(storyModel, question, "nobreak"));
    }
    if (otherFields.length) otherFields = [m("table", otherFields), m("br")];
    
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (question.displayType === "slider") continue;
        // console.log("making other than slider", question);
        otherFields.push(displayHTMLForField(storyModel, question));
    }
    
    // console.log("otherFields", otherFields);
    
    var textForElicitingQuestion: any = [];
    if (!options.excludeElicitingQuestion) {
        textForElicitingQuestion = m(".narrafirma-story-card-eliciting-question", ["Eliciting question: ", elicitingQuestion, m("br")]);
    }
    
    var storyTextAtTop: any = [];
    var storyTextAtBottom = wrap("div", "narrafirma-story-card-story-text", storyText);
    
    if (options.storyTextAtTop) {
        storyTextAtTop = storyTextAtBottom;
        storyTextAtBottom = [];
    }
    
    var storyCardContent = m("div[class=storyCard]", [
        wrap("div", "narrafirma-story-card-story-title", storyName),
        storyTextAtTop,
        m("br"),
        otherFields,
        textForElicitingQuestion,
        storyTextAtBottom,
        m("hr")
    ]);
    
    return storyCardContent;
}
