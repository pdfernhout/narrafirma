import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

let answersWithOpenChangePanels = [];

function add_choiceQuestionAnswersManagementPanel(panelBuilder: PanelBuilder, model, fieldSpecification) {

    const question = Globals.project().tripleStore.makeObject(model, true);
    if (!question) return m("div.questionExternal", sanitizeHTML.generateSanitizedHTMLForMithril("ERROR: Could not find question " + model));
    if (["select", "radiobuttons", "checkboxes"].indexOf(question.annotationQuestion_type) < 0) { return null; }
    
    const project = Globals.project();
    const allStories = project.allStoriesInProject();

    function storyCountForAnswer(answer) {
        let result = 0;
        allStories.forEach((story) => {
            const value = story.fieldValue("A_" + question.annotationQuestion_shortName);
            if (typeof value == "string") { // select, radiobuttons - value is string
                if (value === answer) result++;
            } else { // checkboxes - value is dictionary
                if (value.hasOwnProperty(answer) && value[answer]) result++;
            }
        });
        return result;
    }

    function showChangeAnswerPanel(answer) {
        if (answersWithOpenChangePanels.indexOf(answer) < 0)
            answersWithOpenChangePanels.push(answer);
    }

    function hideChangeAnswerPanel(answer) {
        const answerIndex = answersWithOpenChangePanels.indexOf(answer);
        if (answerIndex >= 0) {
            answersWithOpenChangePanels.splice(answerIndex, 1);
        }
    }

    function moveAnswerUpOrDown(answer, upOrDown) {
        let answers = [];
        if (question.annotationQuestion_options) { answers = question.annotationQuestion_options.split("\n");}
        const answerIndex = answers.indexOf(answer);
        if (answerIndex >= 0) {
            answers.splice(answerIndex, 1);
            if (upOrDown === "up") {
                if (answerIndex + 1 > answers.length) {
                    answers.unshift(answer);
                } else {
                    answers.splice(answerIndex+1, 0, answer);
                }
            } else if (upOrDown === "down") {
                if (answerIndex - 1 < 0) {
                    answers.push(answer);
                } else {
                    answers.splice(answerIndex-1, 0, answer);
                }
            }
        }
        question.annotationQuestion_options = answers.join("\n");
        project.tripleStore.addTriple(model, "annotationQuestion_options", question.annotationQuestion_options);
    }

    function moveAnswerUp(answer) {
        // down on the screen is up in the list!
        moveAnswerUpOrDown(answer, "down");
    }

    function moveAnswerDown(answer) {
         // down on the screen is up in the list!
        moveAnswerUpOrDown(answer, "up");
    }

    function changeAnswer(answer, inputID) {
        const questionID = "A_" + question.annotationQuestion_shortName;
        const element = (<HTMLInputElement>document.getElementById(inputID));
        if (element) {
            const newAnswer = element.value;
            if (newAnswer && newAnswer != answer) {
                const storyCount = storyCountForAnswer(answer);
                const storyCountText = (storyCount == 1) ? " story" : " stories";
                let prompt = 'You are about to change the answer "' + answer + '" to "' + newAnswer 
                    + '" in the question "' + question.annotationQuestion_shortName;
                if (storyCount > 0) {
                    prompt += '" - and in ' + storyCount + storyCountText + ".";
                } else {
                    prompt += '."';
                } 
                prompt += "\n\nThis action CANNOT be undone. Are you ABSOLUTELY CERTAIN you want to rename this answer?";
                if (confirm(prompt)) {
                    changeAnswerInData(questionID, answer, newAnswer);
                    hideChangeAnswerPanel(answer);
                }
            }
        }
    }

    function cancelChangingAnswer(answer) {
        hideChangeAnswerPanel(answer);
    }

    function removeAnswer(answer) {
        const questionID = "A_" + question.annotationQuestion_shortName;
        const storyCount = storyCountForAnswer(answer);
        const storyCountText = (storyCount == 1) ? " story" : " stories";
        let prompt = 'You are about to remove the answer "' + answer + '" from the question "'
            + question.annotationQuestion_shortName;
        if (storyCount > 0) {
            prompt += '" - and from ' + storyCount + storyCountText + ".";
        } else {
            prompt += '."';
        }
        prompt += "\n\n You CANNOT undo this. Are you SURE you want to remove this answer?";
        if (confirm(prompt)) {
            changeAnswerInData(questionID, answer, null);
        }
    }

    function changeAnswerInData(questionID, answer, newAnswer) {
        allStories.forEach((story) => {
            const value = story.fieldValue(questionID);
            if (value) {
                if (typeof value == "string") { // select, radiobuttons - value is string
                    if (value === answer) {
                        project.tripleStore.addTriple(story.model.storyID, questionID, newAnswer);
                    }
                } else { // checkboxes - value is dictionary
                    if (value.hasOwnProperty(answer)) {
                        delete value[answer];
                        if (newAnswer) value[newAnswer] = true;
                        project.tripleStore.addTriple(story.model.storyID, questionID, value);
                    }
                }
            }
        });
        let answers = [];
        if (question.annotationQuestion_options) { answers = question.annotationQuestion_options.split("\n");}
        const answerIndex = answers.indexOf(answer);
        if (answerIndex >= 0) {
            answers.splice(answerIndex, 1);
        }
        if (newAnswer) {
            if (answers.indexOf(newAnswer) < 0) {
                answers.push(newAnswer); 
            }
        }
        question.annotationQuestion_options = answers.join("\n");
        project.tripleStore.addTriple(model, "annotationQuestion_options", question.annotationQuestion_options);
    }

    function addAnswer() {
        const newAnswer = prompt('Type a new answer to add to the list of available answers for the annotation question "' + question.annotationQuestion_shortName + '."');
        if (newAnswer) {
            let answers = [];
            if (question.annotationQuestion_options) { answers = question.annotationQuestion_options.split("\n");}
            if (answers.indexOf(newAnswer) < 0) {
                answers.push(newAnswer); 
                question.annotationQuestion_options = answers.join("\n");
                project.tripleStore.addTriple(model, "annotationQuestion_options", question.annotationQuestion_options);
            }
        }
    }

    let questionPrompt = `These are the <strong>answers</strong> you have entered for this question.
        <em>Changing an answer here will change it in this question and in your stories.</em>`;

    const parts = [];
    let answers = [];
    if (question.annotationQuestion_options) { answers = question.annotationQuestion_options.split("\n");}
    if (answers.length > 0) {
        answers.map(function(answer, index) {
            const partsForThisAnswer = [];
            const storyCount = storyCountForAnswer(answer);
            const storyCountText = (storyCount == 1) ? " story" : " stories";
            partsForThisAnswer.push(m(panelBuilder.readOnly ? "div" : "span", {style: panelBuilder.readOnly ? "margin: 0.5em 0 0 0.5em" : "margin: 0"}, answer + " - " + storyCount + storyCountText));

            if (!panelBuilder.readOnly) { 
                if (answersWithOpenChangePanels.indexOf(answer) < 0) {
                    partsForThisAnswer.push(m("button", {id: "moveAnswerUp", onclick: function() {moveAnswerUp(answer)}}, "↑")); 
                    partsForThisAnswer.push(m("button", {id: "moveAnswerDown", onclick: function() {moveAnswerDown(answer)}}, "↓")); 
                    partsForThisAnswer.push(m("button", {id: "changeAnswer", onclick: function() {showChangeAnswerPanel(answer)}}, "Change")); 
                    partsForThisAnswer.push(m("button", {id: "removeAnswerFromList", onclick: function() {removeAnswer(answer)}}, "Remove")); 
                } else {
                    const inputID = question.annotationQuestion_shortName + "_" + answer + "_change";
                    partsForThisAnswer.push(m("input", {id: inputID, style: "margin-left: 1em"}));
                    partsForThisAnswer.push(m("button", {id: "confirmAnswerChange", style: "background-color: #f88a57", onclick: function() {changeAnswer(answer, inputID)}}, "Confirm")); 
                    partsForThisAnswer.push(m("button", {id: "cancelAnswerChange", style: "background-color: #ffe1aa", onclick: function() {cancelChangingAnswer(answer)}}, "Cancel")); 
                }
            }
            parts.push(m("div.narrafirma-annotation-choice-answers-answer", partsForThisAnswer));
        })
    } else {
        parts.push(m("div.narrafirma-annotation-choice-answers-answer", '(No answers have been created. Click "Add a New Answer" to create one.)'));
    }
    if (!panelBuilder.readOnly) { 
        parts.push(m("button", {id: "addAnswerToList", onclick: function() {addAnswer()}}, "Add a New Answer")); 
    }

    return m("div.questionExternal", 
        [m("div.narrafirma-annotation-choice-answers-prompt", sanitizeHTML.generateSanitizedHTMLForMithril(questionPrompt)), parts]);

}

export = add_choiceQuestionAnswersManagementPanel;
