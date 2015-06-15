define(["require", "exports", "dijit/form/Button", "dojo/dom-construct", "dijit/form/FilteringSelect", "dojo/store/Memory", "dijit/form/MultiSelect", "dojo/query", "./translate", "dojo/_base/window"], function (require, exports, Button, domConstruct, FilteringSelect, Memory, MultiSelect, query, translate, win) {
    "use strict";
    function setOptionsInMultiSelect(widget, options) {
        // console.log("setOptionsInMultiSelect", widget, options);
        query('option', widget.domNode).forEach(function (node, index, arr) {
            domConstruct.destroy(node);
        });
        for (var i = 0; i < options.length; i++) {
            var c = win.doc.createElement('option');
            c.innerHTML = options[i].label;
            c.value = options[i].value;
            widget.domNode.appendChild(c);
        }
    }
    exports.setOptionsInMultiSelect = setOptionsInMultiSelect;
    function newMultiSelect(options, value) {
        if (value === void 0) { value = undefined; }
        var widget = new MultiSelect({
            "size": 6,
            "style": "width: 100%;",
            value: value
        });
        setOptionsInMultiSelect(widget, options);
        return widget;
    }
    exports.newMultiSelect = newMultiSelect;
    function buildOptions(id, choices, optionsString) {
        var options = [];
        if (choices) {
            choices.forEach(function (each) {
                // console.log("each1", each);
                var label = translate(id + "::selection:" + each, each);
                options.push({ label: label, value: each });
            });
        }
        else if (optionsString) {
            optionsString.split("\n").forEach(function (each) {
                // console.log("each2", each);
                var translateID = id + "::selection:" + each;
                if (optionsString === "yes\nno")
                    translateID = "boolean_choice_" + each;
                var label = translate(translateID, each);
                options.push({ label: label, value: each });
            });
        }
        return options;
    }
    exports.buildOptions = buildOptions;
    // TODO: Two GUI components without translation here temporarily
    function newButton(parentContentPane, label, callback) {
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
    exports.newButton = newButton;
    // TODO: Maybe overly general because it supports passing in array of strings? Otherwise could remove this except for adding extra field
    function makeOptionsFromSelectFromChoices(choices, addNoSelectionOption) {
        var options = [];
        // TODO: Is it OK to pass an item with a blank ID to a data store?
        if (addNoSelectionOption)
            options.push({ name: translate("#selection_has_not_been_made", "-- selection has not been made --"), id: "", selected: true });
        if (choices) {
            choices.forEach(function (each) {
                // console.log("choice", id, each);
                if (_.isString(each)) {
                    // TODO: Add translation support here somehow
                    var label = each; // translate(id + "_choice_" + each, each);
                    options.push({ name: label, id: each });
                }
                else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    options.push({ name: each.label, id: each.value });
                }
            });
        }
        else {
            console.log("ERROR: No choices or options defined for select");
        }
        function compareNames(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase();
            if (aName < bName)
                return -1;
            if (aName > bName)
                return 1;
            return 0;
        }
        options.sort(compareNames);
        return options;
    }
    function updateSelectChoices(select, choices, addNoSelectionOption) {
        if (addNoSelectionOption === void 0) { addNoSelectionOption = false; }
        var options = makeOptionsFromSelectFromChoices(choices, addNoSelectionOption);
        var dataStore = select.get("store");
        dataStore.setData(options);
    }
    exports.updateSelectChoices = updateSelectChoices;
    function newSelect(parentContentPane, choices, addNoSelectionOption) {
        if (addNoSelectionOption === void 0) { addNoSelectionOption = false; }
        var options = makeOptionsFromSelectFromChoices(choices, addNoSelectionOption);
        var dataStore = new Memory({ "data": options });
        var select = new FilteringSelect({
            store: dataStore,
            searchAttr: "name",
            // TODO: Work on validation...
            required: false
        });
        select.placeAt(parentContentPane);
        return select;
    }
    exports.newSelect = newSelect;
});
