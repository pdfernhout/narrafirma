import add_quizScoreResult = require("./applicationWidgets/add_quizScoreResult");
import translate = require("./panelBuilder/translate");

"use strict";

export function calculate_report(panelSpecificationCollection, model, headerPageID) {
    // TODO: Fix this function or remove it
    // throw new Error("No longer working due to ongoing refactoring for current page model");
    return "calculate_report: Not working right now due to switchover to only having a model for the current page";
    
    /*
    // console.log("calculate_report", panelSpecificationsCollection, model, headerPageID);
    if (!panelSpecificationCollection) return "ERROR: in calculate_report, panelSpecificationCollection is not set";
    var report = "<br><br>";
    var pageList = panelSpecificationCollection.getChildPageIDListForHeaderID(headerPageID);
    for (var pageIndex in pageList) {
        // Skip last report page in a section
        if (pageIndex === pageList.length - 1) break;
        var pageID = pageList[pageIndex];
        var panelDefinition = panelSpecificationCollection.getPanelSpecificationForPanelID(pageID);
        if (!panelDefinition) {
            console.log("ERROR: Missing panelDefinition for pageID:", pageID);
            continue;
        }
        if (panelDefinition.displayType !== "page") continue;
        report += "<div>";
        report += "<i> *** " + translate(pageID + "::title", panelDefinition.displayName) + "</i>  ***<br><br>";
        var questionsAnsweredCount = 0;
        var questions = panelDefinition.panelFields;
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            var value = domain.projectAnswers.get(question.id);
            if (question.displayType === "quizScoreResult") {
                var dependsOn = question.displayConfiguration;
                value = add_quizScoreResult.calculate_quizScoreResult(panelSpecificationCollection, domain.projectAnswers, dependsOn);
                // Don't count these as answered questions
                questionsAnsweredCount--;
            }
            if (value && value.length !== 0) {
                // console.log("value", value, value.length);
                
                var valueToDisplay = displayStringForValue(question, value, 4);
                var label = labelForQuestion(question);
                report += label + " " + valueToDisplay + "</br><br>";
                questionsAnsweredCount++;
            }
        }
        
        if (questionsAnsweredCount === 0) report += translate("#no_questions_answered_on_page", "(No questions answered on this page)");
        report += "</div><br>";
    }
    return report;
    */
}

 function labelForQuestion(question) {
     var shortName = translate(question.id + "::shortName", "");
     if (!shortName) shortName = translate(question.id + "::prompt", "");
     if (!shortName) shortName = question.displayName;
     if (!shortName) shortName = question.displayPrompt;
     if (!shortName) {
         console.log("Missing translation of label for question", question.id, question);
         shortName = question.id;
     }
     var separator = ":";
     var lastQuestionCharacter = shortName[shortName.length - 1];
     if (lastQuestionCharacter === "?" || lastQuestionCharacter === "." || lastQuestionCharacter === ")") {
         separator = "<br>";
     } else if (lastQuestionCharacter === ":") {
         separator = " ";
     }
     return shortName + separator;
 }

function indent(level) {
    // console.log("indent", level);
    var result = "";
    for (var i = 0; i < level; i++) {
        // result += ".";
        result += "&nbsp;";
    }
    return result;
}

// Recursively calls itself
function displayStringForValue(question, value, level) {
    // console.log("displayStringForValue", value, level, question);
    // TODO: Translate -- Should translate some answers for some types... But how to know which when when nested?
    var valueToDisplay = "";
    var item;
    var itemDisplay;
    var indentChars;
    if (value instanceof Array) {
        // console.log("array", value);
        //valueToDisplay += "<br>";
        for (var index in value) {
            item = value[index];
            // if (index !== "0") valueToDisplay += "<br>";
            indentChars = indent(level);
            itemDisplay = displayStringForValue(null, item, level);
            // console.log("itemDisplay", itemDisplay);
            valueToDisplay += "<br>" + indentChars + itemDisplay;
        }
        valueToDisplay += "<br>";
    } else if (value.id) {
        // console.log("value with id", value);
        for (var key in value) {
            if (!value.hasOwnProperty(key)) continue;
            if (key === "watchCallbacks") continue;
            if (key === "id") continue;
            item = value[key];
            // TODO: improve how label is calculated when no question, as underscores may not be used consistently in naming fields
            var label = key;
            if (question === null) {
                var underscorePosition = label.indexOf("_");
                if (underscorePosition > -1) {
                    label = label.substring(underscorePosition + 1);
                }
                label += ": ";
            } else {
                label = labelForQuestion(question);
            }
            indentChars = indent(level);
            // console.log("label", label);
            itemDisplay = displayStringForValue(null, item, level + 4);
            // console.log("itemDisplay", itemDisplay);
            valueToDisplay += "<br>" + indentChars + label + itemDisplay;
        }
    } else {
        // console.log("regular", value);
        // TODO: Probably need to translate more types, like checkboxes
        if (question !== null && (question.displayType === "select" || question.displayType === "radiobuttons")) value = translate(value, value);
        valueToDisplay += "<b>" + value + "</b>";
    }
    return valueToDisplay;
}