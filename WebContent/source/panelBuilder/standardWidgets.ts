import m = require("mithril");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import valuePathResolver = require("./valuePathResolver");
import translate = require("./translate");

"use strict";

function getIdForText(text) {
    return text;
}

function optionsForSelect(panelBuilder, model, fieldSpecification, currentValue, addNoSelectionOption) {
    var specifiedChoices = fieldSpecification.valueOptions;
    var choices = specifiedChoices;
    
    if (_.isString(specifiedChoices)) {
        var choicesModelAndField = valuePathResolver.resolveModelAndFieldForValuePath(panelBuilder, model, specifiedChoices);
        console.log("choicesModelAndField", choicesModelAndField);
        
        var choicesModel = choicesModelAndField.model;
        var choicesField = choicesModelAndField.field;
        
        choices = choicesModel[choicesField];
    }
    
    if (!choices) {
        console.log("No choices or options defined for select", fieldSpecification.id);
        return [];
    }

    var isValueInChoices = false;
    
    var options = [];
    
    // '-- select --'
    if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made|(no selection)"), value: "", selected: !currentValue});
    
    choices.forEach(function(each) {
        var label;
        var value;
        var selected;
        // console.log("choice", id, each);
        if (_.isString(each)) {
            label = translate(fieldSpecification.id + "::selection:" + each, each);
            options.push({name: label, value: each});
            if (currentValue === each) isValueInChoices = true;
        } else {
            // TODO: Maybe bug in dojo select that it does not handle values that are not strings
            // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
            if (fieldSpecification.valueOptionsSubfield) {
                value = each[fieldSpecification.valueOptionsSubfield];
            } else {
                value = each.value;
            }
            if (fieldSpecification.displayDataOptionField) {
                label = each[fieldSpecification.displayDataOptionField];
            } else {
                label = value;
            }
            label = translate(fieldSpecification.id + "::selection:" + label, label);
            if (currentValue === value) {
                selected = true;
                isValueInChoices = true;
            } else {
                selected = undefined;
            }
            options.push({name: label, value: value, selected: selected});
        }
    });
    
    // console.log("isValueInChoices", isValueInChoices);

    // console.log("updateChoices", currentValue, isValueInChoices, (currentValue === null || currentValue === undefined || currentValue === ""));
    // return isValueInChoices || (currentValue === null || currentValue === undefined || currentValue === "");
    
    return options;
}

export function displayQuestion(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var fieldID = fieldSpecification.id;

    var displayType = fieldSpecification.displayType;
    var questionLabel = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    function makeLabel() {
        // The for attribute of the label element must refer to a form control.
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";
    }
    
    var parts: any = [];
    function makeLegend() {
        // Do nothing for now
        parts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
    }
    
    var modelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
    var value = modelAndField.model[modelAndField.field];
    if (value === undefined) value = "";
    
    function change(event, value) {
        if (event) value = event.target.value;
        // console.log("onchange", fieldSpecification.id, value);
        model[fieldSpecification.id] = value;
        // TODO: redraw on value change seems not needed in this survey case, since values do not affect anything about rest of application?
        // redraw();
        // Except for one case. Could there be more?
        if (fieldSpecification.id === "__survey_storyName") panelBuilder.redraw();
    }
    
    var standardValueOptions = {
        value: value,
        id: getIdForText(fieldID),
        onchange: change
    };
    
    if (displayType === "label") {
        // Nothing to do
    } else if (displayType === "header") {
        // Nothing to do; bolding done using style
    } else if (displayType === "text") {
        makeLabel();
        parts = [
            m("input", standardValueOptions),
            m("br")
        ];
    } else if (displayType === "textarea") {
        makeLabel();
        parts = [
            m("textarea", standardValueOptions),
            m("br")
        ];
    } else if (displayType === "checkbox") {
        makeLabel();
        parts = [
             m("input[type=checkbox]", {id: getIdForText(fieldID), checked: value, onchange: function(event) {change(null, event.target.checked);}}),
             m("br")
         ];
    } else if (displayType === "checkboxes") {
        // The for attribute of the label element must refer to a form control.
        delete questionLabel[0].attrs["for"];
        if (!value) {
            value = {};
            model[fieldSpecification.id] = value;
        }
        parts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                var optionID = getIdForText(fieldID + "_" + option);
                return [
                    m("input[type=checkbox]", {id: optionID, checked: !!value[option], onchange: function(event) {value[option] = event.target.checked; change(null, value); } }),
                    m("label", {"for": optionID}, option),
                    m("br")
                ];
            })
        ];
        makeLegend();
        parts = [m("fieldset", parts)];
    } else if (displayType === "radiobuttons") {
        // The for attribute of the label element must refer to a form control.
        delete questionLabel[0].attrs["for"];
        parts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                var optionID = getIdForText(fieldID + "_" + option);
                return [
                    m("input[type=radio]", {id: optionID, value: option, name: fieldSpecification.id, checked: value === option, onchange: change.bind(null, null, option) }),
                    m("label", {"for": optionID}, option), 
                    m("br")
                ];
            })
        ];
        makeLegend();
        parts = [m("fieldset", parts)];
    } else if (displayType === "boolean") {
        // The for attribute of the label element must refer to a form control.
        delete questionLabel[0].attrs["for"];
        parts = [
            m("input[type=radio]", {id: getIdForText(fieldID + "_yes"), value: true, name: fieldSpecification.id, checked: value === true, onchange: change.bind(null, null, true) }),
            m("label", {"for": getIdForText(fieldID + "_yes")}, "yes"),
            m("br"),
            m("input[type=radio]", {id: getIdForText(fieldID + "_no"), value: false, name: fieldSpecification.id, checked: value === true, onchange: change.bind(null, null, false) }),
            m("label", {"for": getIdForText(fieldID + "_no")}, "no"),
            m("br")
        ];
        makeLegend();
        parts = [m("fieldset", parts)];
    } else if (displayType === "select") {
        makeLabel();
        var selectOptionsRaw = optionsForSelect(panelBuilder, model, fieldSpecification, value, true);
        var selectOptions = selectOptionsRaw.map(function (option, index) {
            var optionOptions = {value: option.value, selected: undefined};
            // console.log("optionValue, value", optionValue, value, optionValue === value);
            if (option.selected) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.name);
        });

        parts = [
            m("select", standardValueOptions, selectOptions),
            m("br")
        ];
    } else if (displayType === "slider") {
        makeLabel();
        // Could suggest 0-100 to support <IE10 that don't have range input -- or coudl do polyfill
        // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";
        parts = [
            m("span", {class: "narrafirma-survey-low"}, fieldSpecification.displayConfiguration[0]),
            m('span', {class: "narrafirma-survey-slider"}, m('input[type="range"]', standardValueOptions)),
            m('span', {class: "narrafirma-survey-high"}, fieldSpecification.displayConfiguration[1])
        ];
    } else {
        parts = [
            m("span", {style: {"font-weight": "bold"}}, "UNFINISHED: " + fieldSpecification.displayType),
            m("br")
        ];
    }

    if (parts.length) {
        parts = m("div", {class: "narrafirma-survey-question-internal"}, parts);
    }
    
    if (questionLabel) {
        parts = questionLabel.concat(parts);
    }
    
    var classString = "narrafirma-survey-question-external narrafirma-survey-question-type-" + displayType;
    if (fieldSpecification.displayClass) {
        classString += " " + fieldSpecification.displayClass;
    }
    return m("div", {class: classString}, parts);
}
