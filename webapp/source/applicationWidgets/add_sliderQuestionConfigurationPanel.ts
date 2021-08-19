import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

function add_sliderQuestionConfigurationPanel(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const ids = [fieldSpecification.id + "_left", fieldSpecification.id + "_right", fieldSpecification.id + "_na"];
    const storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);
    const isAnnotationQuestion = model.indexOf("AnnotationQuestion") >= 0;

    let questionPrompt =  "Enter the <strong>left and right labels</strong> you want to appear on the slider.";
    if (isAnnotationQuestion) questionPrompt += " <em>You can change these slider labels after you start using this question.</em>";

    let naPrompt = "The <strong>checkbox under the slider</strong> gives";
    if (isAnnotationQuestion) {
        naPrompt += " you a way to leave the question unanswered.";
    } else {
        naPrompt += " participants a way to say they don't want to answer the question.";
    }
    naPrompt += ' You can set the label for that checkbox here. To use the default label of "Does not apply," you can leave this field blank.';

    function getValueForIndex(index) {
        const combinedTexts = storageFunction();
        if (combinedTexts) {
            const parts = combinedTexts.split("\n");
            return parts[index] || "";
        } else {
            return "";
        }
    }

    function setNewValues() {
        const parts = [];
        for (let i = 0; i < 3; i++) { parts.push((<HTMLInputElement>document.getElementById(ids[i])).value || ""); }
        const combinedTexts = parts.join("\n");
        storageFunction(combinedTexts);       
    }

    const parts = [
        m("div.questionPrompt", sanitizeHTML.generateSanitizedHTMLForMithril(questionPrompt)),

        m("div.questionInternal", [
            m("input", {id: ids[0], value: getValueForIndex(0), disabled: panelBuilder.readOnly, onchange: function(event) {setNewValues()}}),
            m('input[type="range"]', {disabled: panelBuilder.readOnly}),
            m("input", {id: ids[1], value: getValueForIndex(1), disabled: panelBuilder.readOnly, onchange: function(event) {setNewValues()}})
        ]),
        
        m("div.questionPrompt", sanitizeHTML.generateSanitizedHTMLForMithril(naPrompt)),

        m("div.questionInternal", [
                m("input", {id: ids[2], value: getValueForIndex(2), disabled: panelBuilder.readOnly, onchange: function(event) {setNewValues()}})
            ])
    ];
    return m("div.questionExternal", parts);
}

export = add_sliderQuestionConfigurationPanel;
