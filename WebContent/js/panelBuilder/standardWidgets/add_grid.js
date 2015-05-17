define([
    "./GridWithItemPanel"
], function(
    GridWithItemPanel
){
    "use strict";
    
    /* Defaults for displayConfiguration:
     {
       itemPanelID: undefined,
       itemPanelSpecification: undefined,
       idProperty: "_id",
       gridConfiguration: {...}
     */
    function add_grid(panelBuilder, contentPane, model, fieldSpecification) {
        // Grid with list of objects
        // console.log("add_grid");
        
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var configuration = {};
        
        var itemPanelID = fieldSpecification.displayConfiguration;
        if (!_.isString(itemPanelID)) {
            configuration = fieldSpecification.displayConfiguration;
            itemPanelID = configuration.itemPanelID;
        }
        
        var itemPanelSpecification = configuration.itemPanelSpecification;
        if (!itemPanelSpecification) {
            itemPanelSpecification = panelBuilder.getPanelDefinitionForPanelID(itemPanelID);
        }
        
        if (!itemPanelSpecification) {
            console.log("Trouble: no itemPanelSpecification for options: ", fieldSpecification);
        }
        
        if (!model) {
            console.log("Error: no model is defined for grid", fieldSpecification);
            throw new Error("Error: no model is defined for grid");
        }
        if (!model.get) {
            console.log("Error: model that supports get is needed for grid", fieldSpecification);
            throw new Error("Error: model that supports get is needed for grid");
        }
        
        // TODO: May want to use at or similar to get the value in case this is a plain object?
        var data = model.get(fieldSpecification.id);
        if (!data) {
            data = [];
            model.set(fieldSpecification.id, data);
        }
        
        var idProperty = configuration.idProperty;
        if (!idProperty) idProperty = "_id";
        
        // Store will modify underlying array
        var dataStore = GridWithItemPanel.newMemoryTrackableStore(data, idProperty);
        
        var instance = {};
        
        var watcher = model.watch(fieldSpecification.id, function(name, oldValue, newValue) {
            // console.log("updating grid for model field change", model, fieldSpecification);
            
            if (oldValue === newValue) {
                // Ignore the value changed coming from the grid itself when it changes data
                // TODO: Could also do JSON comparison -- think about better way to handle this in general (same for clustering diagram)
                // console.log("+++++++++++++++++++++ Ignoring change most likely coming from grid itself");
                return;
            }
            
            // Update data store
            // TODO: Will not close any detail panels dependent on old data
            var newData = model.get(fieldSpecification.id);
            dataStore.setData(newData);
            // Apparently, trackable stored don't send a general update message when you change their data, so explicitely set grid store here to force update
            instance.grid.dataStoreChanged(dataStore);
        });
        
        // Klugde to get the contentPane to free the watcher by calling remove when it is destroyed
        // This would not work if the content pane continued to exist when replacing this component
        contentPane.own(watcher);
        
        var gridConfiguration = configuration.gridConfiguration;
        if (!gridConfiguration) gridConfiguration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: false, includeAllFields: false};
        
        var grid = new GridWithItemPanel(panelBuilder, questionContentPane, fieldSpecification.id, dataStore, itemPanelSpecification, gridConfiguration, model);
        instance.grid = grid;
        return grid;
    }

    return add_grid;
});