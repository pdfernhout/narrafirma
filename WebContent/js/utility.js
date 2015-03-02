define([
    "dojo/_base/array",
    "js/translate",
    "dijit/form/Button",
    "dijit/form/FilteringSelect",
    "dojo/store/Memory"
], function(
    array,
    translate,
    Button,
    FilteringSelect,
    Memory
) {
    "use strict";
    
    function startsWith(str, prefix) {
        // console.log("startsWith", prefix, str.lastIndexOf(prefix, 0) === 0, str);
        if (!str) {
            return false;
        }
      return str.lastIndexOf(prefix, 0) === 0;
    }
    
    function isString(something) {
        return (typeof something === 'string' || something instanceof String);
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
    
    // launchApplication function inspired by: http://stackoverflow.com/questions/528671/javascript-window-open-only-if-the-window-does-not-already-exist
    var openedWindows = {};
    function launchApplication(url, windowName) {
        var openedWindowInfo = openedWindows[windowName];
        if (openedWindowInfo && ! openedWindowInfo.window.closed) {
            if (openedWindowInfo.url !== url) {
                openedWindowInfo.window.location.replace(url);
            }
        }
        if (typeof openedWindowInfo === 'undefined' || openedWindowInfo.window.closed) {
            var width = Math.round(screen.availWidth / 2);
            var height = Math.round(screen.availHeight / 3);
            var windowOpenParams = 'status=1,resizable=1,scrollbars=1,left=200,top=200,width=' + width + ',height=' + height;
            var openedWindow = window.open(url, windowName, windowOpenParams);
            // Not sure if moveTo and resizeTo is really needed, since works without them in Firefox
            openedWindow.moveTo(200, 200);
            openedWindow.resizeTo(width, height);
            openedWindowInfo = {window: openedWindow, url: url};
            openedWindows[windowName] = openedWindowInfo;
        } else {
            openedWindowInfo.window.focus();
        }
    }
       
    return {
        "startsWith": startsWith,
        "isString": isString,
        "newButton": newButton,
        "newSelect": newSelect,
        "launchApplication": launchApplication
    };
});