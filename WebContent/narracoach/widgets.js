"use strict";

define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    "dijit/registry",
    "narracoach/translate",
    "dojox/charting/plot2d/Bars",
    "dijit/form/Button",
    "dijit/form/CheckBox",
    "dijit/layout/ContentPane",
    "dijit/form/RadioButton",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dijit/form/HorizontalSlider",
    "dijit/form/Select",
    "dijit/form/SimpleTextarea",
    "dijit/form/TextBox",
    "dijit/_WidgetBase",
], function(
    array,
    declare,
    dom,
    domConstruct,
    domStyle,
    on,
    registry,
    translate,
    Bars,
    Button,
    CheckBox,
    ContentPane,
    RadioButton,
    HorizontalRule,
    HorizontalRuleLabels,
    HorizontalSlider,
    Select,
    SimpleTextarea,
    TextBox,
    _WidgetBase
){
    
    function isString(something) {
        return (typeof something == 'string' || something instanceof String);
    }
        
    function newButton(id, label, addToDiv, callback) {
        var button = new Button({
            id: id,
            label: label,
            type: "button",
            onClick: callback
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            button.placeAt(addToDiv);
        }
        // TODO: Is startup call really needed here?
        button.startup();
        return button;
    }
    
    function newLabel(id, text, addToDiv) {
        var label = new ContentPane({
            id: id,
            content: text, 
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            label.placeAt(addToDiv);
        }
        // TODO: Is startup call really needed here?
        label.startup();
        return label;
    }
    
    function newTextBox(id, addToDiv) {
        var textBox = new TextBox({
            id: id,
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            textBox.placeAt(addToDiv);
        }
        // TODO: Is startup call really needed here?
        textBox.startup();
        return textBox;
    }
    
    function newSimpleTextArea(id, addToDiv) {
        var textarea = new SimpleTextarea({
            id: id,
            rows: "4",
            cols: "50",
            style: "width:auto;"
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            textarea.placeAt(addToDiv);
        }
        textarea.startup();
        return textarea;
    }
    
    function newSelect(id, choices, optionsString, addToDiv, noSelectedOption) {
        var options = [];
        // TODO: Translate label for no selection
        if (!noSelectedOption) options.push({label: " -- select -- ", value: "", selected: true});
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("choice", id, each);
                if (isString(each)) {
                    var label = translate(id + "_choice_" + each);
                    options.push({label: label, value: each});
                } else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    options.push({label: each.label, value: each.value});
                }
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                // console.log("option", id, each);
                options.push({label: each, value: each});
            });
        } else {
            console.log("No choices or options defined for select", id);
        }
        var select = new Select({
                id: id,
                options: options
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            select.placeAt(addToDiv);
        }
        select.startup();
        return select;
    }

    function buildOptions(id, choices, optionsString){
        var options = [];
        
        if (choices) {
            array.forEach(choices, function(each) {
                var label = translate(id + "_choice_" + each);
                options.push({label: label, value: each});
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                var translateID = id + "_choice_" + each;
                if (optionsString === "yes\nno") translateID = "boolean_choice_" + each;
                var label = translate(translateID, each);
                options.push({label: label, value: each});
            });
        }
        
        return options;
    }
    
    /* global RadioButtonsWidget */
    
    declare("RadioButtonsWidget", [_WidgetBase], {
        value: null,
        choices: null,
        optionsString: null,
    
        buildRendering: function() {
            // create the DOM for this widget
            // declare id var as "this" will not be defined inside array loop functions
            var id = this.id;
            var self = this;
            var div = domConstruct.create("div");
            var options = buildOptions(id, this.choices, this.optionsString);
    
            array.forEach(options, function (option) {
                var choiceID = id + "_choice_" + option.value;
                var radioButton = new RadioButton({
                    checked: false,
                    value: option.value,
                    name: id,
                    "id": choiceID,
                });
                radioButton.placeAt(div);
                on(radioButton, "click", function(evt) {
                    // console.log("radio clicked", evt.target);
                    self.set("value", evt.target.value);
                });
                radioButton.startup();
                div.appendChild(domConstruct.toDom('<label for="' + choiceID + '">' + option.label + '</label><br>'));
            });
            
            this.domNode = div;
        },

        _setValueAttr: function(value) {
            // TODO: Need to select radio button when this is called, but not if call it from inside widget on change
            this.value = value;
        },
    });

    function newRadioButtons(id, choices, optionsString, addToDiv) {
        var radioButtons = new RadioButtonsWidget({
            id: id,
            choices: choices,
            optionsString: optionsString
        });
         
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(radioButtons.domNode);
        }
        radioButtons.startup();
        return radioButtons;
    }
    
    /* global CheckBoxesWidget */
    
    // TODO: Very similar to RadioButtonsWidget
    // TODO: Set an optional minimum and maximum number that may be checked and validate for that
    declare("CheckBoxesWidget", [_WidgetBase], {
        value: {},
        choices: null,
        optionsString: null,
    
        buildRendering: function() {
            // create the DOM for this widget
            // declare id var as "this" will not be defined inside array loop functions
            var id = this.id;
            var self = this;
            var div = domConstruct.create("div");
            var options = buildOptions(id, this.choices, this.optionsString);
    
            array.forEach(options, function (option) {
                var choiceID = id + "_choice_" + option.value;
                var checkBox = new CheckBox({
                    value: option.value,
                    "id": choiceID,
                });
                checkBox.placeAt(div);
                self.value[option.value] = false;
                on(checkBox, "click", function(evt) {
                    var localChoiceID = evt.target.defaultValue;
                    var checked = evt.target.checked;
                    self.value[localChoiceID] = checked;
                    // console.log("clicked checkbox", evt, localChoiceID, checked, self.value);
                    // TODO: send changed message?
                });
                checkBox.startup();
                div.appendChild(domConstruct.toDom('<label for="' + choiceID + '">' + option.label + '</label><br>'));
            });
            
            this.domNode = div;
        },
        
        _setValueAttr: function(value) {
            // TODO: Need to select checkboxes when this is called, but not if call it from inside widget on change
            this.value = value;
        },
    });

    function newCheckBoxes(id, choices, optionsString, addToDiv) {
        var checkBoxes = new CheckBoxesWidget({
            id: id,
            choices: choices,
            optionsString: optionsString
        });
         
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(checkBoxes.domNode);
        }
        checkBoxes.startup();
        return checkBoxes;
    }
    
    function newSlider(id, options, addToDiv) {                     
        // A div that contains rules, labels, and slider
        var panelDiv = domConstruct.create("div");
        
        // TODO: Maybe these rules and labels need to go into a containing div?
        // TODO: But then what to return for this function if want to return actual slider to get value?
        
        var hasTextLabels = false;
        var labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        if (options) {
            labels = options.split("\n");
            if (labels.length != 2) {
                console.log("Need to specify low and high labels for quesiton: ", id);
            } else {
                hasTextLabels = true;
                var labelLow = labels[0].trim();
                var labelHigh = labels[1].trim();
                labels = [labelLow, labelHigh];
            }
        }
        
        console.log("labels", labels, labels.length);
        
        var slider = new HorizontalSlider({
            id: id,
            minimum: 0,
            maximum: 100,
            discreteValues: 101,
            showButtons: true,
            // Doesn;t work: style: "align: center; width: 80%;"
            style: "width: 80%;"

        });
        
        slider.placeAt(panelDiv);
         
        //if (!hasTextLabels) {}
        // Create the rules
        var rulesNode = domConstruct.create("div", {}, slider.containerNode);
        var sliderRules = new HorizontalRule({
            container: "bottomDecoration",
            count: labels.length,
            style: "height: 5px"
        }, rulesNode);
        //}

        // Create the labels
        var labelsNode = domConstruct.create("div", {}, slider.containerNode);
        var sliderLabels = new HorizontalRuleLabels({
            container: "bottomDecoration",
            style: "height: 1.5em; font-weight: bold",
            minimum: 0,
            maximum: 100,
            count: labels.length,
            numericMargin: 1,
            labels: labels,
        }, labelsNode);

        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(panelDiv);
        }
        
        slider.startup();
        // if (!hasTextLabels)
        sliderRules.startup();
        sliderLabels.startup();
        
        // TODO: Issue -- should return a new sort of component that can be placed an includes the slider and the rules and labels
        var contentPane = new ContentPane({
            id: id + "_content",
            content: panelDiv, 
        });
        return contentPane;
    }
    
    function newBoolean(id, addToDiv) {
        var radioButtons = new RadioButtonsWidget({
            id: id,
            choices: null,
            optionsString: "yes\nno",
        });
         
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(radioButtons.domNode);
        }
        radioButtons.startup();
        return radioButtons;
    }

    function newCheckbox(id, addToDiv) {
        var checkbox = new CheckBox({
            id: id
        });
        
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(checkbox);
        }
        
        return checkbox;
    }
    
    
    return {
        // "isString": isString,
        "newButton": newButton,
        "newLabel": newLabel,
        "newTextBox": newTextBox,
        "newSimpleTextArea": newSimpleTextArea,
        "newSelect": newSelect,
        "newRadioButtons": newRadioButtons,
        "newCheckBoxes": newCheckBoxes,
        "newSlider": newSlider,
        "newBoolean": newBoolean,
        "newCheckbox": newCheckbox,
    };

});