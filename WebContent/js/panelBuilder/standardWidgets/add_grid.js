define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "./GridWithItemPanel",
    "dojo/_base/lang",
    "dstore/Memory",
    "./translate"
], function(
    at,
    ContentPane,
    GridWithItemPanel,
    lang,
    Memory,
    translate
){
    "use strict";
    
    function add_grid(panelBuilder, contentPane, model, fieldSpecification) {
        // Grid with list of objects
        // console.log("add_grid");
        
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var itemPanelSpecification = panelBuilder.panelDefinitionForPanelID(fieldSpecification.displayConfiguration);
        
        if (!itemPanelSpecification) {
            console.log("Trouble: no itemPanelSpecification for options: ", fieldSpecification);
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
        return new GridWithItemPanel(panelBuilder, questionContentPane, fieldSpecification.id, dataStore, itemPanelSpecification, configuration);
    }

    return add_grid;
});