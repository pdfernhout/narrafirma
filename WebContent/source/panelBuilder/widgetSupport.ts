import Button = require("dijit/form/Button");
import domConstruct = require("dojo/dom-construct");
import FilteringSelect = require("dijit/form/FilteringSelect");
import Memory = require("dojo/store/Memory");
import MultiSelect = require("dijit/form/MultiSelect");
import query = require("dojo/query");
import translate = require("./translate");
import win = require("dojo/_base/window");

"use strict";

export function setOptionsInMultiSelect(widget, options) {
    // console.log("setOptionsInMultiSelect", widget, options);
    query('option', widget.domNode).forEach(function(node, index, arr) {
        domConstruct.destroy(node);
    }); 
    
    for (var i = 0; i < options.length; i++) {
        var c = win.doc.createElement('option');
        c.innerHTML = options[i].label;
        c.value = options[i].value;
        widget.domNode.appendChild(c);
    }
}

export function newMultiSelect(options, value) {
    var widget = new MultiSelect({
        "size": 6,
        "style": "width: 100%;",
        value: value
    });
    
    setOptionsInMultiSelect(widget, options);
    
    return widget;
}

export function buildOptions(id, choices, optionsString){
    var options = [];
    
    if (choices) {
        choices.forEach(function(each) {
            // console.log("each1", each);
            var label = translate(id + "::selection:" + each, each);
            options.push({label: label, value: each});
        });           
    } else if (optionsString) {
        optionsString.split("\n").forEach(function(each) {
            // console.log("each2", each);
            var translateID = id + "::selection:" + each;
            if (optionsString === "yes\nno") translateID = "boolean_choice_" + each;
            var label = translate(translateID, each);
            options.push({label: label, value: each});
        });
    }
    
    return options;
}

// TODO: Two GUI components without translation here temporarily
export function newButton(parentContentPane, label, callback) {
    var translatedLabel = translate(label);
    
    // TODO: Maybe should not be passing in an ID??? Just let Dojo assign one
    var button = new Button({
        label: translatedLabel,
        type: "button",
        onClick: callback
    });
    if (parentContentPane) {
        button.placeAt(parentContentPane);
    }
    return button;
}

// TODO: Maybe overly general because it supports passing in array of strings? Otherwise could remove this except for adding extra field
function makeOptionsFromSelectFromChoices(choices, addNoSelectionOption) {
    var options = [];
    
    // TODO: Is it OK to pass an item with a blank ID to a data store?
    if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made", "-- selection has not been made --"), id: "", selected: true});
    
    if (choices) {
        choices.forEach(function(each) {
            // console.log("choice", id, each);
            if (_.isString(each)) {
                // TODO: Add translation support here somehow
                var label = each; // translate(id + "_choice_" + each, each);
                options.push({name: label, id: each});
            } else {
                // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                options.push({name: each.label, id: each.value});
            }
        });
    } else {
        console.log("ERROR: No choices or options defined for select");
    }
    
    function compareNames(a, b) {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    }
    
    options.sort(compareNames);
    
    return options;
}

export function updateSelectChoices(select, choices, addNoSelectionOption) {
    var options = makeOptionsFromSelectFromChoices(choices, addNoSelectionOption);
    
    var dataStore = select.get("store");
    dataStore.setData(options);
}

export function newSelect(parentContentPane, choices, addNoSelectionOption) {
    var options = makeOptionsFromSelectFromChoices(choices, addNoSelectionOption);
    
    var dataStore = new Memory({"data": options});
    
    var select = new FilteringSelect({
            store: dataStore,
            searchAttr: "name",
            // TODO: Work on validation...
            required: false
            // style: "width: 100%"
    });
    select.placeAt(parentContentPane);
    return select;
}