"use strict";

define([
    "dojo/_base/array",
    "js/translate",
    "dijit/form/Button",
    "dijit/form/FilteringSelect",
    "dojo/store/Memory",
], function(array, translate, Button, FilteringSelect, Memory) {
    
    function startsWith(str, prefix) {
        // console.log("startsWith", prefix, str.lastIndexOf(prefix, 0) === 0, str);
        if (!str) {
            return false;
        }
      return str.lastIndexOf(prefix, 0) === 0;
    }
    
    function isString(something) {
        return (typeof something == 'string' || something instanceof String);
    }
    
    // TODO: Two GUI components without translation here temporarily
    function newButton(id, label_translate_id, addToDiv, callback) {
        if (label_translate_id === null) label_translate_id = id;
        var label = translate(label_translate_id);
        
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
        return button;
    }
    
    function newSelect(id, choices, optionsString, addToDiv, addNoSelectionOption) {
        var options = [];
        if (addNoSelectionOption) options.push({name: translate("selection_has_not_been_made"), id: "", selected: true});
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("choice", id, each);
                if (isString(each)) {
                    var label = each; // translate(id + "_choice_" + each);
                    options.push({name: label, id: each});
                } else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    options.push({name: each.label, id: each.value});
                }
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                // console.log("option", id, each);
                options.push({name: each, id: each});
            });
        } else {
            console.log("No choices or options defined for select", id);
        }
        
        var dataStore = new Memory({"data": options});
        
        var select = new FilteringSelect({
                id: id,
                store: dataStore,
                searchAttr: "name",
                // TODO: Work on validation...
                required: false
                // style: "width: 100%"
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            select.placeAt(addToDiv);
        }
        return select;
    }
    
    /*
    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }
    */
    
    return {
        "startsWith": startsWith,
        "isString": isString,
        "newButton": newButton,
        "newSelect": newSelect
    };
});