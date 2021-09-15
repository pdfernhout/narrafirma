import add_quizScoreResult = require("./applicationWidgets/add_quizScoreResult");
import translate = require("./panelBuilder/translate");

"use strict";

// this file is no longer being used

export function calculate_report(panelSpecificationCollection, model, headerPageID) {
    // TODO: Fix this function or remove it
    // throw new Error("No longer working due to ongoing refactoring for current page model");
    return "calculate_report: Not working right now due to switchover to only having a model for the current page";
    
    /*
    if (!panelSpecificationCollection) return "ERROR: in calculate_report, panelSpecificationCollection is not set";
    const report = "<br><br>";
    const pageList = panelSpecificationCollection.getChildPageIDListForHeaderID(headerPageID);
    for (let pageIndex in pageList) {
        // Skip last report page in a section
        if (pageIndex === pageList.length - 1) break;
        const pageID = pageList[pageIndex];
        const panelDefinition = panelSpecificationCollection.getPanelSpecificationForPanelID(pageID);
        if (!panelDefinition) {
            console.log("ERROR: Missing panelDefinition for pageID:", pageID);
            continue;
        }
        if (panelDefinition.displayType !== "page") continue;
        report += "<div>";
        report += "<i> *** " + translate(pageID + "::title", panelDefinition.displayName) + "</i>  ***<br><br>";
        let questionsAnsweredCount = 0;
        const questions = panelDefinition.panelFields;
        for (let questionIndex in questions) {
            const question = questions[questionIndex];
            const value = domain.projectAnswers.get(question.id);
            if (question.displayType === "quizScoreResult") {
                const dependsOn = question.displayConfiguration;
                value = add_quizScoreResult.calculate_quizScoreResult(panelSpecificationCollection, domain.projectAnswers, dependsOn);
                // Don't count these as answered questions
                questionsAnsweredCount--;
            }
            if (value && value.length !== 0) {
                const valueToDisplay = displayStringForValue(question, value, 4);
                const label = labelForQuestion(question);
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
     let shortName = translate(question.id + "::shortName", "");
     if (!shortName) shortName = translate(question.id + "::prompt", "");
     if (!shortName) shortName = question.displayName;
     if (!shortName) shortName = question.displayPrompt;
     if (!shortName) {
         console.log("Missing translation of label for question", question.id, question);
         shortName = question.id;
     }
     let separator = ":";
     let lastQuestionCharacter = shortName[shortName.length - 1];
     if (lastQuestionCharacter === "?" || lastQuestionCharacter === "." || lastQuestionCharacter === ")") {
         separator = "<br>";
     } else if (lastQuestionCharacter === ":") {
         separator = " ";
     }
     return shortName + separator;
 }

function indent(level) {
    let result = "";
    for (let i = 0; i < level; i++) {
        result += "&nbsp;";
    }
    return result;
}

// Recursively calls itself
function displayStringForValue(question, value, level) {
    // TODO: Translate -- Should translate some answers for some types... But how to know which when when nested?
    let valueToDisplay = "";
    let item;
    let itemDisplay;
    let indentChars;
    if (value instanceof Array) {
        //valueToDisplay += "<br>";
        for (let index in value) {
            item = value[index];
            // if (index !== "0") valueToDisplay += "<br>";
            indentChars = indent(level);
            itemDisplay = displayStringForValue(null, item, level);
            valueToDisplay += "<br>" + indentChars + itemDisplay;
        }
        valueToDisplay += "<br>";
    } else if (value.id) {
        for (let key in value) {
            if (!value.hasOwnProperty(key)) continue;
            if (key === "watchCallbacks") continue;
            if (key === "id") continue;
            item = value[key];
            // TODO: improve how label is calculated when no question, as underscores may not be used consistently in naming fields
            let label = key;
            if (question === null) {
                const underscorePosition = label.indexOf("_");
                if (underscorePosition > -1) {
                    label = label.substring(underscorePosition + 1);
                }
                label += ": ";
            } else {
                label = labelForQuestion(question);
            }
            indentChars = indent(level);
            itemDisplay = displayStringForValue(null, item, level + 4);
            valueToDisplay += "<br>" + indentChars + label + itemDisplay;
        }
    } else {
        // TODO: Probably need to translate more types, like checkboxes
        if (question !== null && (question.displayType === "select" || question.displayType === "radiobuttons")) value = translate(value, value);
        valueToDisplay += "<b>" + value + "</b>";
    }
    return valueToDisplay;
}