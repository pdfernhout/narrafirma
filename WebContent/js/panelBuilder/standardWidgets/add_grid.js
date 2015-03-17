define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "./GridWithItemPanel",
    "dojo/_base/lang",
    "dstore/Memory",
    "dstore/Trackable",
    "../translate"
], function(
    at,
    ContentPane,
    GridWithItemPanel,
    lang,
    Memory,
    Trackable,
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
        
        var instance = {};
        
        var watcher = model.watch(fieldSpecification.id, function() {
            console.log("updating grid for model field change", model, fieldSpecification);
            // Update data store
            // TODO: Will not close any detail panels dependent on old data
            var newData = model.get(fieldSpecification.id);
            dataStore.setData(newData);
            var newStore = Trackable.create(dataStore);
            instance.grid.set("collection", newStore);
        });
        
        // Klugde to get the contentPane to free the watcher by calling remove when it is destroyed
        // This would not work if the content pane continued to exist when replacing this component
        contentPane.own(watcher);
        
        var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};
        var grid = new GridWithItemPanel(panelBuilder, questionContentPane, fieldSpecification.id, dataStore, itemPanelSpecification, configuration);
        instance.grid = grid.grid;
        return grid;
    }

    return add_grid;
});