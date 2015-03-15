
define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/on",
    "./widgetSupport",
    "dijit/form/CheckBox",
    "dijit/_WidgetBase"
], function(
    array,
    declare,
    domConstruct,
    on,
    widgetSupport,
    CheckBox,
    _WidgetBase
){
    "use strict";

    // TODO: Very similar to RadioButtonsWidget, except it maintains a dictionary of whether checkboxes are checked rather than use an "at" accessor
    // TODO: Set an optional minimum and maximum number that may be checked and validate for that
    var CheckboxesWidget = declare([_WidgetBase], {
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
            // TODO: Simplify this so only one standard way of passing in a list of options with one arg, not two args
            this.options = widgetSupport.buildOptions(this.questionID, this.choices, this.optionsString);
            // console.log("checkboxes", this.options);
            var self = this;
            // console.log("checkboxes constructor value", this.value);
            if (!this.value) {
                console.log("ERROR - creating temporary value for checkboxes", this.id);
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
                // console.log("creating checkbox", choiceID);
                var checkBox = new CheckBox({
                    value: option.value,
                    "id": choiceID
                });
                checkBox.placeAt(div);
                var startupValue = self.value; // self.get("value");
                // console.log("checkboxes startupValue", startupValue);
                checkBox.set("checked", startupValue && startupValue[option.value]);
                on(checkBox, "click", function(evt) {
                    var localChoiceID = evt.target.defaultValue;
                    var checked = evt.target.checked;
                    // console.log("checkboxes value", self.value);
                    var currentValue = self.value; // self.get("value");
                    if (currentValue === null) currentValue = {};
                    currentValue[localChoiceID] = checked;
                    // self.set("value", currentValue);
                    // console.log("clicked checkbox", evt, localChoiceID, checked, self.value);
                    // TODO: send changed message?
                });
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
    
    return CheckboxesWidget;
});

