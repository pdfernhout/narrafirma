import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

function add_checkboxQuestionConfigurationPanel(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);
    let questionPrompt =  "Enter a <strong>label</strong> for the checkbox shown in this question.";
    if (model.indexOf("AnnotationQuestion") >= 0) questionPrompt += " <em>You can change this checkbox label after you start using the question.</em>"

    function getValue() {
        const value = storageFunction();
        if (value) {
            const parts = value.split("\n");
            return parts[0] || "";
        } else {
            return "";
        }
    }

    function setNewValue(value) {
        storageFunction(value);       
    }

    const parts = [
        m("div.questionPrompt", sanitizeHTML.generateSanitizedHTMLForMithril(questionPrompt)),
        m("div.questionInternal", [
            m("input[type=checkbox]", {style: "margin-left:1em", id: fieldSpecification.id + "_check", disabled: panelBuilder.readOnly}),
            m("input", {value: getValue(), disabled: panelBuilder.readOnly, onchange: function(event) {setNewValue(event.target.value);}})
            ])
    ];
    return m("div.questionExternal", parts);
}

export = add_checkboxQuestionConfigurationPanel;
