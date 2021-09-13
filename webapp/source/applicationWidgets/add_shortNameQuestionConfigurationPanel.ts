import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

let changeAnnotationQuestionShortNamePanelIsOpen = false;

function add_shortNameQuestionConfigurationPanel(panelBuilder: PanelBuilder, model, fieldSpecification) {

    const project = Globals.project();
    const question = Globals.project().tripleStore.makeObject(model, true);
    const isAnnotationQuestion = model.indexOf("AnnotationQuestion") >= 0;
    const storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    let questionPrompt =  `Enter a <strong>short name</strong> for the question. It will appear in lists and on graphs. It must be unique within the project.`;
    if (isAnnotationQuestion) questionPrompt += " <em>Changing this question's short name here will change it in this question and in your stories.</em> "
    
    // methods that apply to all types of questions

    function existingShortNameThatMatchesNewShortName(newShortName) {
        const allQuestions = Globals.project().collectAllQuestionsOfAnyKind();
        for (let i = 0; i < allQuestions.length; i++) {
            const question = allQuestions[i];
            const shortName = question.elicitingQuestion_shortName || question.storyQuestion_shortName || question.participantQuestion_shortName || question.annotationQuestion_shortName;
            if (shortName === newShortName && question.id != model) {
                return shortName;
            }
        }
        return null;
    }

    function setNewShortName(newShortName) {
        const existingShortName = existingShortNameThatMatchesNewShortName(newShortName);
        if (existingShortName) {
            alert('The short name "' + existingShortName + '" has already been used in this project. Please choose another short name.');
        } else {
            storageFunction(newShortName);       
        }
    }

    // methods that only apply to annotation questions

    function openChangeAnnotationQuestionShortNamePanel() {
        changeAnnotationQuestionShortNamePanelIsOpen = true;
    }

    function cancelChangingAnnotationQuestionShortName() {
        changeAnnotationQuestionShortNamePanelIsOpen = false;
    }

    function changeAnnotationQuestionShortName() {
        if (!isAnnotationQuestion) return;
        const newAnswer = (<HTMLInputElement>document.getElementById(fieldSpecification.id)).value;
        let prompt = 'You are about to change this question\'s short name from "' 
            + question.annotationQuestion_shortName + '" to "' + newAnswer 
            + '." This will affect all of the stories in the project.';
        prompt += "\n\nThis action CANNOT be undone. Are you CERTAIN that you want to change this question's short name?";
        if (confirm(prompt)) {
            changeAnnotationQuestionShortNameInQuestionAndInStories(newAnswer);
            changeAnnotationQuestionShortNamePanelIsOpen = false;
        }
    }

    function changeAnnotationQuestionShortNameInQuestionAndInStories(newShortName) {
        if (!newShortName) return;
        if (!isAnnotationQuestion) return;
        const existingShortName = existingShortNameThatMatchesNewShortName(newShortName);
        if (existingShortName) {
            alert('The short name "' + existingShortName + '" has already been used in this project. Please choose another short name.');
        } else {
            const oldQuestionID = "A_" + question.annotationQuestion_shortName;
            const newQuestionID = "A_" + newShortName;
            const allStories = project.allStoriesInProject();
            allStories.forEach((story) => {
                // the old value is left in the story just in case of a mistake
                // the stored value will never be referenced again (unless the question name is changed back to what it was)
                const value = story.fieldValue(oldQuestionID);
                story.fieldValue(newQuestionID, value);
                project.tripleStore.addTriple(story.model.storyID, newQuestionID, value);
            });
            question.annotationQuestion_shortName = newShortName;
            project.tripleStore.addTriple(model, "annotationQuestion_shortName", question.annotationQuestion_shortName);
        }
    }

    const parts = [m("div.questionPrompt", sanitizeHTML.generateSanitizedHTMLForMithril(questionPrompt))];

    if (isAnnotationQuestion) {
        let value = storageFunction();
        if (value === undefined) { // no name set
            parts.push(m("div.questionInternal", [m("input", {id: fieldSpecification.id, class: "narrafirma-textbox", style: "width: 20em;", value: storageFunction() || "", disabled: panelBuilder.readOnly, 
                    onchange: function(event) { setNewShortName(event.target.value) }})]));
        } else { // name set already
            if (!changeAnnotationQuestionShortNamePanelIsOpen) {
                const readOnlyStyle = "display: block; margin: 0.5em 0 0 1em";
                const editingStyle = "margin-left: 1em";
                parts.push(m("span", {style: panelBuilder.readOnly ? readOnlyStyle : editingStyle}, sanitizeHTML.generateSanitizedHTMLForMithril(value)));
                if (!panelBuilder.readOnly)
                    parts.push(m("button", {id: "openChangeShortNamePanel", onclick: function() {openChangeAnnotationQuestionShortNamePanel()}}, "Change")); 
            } else {
                parts.push(m("input", {id: fieldSpecification.id, class: "narrafirma-textbox-short", value: storageFunction() || "", disabled: panelBuilder.readOnly}));
                if (!panelBuilder.readOnly) {
                    parts.push(m("button", {id: "confirmShortNameChange", style: "background-color: #f88a57", onclick: function() {changeAnnotationQuestionShortName()}}, "Confirm")); 
                    parts.push(m("button", {id: "cancelShortNameChange", style: "background-color: #ffe1aa", onclick: function() {cancelChangingAnnotationQuestionShortName()}}, "Cancel")); 
                }
            }
        }
    } else { // not an annotation question
        parts.push(m("div.questionInternal", [m("input", {id: fieldSpecification.id, class: "narrafirma-textbox", style: "width: 20em;", value: storageFunction() || "", disabled: panelBuilder.readOnly, 
                onchange: function(event) { setNewShortName(event.target.value) }})]));
    }
    return m("div.questionExternal", parts);
}

export = add_shortNameQuestionConfigurationPanel;
