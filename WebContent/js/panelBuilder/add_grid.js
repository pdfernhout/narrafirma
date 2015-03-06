define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "./gridTable",
    "dojo/_base/lang",
    "dstore/Memory",
    "js/translate"
], function(
    at,
    ContentPane,
    gridTable,
    lang,
    Memory,
    translate
){
    "use strict";
    
    function add_grid(panelBuilder, contentPane, model, fieldSpecification) {
        // Grid with list of objects
        // console.log("add_grid");
        
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var popupPageDefinition = panelBuilder.panelDefinitionForPanelID(fieldSpecification.displayConfiguration);
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition for options: ", fieldSpecification);
        }
        
        var data = model.get(fieldSpecification.id);
        if (!data) {
            data = [];
            model.set(fieldSpecification.id, data);
        }
        
        // Store will modify underlying array
        var dataStore = new Memory({
            data: data,
            idProperty: "_id"
        });
        
        var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};
        return gridTable.insertGridTableBasic(panelBuilder, questionContentPane, fieldSpecification.id, dataStore, popupPageDefinition, configuration);
    }

    return add_grid;
});