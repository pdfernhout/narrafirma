define([
    "dojo/_base/array",
    "dojox/mvc/at",
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    "dojo/dom-construct",
    "dijit/form/FilteringSelect",
    "dojo/_base/lang",
    "dojo/store/Memory",
    "dijit/form/MultiSelect",
    "dojo/query",
    "dojo/Stateful",
    "../translate",
    "dojo/_base/window"
], function(
    array,
    at,
    Button,
    ContentPane,
    domConstruct,
    FilteringSelect,
    lang,
    Memory,
    MultiSelect,
    query,
    Stateful,
    translate,
    win
){
    "use strict";
    
    function setOptionsInMultiSelect(widget, options) {
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
    
    function newMultiSelect(options, value) {
        var widget = new MultiSelect({
            "size": 12,
            "style": "width: 100%;",
            value: value
        });
        
        setOptionsInMultiSelect(widget, options);
        
        return widget;
    }
    
    function buildOptions(id, choices, optionsString){
        var options = [];
        
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("each1", each);
                var label = translate("#" + id + "::selection:" + each, each);
                options.push({label: label, value: each});
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                // console.log("each2", each);
                var translateID = id + "::selection:" + each;
                if (optionsString === "yes\nno") translateID = "boolean_choice_" + each;
                var label = translate("#" + translateID, each);
                options.push({label: label, value: each});
            });
        }
        
        return options;
    }
    
    // TODO: Two GUI components without translation here temporarily
    function newButton(addToDiv, label, callback) {
        var translatedLabel = translate(label);
        
        // TODO: Maybe should not be passingin an ID??? Just let Dojo assign one
        var button = new Button({
            label: translatedLabel,
            type: "button",
            onClick: callback
        });
        if (addToDiv) {
            button.placeAt(addToDiv);
        }
        return button;
    }
    
    function newSelect(addToDiv, choices, addNoSelectionOption) {
        var options = [];
        
        // TODO: Is it OK to pass an item with a blank ID to a data store?
        if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made", "-- selection has not been made --"), id: "", selected: true});
        
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("choice", id, each);
                if (lang.isString(each)) {
                    // TODO: Add translation support here somehow
                    var label = each; // translate("#" + id + "_choice_" + each, each);
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
        
        var dataStore = new Memory({"data": options});
        
        var select = new FilteringSelect({
                store: dataStore,
                searchAttr: "name",
                // TODO: Work on validation...
                required: false
                // style: "width: 100%"
        });
        select.placeAt(addToDiv);
        return select;
    }
    
    // Types of questions that have data associated with them for filters and graphs
    var filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

    // function updateFilterPaneForCurrentQuestions(questions) {
    function optionsForAllQuestions(questions) {
        var questionOptions = [];
        array.forEach(questions, function (question) {
            if (array.indexOf(filterableQuestionTypes, question.displayType) !== -1) {
                questionOptions.push({label: translate("#" + question.id + "::shortName", question.displayName), value: question.id});
            }
        });
        return questionOptions;
    }

    return {
        "buildOptions": buildOptions,
        "optionsForAllQuestions": optionsForAllQuestions,
        newButton: newButton,
        newSelect: newSelect,
        setOptionsInMultiSelect: setOptionsInMultiSelect,
        newMultiSelect: newMultiSelect
    };
   
});