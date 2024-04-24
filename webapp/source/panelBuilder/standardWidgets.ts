import m = require("mithril");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import valuePathResolver = require("./valuePathResolver");
import translate = require("./translate");
import Globals = require("../Globals");
import _ = require("lodash");
import sanitizeHTML = require("../sanitizeHTML");
import dialogSupport = require("../panelBuilder/dialogSupport");

"use strict";

function getIdForText(text) {
    return text.replaceAll(" ", "_");
}

let clientState = Globals.clientState();

function closeCopyCollisionTextDialogClicked(text, hideDialogMethod) {     
    hideDialogMethod();
}

function optionsForSelect(panelBuilder: PanelBuilder, model, fieldSpecification, currentValue, addNoSelectionOption) {
    const specifiedChoices = fieldSpecification.valueOptions;
    let choices = specifiedChoices;
    
    if (_.isString(specifiedChoices)) {
        choices = valuePathResolver.newValuePath(model, specifiedChoices)();
        if (_.isString(choices)) {
            // Build choices by making items using tripleStore set
            const choiceItems = [];
            const choiceSet = Globals.project().tripleStore.getListForSetIdentifier(choices);
            for (let i = 0; i < choiceSet.length; i++) {
                const choiceIdentifier = choiceSet[i];
                const item = Globals.project().tripleStore.makeObject(choiceIdentifier, true);
                choiceItems.push(item);
            }
            choices = choiceItems;
        }
    }
    
    if (!choices) {
        console.log("No choices or options defined for select", fieldSpecification.id);
        return [];
    }

    let isValueInChoices = false;
    
    const options = [];
    
    // '-- select --'
    if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made|(no selection)"), value: "", selected: !currentValue});
    
    choices.forEach(function(each) {
        let label;
        let value;
        let selected;
        if (_.isString(each)) {
            label = translate(fieldSpecification.id + "::selection:" + each, each);
            options.push({name: label, value: each});
            if (currentValue === each) isValueInChoices = true;
        } else {
            // TODO: Maybe bug in dojo select that it does not handle values that are not strings
            // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
            if (fieldSpecification.valueOptionsSubfield) {
                if (each[fieldSpecification.valueOptionsSubfield]) {
                    value = each[fieldSpecification.valueOptionsSubfield];
                } else {
                    value = "Unnamed " + fieldSpecification.displayName + " (Warning: Cannot be accessed without a name.)";
                }
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
    
    // return isValueInChoices || (currentValue === null || currentValue === undefined || currentValue === "");
    
    return options;
}

const displayTypesWithoutValues = {
    label: true,
    header: true
};

function setSliderValueWithPopup(value, sliderValueOptions) {
    const newValueText = prompt("Type a new value", value);
    const newValue = parseInt(newValueText);
    if (newValue && newValue >= 0 && newValue <= 100) { 
        sliderValueOptions.value = newValue;
        return "" + newValue;
    } else {
        return "";
    }
}

export function standardConfigMethod(valueProperty, element, isInitialized) {
    const value = valueProperty();
    if (value === undefined) return;
    
    // nf_lastRetrievedValue is for "keeping a separate "work-in-progress" state property and another "real" property on the side"
    // https://github.com/MithrilJS/mithril.js/issues/1087
    if (!isInitialized) { 
        element.value = value; 
        element.nf_lastRetrievedValue = value;
        return; 
    }
    if (value === element.value) return;
    if (element.type !== "text" && element.type !== "textarea")  { element.value = value; return; }
    if (element !== document.activeElement) { element.value = value; return; }
    if (element.value === undefined || element.value === "") { element.value = value; return; }
    if (element.nf_lastRetrievedValue === value) return; 

    const prompt = "Collision alert!\n\nAnother user has changed this field to [ " + value + " ]. Do you want to override their entry?";
    if (confirm(prompt)) {
        valueProperty(element.value);
        element.nf_lastRetrievedValue = element.value;
    } else {
        element.value = value; 
        element.nf_lastRetrievedValue = value;
    }
}

export function displayQuestion(panelBuilder: PanelBuilder, model, fieldSpecification) {

    const fieldID = fieldSpecification.id;
    const displayType = fieldSpecification.displayType;
    let questionLabel = panelBuilder.buildQuestionLabel(fieldSpecification);

    const valueProperty = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    let value;
    if (!displayTypesWithoutValues[displayType]) {
        value = valueProperty();
    }
    if (value === undefined) value = "";

    const isAnnotationQuestion = fieldSpecification.id.indexOf("A_") >= 0;
    const useNormalDivs = typeof fieldSpecification.displayWithoutQuestionDivs === "undefined" || !fieldSpecification.displayWithoutQuestionDivs;

    let displayReadOnly = fieldSpecification.displayReadOnly;
    if (typeof fieldSpecification.displayReadOnly === "function") {
        displayReadOnly = fieldSpecification.displayReadOnly(panelBuilder, model);
    } 
    const readOnly = panelBuilder.readOnly || displayReadOnly || (fieldSpecification.valueImmutable && value) || undefined;
    const disabled = readOnly || undefined;

    let parts: any = [];

    function standardChangeMethod(event, value) {
        if (event) value = event.target.value;
        valueProperty(value);
        if (event) event.target.nf_lastRetrievedValue = event.target.value;
    }

    const standardValueOptions = {
        id: getIdForText(fieldID),
        // switched from value to config to avoid clearing field when other user enters different data
        // this only works with mithril 0.2.x, must change it when we upgrade to a newer version of mithril
        // value: value,
        config: (element, isInitialized) => standardConfigMethod(valueProperty, element, isInitialized),
        onchange: standardChangeMethod,
        readOnly: readOnly,
        disabled: disabled
    };

    ///////////////////////////////////////////////////////////////////// text /////////////////////////////////////////////////////////////////////
    function displayTextQuestion() {
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";

        let className = "narrafirma-textbox";
        if (fieldSpecification.required) {
            className += "-required";
        }

        const lengthAsNumber = Number(fieldSpecification.displayConfiguration);
        if (!isNaN(lengthAsNumber)) {
            standardValueOptions["style"] = "width: " + lengthAsNumber + "%";
        }

        return [m("input[class=" + className + "]", standardValueOptions), m("br")];
    }

    ///////////////////////////////////////////////////////////////////// textarea /////////////////////////////////////////////////////////////////////
    function displayTextareaQuestion() {
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";
        return [m("textarea[class=narrafirma-textbox]", standardValueOptions), m("br")];
    }

    ///////////////////////////////////////////////////////////////////// one checkbox /////////////////////////////////////////////////////////////////////
    function displayCheckboxQuestion() {
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";
        return [
             m("input[type=checkbox]", {
                id: getIdForText(fieldID), 
                disabled: disabled, 
                checked: value, 
                onchange: function(event) { standardChangeMethod(null, event.target.checked); }
             }),
             m("label", {"for": getIdForText(fieldID)}, fieldSpecification.displayConfiguration || ""),
             m("br")
         ];
    }

    ///////////////////////////////////////////////////////////////////// set of checkboxes /////////////////////////////////////////////////////////////////////
    function displayCheckboxesQuestion() {

        function disableUncheckedBoxesIfReachedMaxNumAnswers(checkBoxIDs) {
            let numOptionsChecked = 0;
            checkBoxIDs.map(function (anOptionID, index) {
                if (document.querySelector('#' + anOptionID + ':checked')) numOptionsChecked++;
            })
            const disableUncheckedBoxes = (numOptionsChecked >= fieldSpecification.maxNumAnswers);
            checkBoxIDs.map(function (anOptionID, index) {
                const element = document.querySelector('#' + anOptionID) as HTMLInputElement;
                if (element && !element.checked) {
                    element.disabled = disableUncheckedBoxes;
                    const label = document.querySelector('label[for="' + anOptionID + '"]');
                    if (label) label.setAttribute("style", "opacity: " + (disableUncheckedBoxes ? "0.5" : "1.0"));
                }
            })
        }

        delete questionLabel[0].attrs["for"];
        if (!value) {
            value = {};
            standardChangeMethod(null, value);
        // this else is here because of a bug (fixed) in the survey code that caused checkbox answers
        // to be stored as strings instead of dictionaries
        // this will convert the string to a dictionary without losing the (one) value that was set
        } else if (typeof(value) === "string") {
            const option = value;
            value = {}
            value[option] = true;
            standardChangeMethod(null, value);
        }
    
        const checkBoxIDsForThisQuestion = [];
        if (fieldSpecification.maxNumAnswers) {
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionID = getIdForText(fieldID + "_" + option);
                checkBoxIDsForThisQuestion.push(optionID);
            });
        }

        if (!fieldSpecification.valueOptions || fieldSpecification.valueOptions.length < 1) { 
            if (!isAnnotationQuestion) {
                return [m("p", "Survey error: No options were created for this question.")];
            }
        }

        const questionParts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionName = (typeof option === "string") ? option : option.name;
                const optionValue = (typeof option === "string") ? option : option.value;
                const optionID = getIdForText(fieldID + "_" + option); 
                return [
                    m("input[type=checkbox]", {
                        id: optionID, 
                        checked: !!value[optionValue], 
                        onchange: function(event) {
                            value[optionValue] = event.target.checked; 
                            standardChangeMethod(null, value); 
                            if (fieldSpecification.maxNumAnswers) {
                                disableUncheckedBoxesIfReachedMaxNumAnswers(checkBoxIDsForThisQuestion);
                            }
                        }
                    }),
                    m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(optionName)),
                    m("br")
                ];
            })
        ];
        questionParts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
        return questionParts;     
    }

    ///////////////////////////////////////////////////////////////////// radio buttons /////////////////////////////////////////////////////////////////////
    function displayRadioButtonsQuestion() {
        delete questionLabel[0].attrs["for"];
        const questionParts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionID = getIdForText(fieldID + "_" + option);
                return [
                    m("input[type=radio]", {
                        id: optionID, 
                        value: option, 
                        name: fieldSpecification.id, 
                        disabled: disabled, 
                        checked: value === option, 
                        onchange: standardChangeMethod.bind(null, null, option) 
                    }),
                    m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(option)),
                    m("br")
                ];
            })
        ];
        questionParts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
        return questionParts;
    }

    ///////////////////////////////////////////////////////////////////// boolean /////////////////////////////////////////////////////////////////////
    function displayBooleanQuestion() {
        delete questionLabel[0].attrs["for"];
        const questionParts = [
            m("input[type=radio]", {
                id: getIdForText(fieldID + "_yes"), 
                value: true, 
                name: fieldSpecification.id, 
                disabled: disabled, 
                checked: value === true, 
                onchange: standardChangeMethod.bind(null, null, true) }),
            m("label", {"for": getIdForText(fieldID + "_yes")}, "yes"),
            m("br"),
            m("input[type=radio]", {
                id: getIdForText(fieldID + "_no"), 
                value: false, 
                name: fieldSpecification.id, 
                disabled: disabled, 
                checked: value === false, 
                onchange: standardChangeMethod.bind(null, null, false) }),
            m("label", {"for": getIdForText(fieldID + "_no")}, "no"),
            m("br")
        ];
        questionParts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
        return questionParts;
    }

    ///////////////////////////////////////////////////////////////////// select /////////////////////////////////////////////////////////////////////
    function displaySelectQuestion() {
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";

        const selectOptionsRaw = optionsForSelect(panelBuilder, model, fieldSpecification, value, !fieldSpecification.displayConfiguration);
        const selectOptions = selectOptionsRaw.map(function (option, index) {
            const optionOptions = {value: option.value, selected: undefined};
            if (option.selected) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.name);
        });
        
        let sizeAsNumber = Number(fieldSpecification.displayConfiguration);
        if (!isNaN(sizeAsNumber)) standardValueOptions["size"] = sizeAsNumber;
        return [m("select", standardValueOptions, selectOptions), (fieldSpecification.displayWithoutQuestionDivs || isAnnotationQuestion) ? "" : m("br")];
    }

    ///////////////////////////////////////////////////////////////////// slider /////////////////////////////////////////////////////////////////////
    function displaySliderQuestion() {

        function isEmpty(value) {
            return value === undefined || value === null || value === "";
        }
        
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";

        const checkboxID = getIdForText(fieldID) + "_doesNotApply";
        const sliderValueOptions = { value: value, id: getIdForText(fieldID), onchange: standardChangeMethod, readOnly: readOnly, disabled: disabled, min: 0, max: 100, step: 1 };
        
        let leftSideText = "";
        let rightSideText = "";
        let doesNotApplyText = "Does not apply";
        if (fieldSpecification.displayConfiguration) {
            if (fieldSpecification.displayConfiguration.length > 1) {
                leftSideText = fieldSpecification.displayConfiguration[0];
                rightSideText = fieldSpecification.displayConfiguration[1];
            }
            if (fieldSpecification.displayConfiguration.length > 2) {
                if (fieldSpecification.displayConfiguration[2])
                    doesNotApplyText = fieldSpecification.displayConfiguration[2];
            }
        }
        
       // Could suggest 0-100 to support <IE10 that don't have range input -- or could do polyfill
        // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";

        const questionParts = [
            m("span", {"class": "narrafirma-slider-low-arrow"}, "◀"),
            m("span", {"class": "narrafirma-slider-low"}, leftSideText),
            m('span', {"class": "narrafirma-slider"}, m('input[type="range"]', sliderValueOptions)),
            m('span', {"class": "narrafirma-slider-high"}, rightSideText),
            m('span', {"class": "narrafirma-slider-high-arrow"}, "▶"),
            m("span", {"class": "narrafirma-slider-value", "tabindex": "0", 
                onclick: function(event) {
                   const newValue = setSliderValueWithPopup(value, sliderValueOptions);
                   if (newValue) valueProperty(newValue);
                },
                onkeypress: function(event) {
                    if (event.keyCode == 13) {
                        const newValue = setSliderValueWithPopup(value, sliderValueOptions);
                        if (newValue) valueProperty(newValue);
                    }
                },
            }, value),
            m("br"),
            m('input[type="checkbox"]', {
                "class": "narrafirma-slider-does-not-apply",
                id: checkboxID,
                checked: isEmpty(sliderValueOptions.value),
                onclick: function(event) { 
                    if (event.target.checked) { 
                        valueProperty(""); 
                    } else {
                        valueProperty("50");
                    }
                }
            }),
            m("label", {"for": checkboxID}, doesNotApplyText)
        ];
        return questionParts;
    }

    function addAnnotationAnswer(event) {
        const newAnswer = prompt('Type a new answer to add to the list of available answers for the annotation question "' + fieldSpecification.displayName + '."');
        if (newAnswer) {
            fieldSpecification.valueOptions.push(newAnswer);
            Globals.project().addOptionToAnnotationChoiceQuestion(fieldSpecification.id, newAnswer);
            m.redraw();
        }
    }

    ///////////////////////////////////////////////////////////////////// now call the methods ///////////////////////////////////////////////////////////////

    if (displayType === "label") {
        // Nothing to do
    } else if (displayType === "header") {
        // Nothing to do; bolding done using style
    } else if (displayType === "text") {
        parts = displayTextQuestion();
    } else if (displayType === "textarea") {
        parts = displayTextareaQuestion();
    } else if (displayType === "checkbox") {
        parts = displayCheckboxQuestion();
    } else if (displayType === "checkboxes") {
        parts = [m("fieldset", displayCheckboxesQuestion())];
        if (isAnnotationQuestion) parts.push(m("button.narrafirma-add-annotation-choice", {style: "margin-left: 1.5em", onclick: addAnnotationAnswer}, 
            m("span", {class: "buttonWithTextImage addButtonImage"}), "Add New Answer"));
    } else if (displayType === "radiobuttons") {
        parts = [m("fieldset", displayRadioButtonsQuestion())];
        if (isAnnotationQuestion) parts.push(m("button.narrafirma-add-annotation-choice", {style: "margin-left: 1.5em", onclick: addAnnotationAnswer}, 
            m("span", {class: "buttonWithTextImage addButtonImage"}), "Add New Answer"));
    } else if (displayType === "boolean") {
        parts = [m("fieldset", displayBooleanQuestion())];
    } else if (displayType === "select") {
        parts = displaySelectQuestion();
        if (isAnnotationQuestion) parts.push(m("button.narrafirma-add-annotation-choice", {onclick: addAnnotationAnswer}, 
            m("span", {class: "buttonWithTextImage addButtonImage"}), "Add New Answer"));
    } else if (displayType === "slider") {
        parts = displaySliderQuestion();

    } else {
        parts = [
            m("span", {style: {"font-weight": "bold"}}, "UNFINISHED: " + fieldSpecification.displayType),
            m("br")
        ];
    }

    if (parts.length && useNormalDivs) {
        parts = m("div", {"class": "questionInternal narrafirma-question-type-" + displayType}, parts);
    }
    
    if (questionLabel) {
        parts = questionLabel.concat(parts);
    }
    
    let classString = "questionExternal";
    if (isAnnotationQuestion) classString += "-annotation"; 
    classString += " narrafirma-question-type-" + displayType;

    if (readOnly) classString += " read-only";
    
    if (fieldSpecification.displayClass) {
        classString += " " + fieldSpecification.displayClass;
    }
    if (useNormalDivs) {
        return m("div", {key: fieldID, "class": classString}, parts);
    } else {
        return parts;
    }
}
