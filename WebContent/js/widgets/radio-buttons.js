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
    var RadioButtonsWidget = declare([_WidgetBase], {
        value: null,
        choices: null,
        optionsString: null,
        
        constructor: function(args) {
            // console.log("Constructor", this, args);
            declare.safeMixin(this, args);
            // These need to be created here so that the instances do not share one copy if made above
            this.radioButtons = {};
            this.options = widgetSupport.buildOptions(this.id, this.choices, this.optionsString);
            var self = this;
        },
    
        buildRendering: function() {
            _WidgetBase.prototype.buildRendering.call(this); 
            
            // create the DOM for this widget
            // declare id var as "this" will not be defined inside array loop functions
            var id = this.id;
            var self = this;
            var div = domConstruct.create("div");
    
            array.forEach(this.options, function (option) {
                var choiceID = id + "_choice_" + option.value;
                var radioButton = new RadioButton({
                    checked: (self.value === option.value),
                    value: option.value,
                    name: id,
                    "id": choiceID
                });
                radioButton.placeAt(div);
                on(radioButton, "click", function(evt) {
                    // console.log("radio clicked", evt.target);
                    self.set("value", evt.target.value);
                });
                radioButton.startup();
                self.radioButtons[option.value] = radioButton;
                div.appendChild(domConstruct.toDom('<label for="' + choiceID + '">' + option.label + '</label><br>'));
            });
            
            this.domNode = div;
        },

        _setValueAttr: function(value) {
            // TODO: (Maybe good enough?) Need to select radio button when this is called, but not if call it from inside widget on change
            this.value = value;
            var self = this;
            // console.log("set radio", value);
            array.forEach(this.options, function (option) {
                // self.value[option.value] = false;
                // console.log("radio button value", self.value, option.value);
                var radioButton = self.radioButtons[option.value];
                radioButton.set("checked", self.value === option.value);
            });
        },
        
        _setDisabledAttr: function(/*Boolean*/ value){
            this.disabled = value;
            // console.log("RadioButtons", this.radioButtons);
            for (var itemID in this.radioButtons) {
                // console.log("Disabling", value, itemID);
                var item = this.radioButtons[itemID];
                item.attr("disabled", value);
            }
        }
    });
    
    return RadioButtonsWidget;
});
