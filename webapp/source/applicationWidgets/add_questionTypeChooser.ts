import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");

"use strict";

function add_questionTypeChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var project = Globals.project();
    
    //const questionCategory = fieldSpecification.displayConfiguration;
    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    const storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    const allQuestionTypes = ["label", "header", "boolean", "checkbox", "select", "radiobuttons", "slider", "checkboxes", "text", "textarea"];
    const columnNames = ["No answers", "Yes/no answer", "One answer", "Multiple answers", "Text answer"];
    const questionTypesInTableColumns = [
        ["label", "header"],
        ["boolean", "checkbox"],
        ["radiobuttons", "select", "slider"],
        ["checkboxes"],
        ["text", "textarea"]
    ]

    function isChecked(shortName, value = undefined) {
        if (value === undefined) {
            return (storageFunction() === shortName);
        } else if (value) {
            storageFunction(shortName);
        }
    }

    function buildChoiceRadioButton(aName, id): any {
        const disabled = panelBuilder.readOnly;
        return m("div.narrafirma-question-types-chooser-table-div", {disabled: disabled}, [
            m("input[type=radio]", {id: id, checked: isChecked(id), disabled: disabled, onchange: function(event) { isChecked(id, event.target.checked); }}),
            m(isChecked(id) ? "label.narrafirma-question-types-chooser-table-label-checked" : "label.narrafirma-question-types-chooser-table-label-unchecked", {for: id}, 
                m("span", [
                m("span", aName),
                m("br"),
                m("img", {
                    src: 'help/collection/questionTypeThumbnail_' + id + '.png', 
                    class: isChecked(id) ? (disabled ? "narrafirma-question-type-thumbnail-checked-disabled" : "narrafirma-question-type-thumbnail-checked") : "narrafirma-question-type-thumbnail-unchecked",
                    width: "90px"
                }),
            ])),
        ]);
    }
    
    let columnTDs = [];
    for (let i = 0; i < columnNames.length; i++) {
        let column = [];
        column.push(m("div.narrafirma-question-types-chooser-table-header", columnNames[i]));
        column.push(m("br"));
        questionTypesInTableColumns[i].forEach(function(questionType) {
            let radioButton = buildChoiceRadioButton(questionType, questionType);
            column.push(radioButton);
        })
        columnTDs.push(m("td", {"class": "narrafirma-question-types-chooser-table-td"}, m("fieldset", column)));
    }

    // TODO: Translate

    return m("div.questionExternal", [
        prompt, [m("table", {"class": "narrafirma-question-types-chooser-table"}, m("tr", columnTDs))],
    ]);
}

export = add_questionTypeChooser;
