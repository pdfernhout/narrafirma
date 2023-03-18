import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");
import standardWidgets = require("../panelBuilder/standardWidgets")

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
    naPrompt += ' You can set the label for that checkbox here. To use the default label of "Does not apply," leave this field blank.';

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

    function getOrSetSliderValue(index, value) {
        if (value === undefined) {
            return getValueForIndex(index);
        } else {
            setNewValues();
        }
    }

    const parts = [
        m("div.questionPrompt", sanitizeHTML.generateSanitizedHTMLForMithril(questionPrompt)),

        m("div.questionInternal", [
            m('input[type="text"]', {id: ids[0], 
                // switched from value to config to avoid clearing field when other user enters different data
                // value: getValueForIndex(0),
                config: standardWidgets.standardConfigMethod.bind(null, (value) => getOrSetSliderValue(0, value)),
                disabled: panelBuilder.readOnly, 
                onchange: function(event) {
                    setNewValues();
                    if (event) event.target.nf_lastRetrievedValue = event.target.value;
                    }}),
            m('input[type="range"]', {disabled: panelBuilder.readOnly}),
            m('input[type="text"]', {id: ids[1], 
                // value: getValueForIndex(1), 
                config: standardWidgets.standardConfigMethod.bind(null, (value) => getOrSetSliderValue(1, value)),
                disabled: panelBuilder.readOnly, 
                onchange: function(event) {
                    setNewValues();
                    if (event) event.target.nf_lastRetrievedValue = event.target.value;
                }})
        ]),
        
        m("div.questionPrompt", sanitizeHTML.generateSanitizedHTMLForMithril(naPrompt)),

        m("div.questionInternal", [
                m('input[type="text"]', {id: ids[2], 
                    // value: getValueForIndex(2), 
                    config: standardWidgets.standardConfigMethod.bind(null, (value) => getOrSetSliderValue(2, value)),
                    disabled: panelBuilder.readOnly, 
                    onchange: function(event) {
                        setNewValues();
                        if (event) event.target.nf_lastRetrievedValue = event.target.value;
                    }})
            ])
    ];
    return m("div.questionExternal", parts);
}

export = add_sliderQuestionConfigurationPanel;
