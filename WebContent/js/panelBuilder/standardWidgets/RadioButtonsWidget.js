define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/on",
    "../widgetSupport",
    "dijit/form/RadioButton",
    "dijit/_WidgetBase"
], function(
    array,
    declare,
    domConstruct,
    on,
    widgetSupport,
    RadioButton,
    _WidgetBase
){
    "use strict";

    var RadioButtonsWidget = declare([_WidgetBase], {
        value: null,
        choices: null,
        optionsString: null,
        questionID: null,
        
        constructor: function(args) {
            // console.log("Constructor", this, args);
            declare.safeMixin(this, args);
            // These need to be created here so that the instances do not share one copy if made above
            this.radioButtons = {};
            this.options = widgetSupport.buildOptions(this.questionID, this.choices, this.optionsString);
        },
    
        buildRendering: function() {
            _WidgetBase.prototype.buildRendering.call(this); 
            
            // create the DOM for this widget
            // declare id var as "this" will not be defined inside array loop functions
            var id = this.id;
            var self = this;
            var div = domConstruct.create("div");
            
            var first = true;
            
            array.forEach(this.options, function (option) {
                if (!first) div.appendChild(domConstruct.toDom('<br>'));
                first = false;
                var choiceID = id + "_choice_" + option.value;
                var isChecked = (self.value === option.value);
                // console.log("radio init checked", choiceID, isChecked, option.value, self.value);
                var radioButton = new RadioButton({
                    checked: isChecked,
                    value: option.value,
                    name: id,
                    "id": choiceID
                });
                radioButton.placeAt(div);
                on(radioButton, "click", function(event) {
                    // console.log("radio clicked", event.target);
                    self._set("value", event.target.value);
                    // console.log("radio clicked", event.target.value);
                });
                self.radioButtons[option.value] = radioButton;
                div.appendChild(domConstruct.toDom('<label for="' + choiceID + '">' + option.label + '</label><br>'));
            });
            
            this.domNode = div;
        },

        _setValueAttr: function(value) {
            // TODO: (Maybe good enough?) Need to select radio button when this is called, but not if call it from inside widget on change
            // console.log("_setValueAttr radio", value);
            this.value = value;
            var self = this;
            // console.log("set radio", value);
            array.forEach(this.options, function (option) {
                // self.value[option.value] = false;
                // console.log("radio button value", self.value, option.value);
                var radioButton = self.radioButtons[option.value];
                radioButton.set("checked", self.value === option.value);
                // console.log("radio set", option.value, self.value === option.value);
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
