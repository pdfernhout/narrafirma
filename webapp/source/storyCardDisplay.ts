import m = require("mithril");
import surveyCollection = require("surveyCollection");
import questionnaireGeneration = require("./questionnaireGeneration");
import Globals = require("./Globals");

"use strict";

function wrap(elementType, cssClass, text) {
    return m(elementType, {"class": cssClass}, text);
}

function displayHTMLForSlider(fieldSpecification, fieldName, value) {
    if (fieldSpecification.displayConfiguration.length < 2) {
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
        if (!placed && value && ((value < bucketHigh) || (value && i === bucketCount - 1))) {
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
    options.push(wrap("span", "narrafirma-story-card-field-name", fieldName + ": "));
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        //console.log("checkboxes", option, fieldSpecification, value);
        if (options.length-1) options.push(", ");
        if (value && value[option]) {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-selected", option));
        } else {
            options.push(wrap("span", "narrafirma-story-card-checkboxes-unselected", option));
        }
    }
    return options;
}

function displayHTMLForRadioButtons(fieldSpecification, fieldName, value) {
    var options = [];
    options.push(wrap("span", "narrafirma-story-card-field-name", fieldName + ": "));
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        //console.log("checkboxes", option, fieldSpecification, value);
        if (options.length-1) options.push(", ");
        if (value && value === option) {
            options.push(wrap("span", "narrafirma-story-card-radiobuttons-selected", option));
        } else {
            options.push(wrap("span", "narrafirma-story-card-radiobuttons-unselected", option));
        }
    }
    return options;
}

function displayHTMLForSelect(fieldSpecification, fieldName, value) {
    var options = [];
    options.push(wrap("span", "narrafirma-story-card-field-name", fieldName + ": "));
    // TODO: What if value is not current available option?
    for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
        var option = fieldSpecification.valueOptions[i];
        if (options.length-1) options.push(", ");
        if (value && value === option) {
            options.push(wrap("span", "narrafirma-story-card-select-selected", option));
        } else {
            options.push(wrap("span", "narrafirma-story-card-select-unselected", option));
        }
    }
    return options;
}

function displayHTMLForField(storyModel: surveyCollection.Story, fieldSpecification, nobreak = null) {
    // if (!model[fieldSpecification.id]) return "";
    var value = storyModel.fieldValue(fieldSpecification.id);
    // TODO: extra checking here for problems with test data -- could probably be changed back to just displayName eventually
    var fieldName = fieldSpecification.displayName || fieldSpecification.displayPrompt;
    var result = [];
    if (fieldSpecification.displayType === "slider") {
        result.push(displayHTMLForSlider(fieldSpecification, fieldName, value));
    } else if (fieldSpecification.displayType === "checkboxes") {
        result.push(displayHTMLForCheckboxes(fieldSpecification, fieldName, value));
    } else if (fieldSpecification.displayType === "select") {
        result.push(displayHTMLForSelect(fieldSpecification, fieldName, value));
    } else if (fieldSpecification.displayType === "radiobuttons") {
        result.push(displayHTMLForRadioButtons(fieldSpecification, fieldName, value));
    } else if (fieldSpecification.displayType === "label" || fieldSpecification.displayType === "header") {
        return [];
    } else {
        // TODO: May need more handling here for other cases
        result.push(wrap("span", "narrafirma-story-card-field-name", fieldName + ": "));
        result.push(value);
    }
    if (!nobreak) {
        result.push(m("br"));
    }
    
    return result;  
}

interface Options {
    excludeElicitingQuestion?: boolean;
    excludeAnnotations?: boolean;
    storyTextAtTop?: boolean;
    questionnaire?: any;
    location?: string;
}

export function generateStoryCardContent(storyModel, options: Options = {}) {
    // Encode all user-supplied text to ensure it does not create HTML issues
    var elicitingQuestion = storyModel.elicitingQuestion();
    // console.log("elicitingQuestion", elicitingQuestion);
    var storyName = storyModel.storyName();
    var storyText = storyModel.storyText();
    var otherFields = [];
    
    var questions = [];
    var questionnaire = storyModel.questionnaire();
    if (options.questionnaire) questionnaire = options.questionnaire;
    
    if (questionnaire) questions = questions.concat(questionnaire.storyQuestions);
    if (questionnaire) questions = questions.concat(questionnaire.participantQuestions);
    
    questions.sort(function(a, b) {
       var aName = a.displayName || a.displayPrompt || "";
       aName = aName.toLowerCase();
       var bName = b.displayName || b.displayPrompt || "";
       bName = bName.toLowerCase();
            
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    });
    
    var question;
    var i;
    
    // Put sliders in a table at the start, so loop twice with different conditions
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (question.displayType !== "slider") continue;
        otherFields.push(displayHTMLForField(storyModel, question, "nobreak"));
    }
    if (otherFields.length) otherFields = [m("table", otherFields)];
    
    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        if (question.displayType === "slider") continue;
        otherFields.push(displayHTMLForField(storyModel, question));
    }
    
    // console.log("otherFields", otherFields);
    
    var textForElicitingQuestion: any = [];
    if (!options.excludeElicitingQuestion) {
        textForElicitingQuestion = m(
            ".narrafirma-story-card-eliciting-question", 
            [wrap("span", "narrafirma-story-card-eliciting-question-name", "Eliciting question: "), 
            elicitingQuestion, m("br")]);
    }
    
    var storyTextAtTop: any = [];
    var storyTextClass = "";
    if (options["location"] && options["location"] === "storyBrowser") {
        storyTextClass = "narrafirma-story-card-story-text-in-story-browser";
    } else {
        storyTextClass = "narrafirma-story-card-story-text-in-printed-story-cards";
    }
    var storyTextAtBottom = wrap("div", storyTextClass, storyText);
    
    if (options.storyTextAtTop) {
        storyTextAtTop = storyTextAtBottom;
        storyTextAtBottom = [];
    }
    
    // place annotations at bottom (so they don't appear the same as the other questions)
    
    if (!options.excludeAnnotations) {
        var annotationQuestions = Globals.project().collectAllAnnotationQuestions();
        var adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
        //questions = questions.concat(adjustedAnnotationQuestions);
    }
    
    var annotationFields: any = [];
    for (i = 0; i < adjustedAnnotationQuestions.length; i++) {
        question = adjustedAnnotationQuestions[i];
        if (question.displayType !== "slider") continue;
        annotationFields.push(displayHTMLForField(storyModel, question, "nobreak"));
    }
    if (annotationFields.length) annotationFields = [m("table", annotationFields)];
    
    for (i = 0; i < adjustedAnnotationQuestions.length; i++) {
        question = adjustedAnnotationQuestions[i];
        if (question.displayType === "slider") continue;
        annotationFields.push(displayHTMLForField(storyModel, question));
    }
    if (annotationFields.length) annotationFields = [wrap("span", "narrafirma-story-card-annotations", annotationFields)];
    
    var storyCardContent = m("div[class=storyCard]", [
        wrap("div", "narrafirma-story-card-story-title", storyName),
        storyTextAtTop,
        otherFields,
        storyTextAtBottom,
        textForElicitingQuestion,
        annotationFields,
        m("hr")
    ]);
    
    return storyCardContent;
}
