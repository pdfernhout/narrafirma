"use strict";

// TODO: Remove unneeded imports
define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "js/translate",
    "./widgetSupport",
    "dojox/charting/plot2d/Bars",
    "dijit/form/Button",
    "dijit/form/CheckBox",
    "dijit/layout/ContentPane",
    "dijit/form/FilteringSelect",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dijit/form/HorizontalSlider",
    "dojo/store/Memory",
    "dijit/form/RadioButton",
    "dijit/form/Select",
    "dijit/form/SimpleTextarea",
    "dijit/form/TextBox",
    "dijit/form/ToggleButton",
    "dijit/_WidgetBase"
], function(
    array,
    declare,
    dom,
    domain,
    domConstruct,
    domStyle,
    lang,
    on,
    registry,
    translate,
    widgetSupport,
    Bars,
    Button,
    CheckBox,
    ContentPane,
    FilteringSelect,
    HorizontalRule,
    HorizontalRuleLabels,
    HorizontalSlider,
    Memory,
    RadioButton,
    Select,
    SimpleTextarea,
    TextBox,
    ToggleButton,
    _WidgetBase
){
    // TODO: Very similar to RadioButtonsWidget
    // TODO: Set an optional minimum and maximum number that may be checked and validate for that
    var CheckBoxesWidget = declare([_WidgetBase], {
        value: null,
        choices: null,
        optionsString: null,
        checkboxes: null,
        options: null,
        questionID: null,
        
        constructor: function(args) {
            // console.log("Constructor", this, args);
            declare.safeMixin(this, args);
            // These need to be created here so that the instances do not share one copy if made above
            this.checkboxes = {};
            this.options = widgetSupport.buildOptions(this.questionID, this.choices, this.optionsString);
            console.log("checkboxes", this.options);
            var self = this;
            if (!this.value) {
                this.value = {};
                array.forEach(this.options, function (option) {
                    self.value[option.value] = false;
                });
            }
        },
    
        buildRendering: function() {
            //this.inherited(arguments);
            _WidgetBase.prototype.buildRendering.call(this); 
            
            // create the DOM for this widget
            // declare id var as "this" will not be defined inside array loop functions
            var id = this.id;
            var self = this;
            var div = domConstruct.create("div");
            // var options = buildOptions(id, this.choices, this.optionsString);
            
            array.forEach(this.options, function (option) {
                var choiceID = id + "::selection:" + option.value;
                console.log("creating checkbox", choiceID);
                var checkBox = new CheckBox({
                    value: option.value,
                    "id": choiceID
                });
                checkBox.placeAt(div);
                checkBox.set("checked", self.value[option.value]);
                on(checkBox, "click", function(evt) {
                    var localChoiceID = evt.target.defaultValue;
                    var checked = evt.target.checked;
                    self.value[localChoiceID] = checked;
                    // console.log("clicked checkbox", evt, localChoiceID, checked, self.value);
                    // TODO: send changed message?
                });
                checkBox.startup();
                self.checkboxes[option.value] = checkBox;
                div.appendChild(domConstruct.toDom('<label for="' + choiceID + '">' + option.label + '</label><br>'));
            });
            
            this.domNode = div;
        },
        
        _setValueAttr: function(value) {
            // TODO: (Maybe good enough?) Need to select checkboxes when this is called, but not if call it from inside widget on change
            // console.log("setting value of checkboxes", value);
            this.value = value;
            var self = this;
            array.forEach(this.options, function (option) {
                // self.value[option.value] = false;
                self.checkboxes[option.value].set("checked", self.value[option.value]);
            });
        },
        
        _setDisabledAttr: function(/*Boolean*/ value){
            this.disabled = value;
            // console.log("CheckBoxes", this.checkboxes);
            for (var itemID in this.checkboxes) {
                // console.log("Disabling", value, itemID);
                var item = this.checkboxes[itemID];
                item.attr("disabled", value);
            }
        }
    });
    
    return CheckBoxesWidget;
});

