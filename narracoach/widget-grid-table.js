"use strict";

define([
    "narracoach/add_page",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dijit/registry",
    "narracoach/translate",
    "narracoach/widgets",
    "dgrid/extensions/ColumnResizer",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dgrid/extensions/DijitRegistry",
    "dijit/form/Form",
    "dgrid/Keyboard",
    "dojo/store/Memory",
    "dgrid/Selection",
    "dgrid/OnDemandGrid"
], function(
    addPage,
    array,
    declare,
    domConstruct,
    lang,
    registry,
    translate,
    widgets,
    ColumnResizer,
    ContentPane,
    Dialog,
    DijitRegistry,
    Form,
    Keyboard,
    Memory,
    Selection,
    OnDemandGrid
){
    var storyList = [
 	    { title: "The night the bed fell", body: "Story 1..." },
 	    { title: "The golden faucets", body: "Story 2..."},
 	    { title: "More pickles!", body: "Story 3...",}
 	];

    var testCount = 0;
    
    function addButtonClicked(grid, store, popupPageDefinition, event) {
    	console.log("add button pressed");
        var addDialog;
        
        var form = new Form();
        
        addPage.addPageContents(form.domNode, popupPageDefinition);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("list_dialog_ok", "OK", form, function() {
            console.log("OK");
            addDialog.hide();
            // addDialogOK(question, questionEditorDiv, form);

            // TODO: Fix this
            var count = ++testCount;
            var newItem = {};
            
            array.forEach(popupPageDefinition.questions, function (question) {
            	// TODO: This may not work for more complex question types or custom widgets?
            	var widget = registry.byId(question.id);
            	if (widget) {
            		newItem[question.id] = widget.get("value");
            	} else {
            		console.log("ERROR: could not find widget for:", question.id);
            	}
            });
            
            store.put(newItem);
            grid.refresh();
            grid.resize();
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        widgets.newButton("list_dialog_cancel", "Cancel", form, function() {
            console.log("Cancel");
            addDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        addDialog = new Dialog({
        	// TODO: Translate text
        	// TODO: Make text specific to type of item
            title: "Add Item",
            content: form,
            style: "width: 600px; height 800px; overflow: auto;",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        addDialog.startup();
        addDialog.show();
    }
    
    function insertGridTableBasic(id, pagePane, popupPageDefinition, dataStore, includeAddButton) {
    	// Grid with list of objects
    	// console.log("insertGridTableBasic");
    	
    	if (!dataStore) {
        	// TODO: Need to set better info for fields and meanings to display and index on
            
        	var list = [];
        	
            dataStore = new Memory({
                // data: storyList,
            	data: list,
                // TODO: title may not be unique
                idProperty: "uniqueID",
            });    		
    	}

        var listContentPane = new ContentPane({
            // title: pseudoQuestion.text
        });
        
        var pane = listContentPane.containerNode;
        
        var columns = {};
        
        array.forEach(popupPageDefinition.questions, function (question) {
        	// TODO: Translate these texts
        	if (question.shortText) {
        		columns[question.id] = question.shortText;
        	}
        });
        
        // console.log("making grid");
        // TODO: Fix columns
        // var grid = new OnDemandGrid({
        var grid = new(declare([OnDemandGrid, DijitRegistry, Keyboard, Selection, ColumnResizer]))({
        	"store": dataStore,
            "columns": columns
        });
        
        pagePane.addChild(grid);
        grid.startup();
        
        // console.log("grid startup with", storyList, projectStoriesStore);
        
        // Bind first two arguments to function that will be callback recieving one extra arg
        // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
        // TODO: Translate text of label
        if (includeAddButton) {
        	var addButton = widgets.newButton(id + "add", "Add", pane, lang.partial(addButtonClicked, grid, dataStore, popupPageDefinition));
        }
        
        pagePane.addChild(listContentPane);
        listContentPane.startup();
        
        return {
        	"store": dataStore,
        	"listContentPane": listContentPane
        };
	}
    
    function insertGridTable(pseudoQuestion, pagePane, pageDefinitions) {
    	// Grid with list of objects
    	// console.log("insertGridTable");
    	
        var popupPageDefinition = pageDefinitions[pseudoQuestion.options];
        
        // TODO: Need to translate
    	var label = widgets.newLabel(pseudoQuestion.id + "label", pseudoQuestion.text, pagePane.domNode);
        
        return insertGridTableBasic(pseudoQuestion.id, pagePane, popupPageDefinition, null, true);
	}

	return {
		"insertGridTable": insertGridTable,
		"insertGridTableBasic": insertGridTableBasic
	}
    
});