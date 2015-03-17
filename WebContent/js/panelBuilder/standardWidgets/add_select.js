define([
    "dojo/_base/array",
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dijit/form/FilteringSelect",
    "dojo/_base/lang",
    "dojo/store/Memory",
    "../translate"
], function(
    array,
    at,
    ContentPane,
    FilteringSelect,
    lang,
    Memory,
    translate
){
    "use strict";
    
    function add_select(panelBuilder, contentPane, model, fieldSpecification, addNoSelectionOption) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var options = [];
        if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made|(no selection)"), id: "", selected: true});
        var choices = fieldSpecification.dataOptions;
        if (choices) {
            array.forEach(choices, function(each) {
                var label;
                // console.log("choice", id, each);
                if (lang.isString(each)) {
                    label = translate(fieldSpecification.id + "::selection:" + each, each);
                    options.push({name: label, id: each});
                } else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    label = translate(fieldSpecification.id + "::selection:" + each.label, each.label);
                    options.push({name: label, id: each.value});
                }
            });           
        } else {
            console.log("No choices or options defined for select", fieldSpecification.id);
        }
        
        var dataStore = new Memory({"data": options});
        
        var select = new FilteringSelect({
                store: dataStore,
                searchAttr: "name",
                // TODO: Work on validation...
                required: false,
                // style: "width: 100%"
                value: at(model, fieldSpecification.id)
        });
        
        select.placeAt(questionContentPane);
        return select;
    }

    return add_select;
});