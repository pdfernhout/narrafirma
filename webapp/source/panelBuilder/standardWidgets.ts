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
    var specifiedChoices = fieldSpecification.valueOptions;
    var choices = specifiedChoices;
    
    if (_.isString(specifiedChoices)) {
        choices = valuePathResolver.newValuePath(model, specifiedChoices)();
        if (_.isString(choices)) {
            // Build choices by making items using tripelStore set
            var choiceItems = [];
            var choiceSet = Globals.project().tripleStore.getListForSetIdentifier(choices);
            for (var i = 0; i < choiceSet.length; i++) {
                var choiceIdentifier = choiceSet[i];
                var item = Globals.project().tripleStore.makeObject(choiceIdentifier, true);
                choiceItems.push(item);
            }
            choices = choiceItems;
        }
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

var displayTypesWithoutValues = {
    label: true,
    header: true
};

function setSliderValueWithPopup(value, sliderValueOptions) {
    var newValueText = prompt("Type a new value", value);
    var newValue = parseInt(newValueText);
    if (newValue && newValue >= 0 && newValue <= 100) { 
        sliderValueOptions.value = newValue;
        return "" + newValue;
    } else {
        return "";
    }
}

export function displayQuestion(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var fieldID = fieldSpecification.id;

    var displayType = fieldSpecification.displayType;
    var questionLabel = panelBuilder.buildQuestionLabel(fieldSpecification);
    const isAnnotationQuestion = fieldSpecification.id.indexOf("A_") >= 0;

    var useNormalDivs = typeof fieldSpecification.displayWithoutQuestionDivs === "undefined" || !fieldSpecification.displayWithoutQuestionDivs;
    
    function makeLabel() {
        // The for attribute of the label element must refer to a form control.
        questionLabel[0].attrs["for"] = getIdForText(fieldID);
        questionLabel[0].tag = "label";
    }

    function addAnnotationAnswer(event) {
        const newAnswer = prompt('Type a new answer to add to the list of available answers for the annotation question "' + fieldSpecification.displayName + '."');
        if (newAnswer) {
            fieldSpecification.valueOptions.push(newAnswer);
            Globals.project().addOptionToAnnotationChoiceQuestion(fieldSpecification.id, newAnswer);
            m.redraw();
        }
    }
    
    var parts: any = [];
    function makeLegend() {
        // Do nothing for now
        parts.unshift(m("legend", questionLabel[0]));
        questionLabel = [];
    }
    
    var valueProperty = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    // Only fetch value if the field needs it
    var value;
    if (!displayTypesWithoutValues[displayType]) {
        value = valueProperty();
    }
    if (value === undefined) value = "";

    // if someone has been working in a textarea and has written a lot of text, and it is about to be ovewritten because somebody else was doing the same thing,
    // show them both texts so they can resolve the conflict
    if (displayType === "textarea") {
        if (clientState.anHTMLElementValueIsBeingSetBecauseOfAnIncomingMessage()) {
            const element = <HTMLTextAreaElement>document.getElementById(fieldID);
            const activeElement = <HTMLTextAreaElement>document.activeElement;
            if (element && element === activeElement) { // only do this for the textarea they are actually editing right now, not all the textareas on the page
                if (element.value !== value) {
                    // more changes might come in while the user is attempting to resolve the conflict!
                    // if that happens, keep adding more to the "overwritten texts" box, so they don't lose any of the versions of what they wrote
                    const alreadyOverwrittenText = clientState.cachedOverwrittenTexts(fieldID);
                    if (alreadyOverwrittenText) {
                        clientState.cachedOverwrittenTexts(fieldID, element.value + "\n---\n" + alreadyOverwrittenText);
                        console.log('Collision alert: Another user has changed "' + fieldSpecification.displayName + '"\n-- from --\n"' + clientState.cachedOverwrittenTexts(fieldID) + '"\n-- to --\n"' + value + '"');
                    } else {
                        clientState.cachedOverwrittenTexts(fieldID, element.value);
                        console.log('Collision alert: Another user has changed "' + fieldSpecification.displayName + '"\n-- from --\n"' + clientState.cachedOverwrittenTexts(fieldID) + '"\n-- to --\n"' + value + '"');
                    }
                }
            }
        }
    }
    
    function change(event, value) {
        if (event) value = event.target.value;
        valueProperty(value);
    }

    function isEmpty(value) {
        return value === undefined || value === null || value === "";
    }
    
    var readOnly = panelBuilder.readOnly || fieldSpecification.displayReadOnly || (fieldSpecification.valueImmutable && value) || undefined;
    // var disabled = (readOnly && displayType === "select") || undefined;
    var disabled = readOnly || undefined;

    var standardValueOptions = {
        value: value,
        id: getIdForText(fieldID),
        onchange: change,
        readOnly: readOnly,
        disabled: disabled
    };
    
    /////////////////////// LABEL

    if (displayType === "label") {
        // Nothing to do

    ///////////////////////////////////////////////////////////////////// HEADER /////////////////////////////////////////////////////////////////////

    } else if (displayType === "header") {
        // Nothing to do; bolding done using style
    
    ///////////////////////////////////////////////////////////////////// TEXT /////////////////////////////////////////////////////////////////////

    } else if (displayType === "text") {
        makeLabel();
        parts = [
            m("input[class=narrafirma-textbox]", standardValueOptions),
            m("br")
        ];

    ///////////////////////////////////////////////////////////////////// TEXTAREA /////////////////////////////////////////////////////////////////////

    } else if (displayType === "textarea") {
        makeLabel();
        parts = [
            m("textarea[class=narrafirma-textbox]", standardValueOptions),

            clientState.cachedOverwrittenTexts(fieldID) ? 
            
                m("div.narrafirma-collision-message", 
                    m("div.narrafirma-collision-header", m("b", "Collision alert!"), " Another user has changed the contents of this text box. This is your version. It will remain here until you click one of the buttons below (or reload the page)."), 
                    m("textarea[class=narrafirma-textbox]", {value: clientState.cachedOverwrittenTexts(fieldID), id: fieldID + "_cached"}),
                    m("div.narrafirma-collision-buttons", [
                        m("button.narrafirma-collision-button", {onclick: function () {
                            // set the field value to the cached version, then delete the cached version
                            valueProperty(clientState.cachedOverwrittenTexts(fieldID));
                            clientState.cachedOverwrittenTexts(fieldID, null);
                        }}, "Keep this version (delete theirs)"),
                        m("button.narrafirma-collision-button", {onclick: function () {
                            // just delete the cached version, thereby keeping the changed version
                            clientState.cachedOverwrittenTexts(fieldID, null);
                        }}, "Keep their version (delete this one)"),
                        m("button.narrafirma-collision-button", {onclick: function () {
                            // this does the same thing as accepting the other user's version, except that we assume this user has changed the field before they clicked this button
                            clientState.cachedOverwrittenTexts(fieldID, null);
                        }}, "I have resolved the conflict myself (delete this version)"),]),
                    m("div.narrafirma-collision-explanation", "You can also find both versions of the text in your browser's development console (until you reload the page).")
                ) : [],

            m("br")
        ];

    ///////////////////////////////////////////////////////////////////// CHECKBOX /////////////////////////////////////////////////////////////////////

    } else if (displayType === "checkbox") {
        makeLabel();
        var checkboxText = "";
        if (fieldSpecification.displayConfiguration) {
            checkboxText = fieldSpecification.displayConfiguration;
        }
        parts = [
             m("input[type=checkbox]", {
                id: getIdForText(fieldID), 
                disabled: disabled, 
                checked: value, 
                onchange: function(event) {
                    change(null, event.target.checked); 
                }
             }),
             m("label", {"for": getIdForText(fieldID)}, checkboxText),
             m("br")
         ];
    
    ///////////////////////////////////////////////////////////////////// CHECKBOXES /////////////////////////////////////////////////////////////////////

    } else if (displayType === "checkboxes") {
        // The for attribute of the label element must refer to a form control.
        delete questionLabel[0].attrs["for"];
        if (!value) {
            value = {};
            change(null, value);
        // this else is here because of a bug (fixed) in the survey code that caused checkbox answers
        // to be stored as strings instead of dictionaries
        // this will convert the string to a dictionary without losing the (one) value that was set
        } else if (typeof(value) === "string") {
            var option = value;
            value = {}
            value[option] = true;
            change(null, value);
        }
        const checkBoxIDsForThisQuestion = [];
        if (fieldSpecification.displayType === "checkboxes" && fieldSpecification.maxNumAnswers) {
            fieldSpecification.valueOptions.map(function (option, index) {
                const optionID = getIdForText(fieldID + "_" + option);
                checkBoxIDsForThisQuestion.push(optionID);
            })
        }
        parts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                let optionID = getIdForText(fieldID + "_" + option);
                return [
                    m("input[type=checkbox]", {
                        id: optionID, 
                        disabled: disabled, 
                        checked: !!value[option], 
                        onchange: function(event) {
                            value[option] = event.target.checked; 
                            change(null, value); 

                            value[option] = event.target.checked; 
                            change(null, value); 

                            if (fieldSpecification.maxNumAnswers) {
                                let numOptionsChecked = 0;
                                checkBoxIDsForThisQuestion.map(function (anOptionID, index) {
                                    if (document.querySelector('#' + anOptionID + ':checked')) numOptionsChecked++;
                                })
                                const disableUncheckedBoxes = (numOptionsChecked >= fieldSpecification.maxNumAnswers);
                                checkBoxIDsForThisQuestion.map(function (anOptionID, index) {
                                    const element = document.querySelector('#' + anOptionID) as HTMLInputElement;
                                    if (element && !element.checked) {
                                        element.disabled = disableUncheckedBoxes;
                                        const label = document.querySelector('label[for="' + anOptionID + '"]');
                                        if (label) label.setAttribute("style", "opacity: " + (disableUncheckedBoxes ? "0.5" : "1.0"));
                                    }
                                })
                            }
                        } 
                    }),
                    m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(option)), 
                    m("br"),
                ];
            })
        ];
        makeLegend();
        parts = [m("fieldset", parts)];
        if (isAnnotationQuestion) parts.push(m("button.narrafirma-add-annotation-choice", {style: "margin-left: 1.5em", onclick: addAnnotationAnswer}, "Add New Answer"));

    ///////////////////////////////////////////////////////////////////// RADIO BUTTONS /////////////////////////////////////////////////////////////////////

    } else if (displayType === "radiobuttons") {
        // The for attribute of the label element must refer to a form control.
        delete questionLabel[0].attrs["for"];
        parts = [
            fieldSpecification.valueOptions.map(function (option, index) {
                var optionID = getIdForText(fieldID + "_" + option);
                return [
                    m("input[type=radio]", {
                        id: optionID, 
                        value: option, 
                        name: fieldSpecification.id, 
                        disabled: disabled, 
                        checked: value === option, 
                        onchange: change.bind(null, null, option) 
                    }),
                    m("label", {"for": optionID}, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(option)),
                    m("br")
                ];
            })
        ];
        makeLegend();
        parts = [m("fieldset", parts)];
        if (isAnnotationQuestion) parts.push(m("button.narrafirma-add-annotation-choice", {style: "margin-left: 1.5em", onclick: addAnnotationAnswer}, "Add New Answer"));

    ///////////////////////////////////////////////////////////////////// BOOLEAN /////////////////////////////////////////////////////////////////////

    } else if (displayType === "boolean") {
        // The for attribute of the label element must refer to a form control.
        delete questionLabel[0].attrs["for"];
        parts = [
            m("input[type=radio]", {
                id: getIdForText(fieldID + "_yes"), 
                value: true, 
                name: fieldSpecification.id, 
                disabled: disabled, 
                checked: value === true, 
                onchange: change.bind(null, null, true) }),
            m("label", {"for": getIdForText(fieldID + "_yes")}, "yes"),
            m("br"),
            m("input[type=radio]", {
                id: getIdForText(fieldID + "_no"), 
                value: false, 
                name: fieldSpecification.id, 
                disabled: disabled, 
                checked: value === false, 
                onchange: change.bind(null, null, false) }),
            m("label", {"for": getIdForText(fieldID + "_no")}, "no"),
            m("br")
        ];
        makeLegend();
        parts = [m("fieldset", parts)];
    
    ///////////////////////////////////////////////////////////////////// SELECT /////////////////////////////////////////////////////////////////////

    } else if (displayType === "select") {
        makeLabel();
        var selectOptionsRaw = optionsForSelect(panelBuilder, model, fieldSpecification, value, true);
        var selectOptions = selectOptionsRaw.map(function (option, index) {
            var optionOptions = {value: option.value, selected: undefined};
            if (option.selected) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.name);
        });

        parts = [m("select", standardValueOptions, selectOptions), (fieldSpecification.displayWithoutQuestionDivs || isAnnotationQuestion) ? "" : m("br")];
        if (isAnnotationQuestion) parts.push(m("button.narrafirma-add-annotation-choice", {onclick: addAnnotationAnswer}, "Add New Answer"));
    
    ///////////////////////////////////////////////////////////////////// SLIDER /////////////////////////////////////////////////////////////////////

    } else if (displayType === "slider") {
        makeLabel();
        var checkboxID = getIdForText(fieldID) + "_doesNotApply";
        var sliderValueOptions = {
            value: value,
            id: getIdForText(fieldID),
            onchange: change,
            readOnly: readOnly,
            disabled: disabled,
            min: 0,
            max: 100,
            step: 1
        };
        
        var leftSideText = "";
        var rightSideText = "";
        var doesNotApplyText = "Does not apply";
        if (fieldSpecification.displayConfiguration) {
            if (fieldSpecification.displayConfiguration.length > 1) {
                leftSideText = fieldSpecification.displayConfiguration[0];
                rightSideText = fieldSpecification.displayConfiguration[1];
            }
            if (fieldSpecification.displayConfiguration.length > 2) {
                doesNotApplyText = fieldSpecification.displayConfiguration[2];
            }
        }
        
       // Could suggest 0-100 to support <IE10 that don't have range input -- or could do polyfill
        // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";
        parts = [
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
                    var isChecked = event.target.checked; 
                    if (isChecked) { 
                        valueProperty(""); 
                    } else {
                        valueProperty("50");
                    }
                }
            }),
            m("label", {"for": checkboxID}, doesNotApplyText)
        ];
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
    
    var classString = "questionExternal";
    if (isAnnotationQuestion) classString += "-annotation"; 
    classString += " narrafirma-question-type-" + displayType;
    
    if (fieldSpecification.displayClass) {
        classString += " " + fieldSpecification.displayClass;
    }
    if (useNormalDivs) {
        return m("div", {key: fieldID, "class": classString}, parts);
    } else {
        return parts;
    }
}
