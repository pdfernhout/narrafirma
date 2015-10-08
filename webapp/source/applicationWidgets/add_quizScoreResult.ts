import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import Globals = require("../Globals");

"use strict";

function calculate_quizScoreResult(panelSpecificationCollection, modelFunction: Function, dependsOn) {
    // console.log("quiz score result", dependsOn);
    if (!panelSpecificationCollection) return "ERROR in calculate_quizScoreResult: panelSpecificationCollection is not set";
    var total = 0;
    for (var dependsOnIndex = 0; dependsOnIndex < dependsOn.length; dependsOnIndex++) {
        var questionID = dependsOn[dependsOnIndex];
        var questionAnswer = modelFunction(questionID);
        // console.log("questionAnswer", questionAnswer, questionID);
        var answerWeight = 0;
        var index = 0;
        if (questionAnswer) {
            // console.log("questionAnswer", questionAnswer);
            var choices = panelSpecificationCollection.getFieldSpecificationForFieldID(questionID).valueOptions;
            index = choices.indexOf(questionAnswer);
            if (index === choices.length - 1) {
                answerWeight = 0;
            } else {
                answerWeight = index;
            }
            // console.log("answerWeight", answerWeight);
            if (answerWeight < 0) answerWeight = 0;
            total += answerWeight;
        }
        // console.log("questionAnswer", questionID, questionAnswer, answerWeight, total);
    }
    var possibleTotal = dependsOn.length * 3;
    var percent = Math.round(100 * total / possibleTotal);
    var template = translate("#calculate_quizScoreResult_template", "{{total}} of {{possibleTotal}} ({{percent}}%)");
    var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
    //return "<b>" + response + "</b>";
    return response;
}

function add_quizScoreResult(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var dependsOn = fieldSpecification.displayConfiguration;
    
    var modelFunction = Globals.project().tripleStore.makeModelFunction(model);
    var calculateResult = calculate_quizScoreResult(panelBuilder.panelSpecificationCollection, modelFunction, dependsOn);
    
    var baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
    
    var labelText = panelBuilder.substituteCalculatedResultInBaseText(baseText, calculateResult);
    
    return m("div", {"class": "questionExternal narrafirma-question-type-quizScoreResult"}, sanitizeHTML.generateSanitizedHTMLForMithril(labelText));
}

// Make this function available for report generation
// TODO: Should be a better way to do this
add_quizScoreResult["calculate_quizScoreResult"] = calculate_quizScoreResult;

export = add_quizScoreResult;
