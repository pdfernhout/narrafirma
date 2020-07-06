import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import Globals = require("../Globals");

"use strict";

function calculate_quizScoreResult(panelSpecificationCollection, modelFunction: Function, dependsOn) {
    if (!panelSpecificationCollection) return "ERROR in calculate_quizScoreResult: panelSpecificationCollection is not set";
    let total = 0;
    for (let dependsOnIndex = 0; dependsOnIndex < dependsOn.length; dependsOnIndex++) {
        const questionID = dependsOn[dependsOnIndex];
        const questionAnswer = modelFunction(questionID);
        let answerWeight = 0;
        let index = 0;
        if (questionAnswer) {
            const choices = panelSpecificationCollection.getFieldSpecificationForFieldID(questionID).valueOptions;
            index = choices.indexOf(questionAnswer);
            if (index === choices.length - 1) {
                answerWeight = 0;
            } else {
                answerWeight = index;
            }
            if (answerWeight < 0) answerWeight = 0;
            total += answerWeight;
        }
    }
    const possibleTotal = dependsOn.length * 3;
    const percent = Math.round(100 * total / possibleTotal);
    const template = translate("#calculate_quizScoreResult_template", "{{total}} of {{possibleTotal}} ({{percent}}%)");
    const response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
    //return "<b>" + response + "</b>";
    return response;
}

function add_quizScoreResult(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const dependsOn = fieldSpecification.displayConfiguration;
    
    const modelFunction = Globals.project().tripleStore.makeModelFunction(model);
    const calculateResult = calculate_quizScoreResult(panelBuilder.panelSpecificationCollection, modelFunction, dependsOn);
    
    const baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
    
    const labelText = panelBuilder.substituteCalculatedResultInBaseText(baseText, calculateResult);
    
    return m("div", {"class": "questionExternal narrafirma-question-type-quizScoreResult"}, sanitizeHTML.generateSanitizedHTMLForMithril(labelText));
}

// Make this function available for report generation
// TODO: Should be a better way to do this
add_quizScoreResult["calculate_quizScoreResult"] = calculate_quizScoreResult;

export = add_quizScoreResult;
