"use strict";

define([
    "narracoach/add_page",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dijit/registry",
    "narracoach/translate",
    "narracoach/widgets",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form",
    "dojo/store/Memory",
    "dgrid/OnDemandGrid"
], function(
    addPage,
    array,
    domConstruct,
    lang,
    registry,
    translate,
    widgets,
    ContentPane,
    Dialog,
    Form,
    Memory,
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
            	newItem[question.id] = registry.byId(question.id).get("value");
            });
            
            store.put(newItem);
            grid.refresh();
            
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
            title: "Add project story",
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
    
    function insertGrid(pseudoQuestion, pagePane, pageDefinitions) {
    	// Grid with list of objects
    	console.log("insertGrid");
    	
        var popupPageDefinition = pageDefinitions[pseudoQuestion.options];
        
    	var label = widgets.newLabel(pseudoQuestion.id + "label", pseudoQuestion.text, pagePane.domNode);
    	
    	// TODO: Need to set better info for fields and meanings to display and index on
        
    	var list = [];
    	
        var store = new Memory({
            // data: storyList,
        	data: list,
            // TODO: title may not be unique
            idProperty: "uniqueID",
        });

        var listContentPane = new ContentPane({
            // title: pseudoQuestion.text
        });
        
        var pane = listContentPane.containerNode;
        
        var columns = {};
        
        array.forEach(popupPageDefinition.questions, function (question) {
        	columns[question.id] = question.text;
        });
        
        console.log("making grid");
        // TODO: Fix columns
        var grid = new OnDemandGrid({
        	"store": store,
            "columns": columns
        });
        
        pagePane.addChild(grid);
        grid.startup();
        
        // console.log("grid startup with", storyList, projectStoriesStore);
        
        // Bind first two arguments to function that will be callback recieving one extra arg
        // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
        // TODO: Translate text of label
        var addButton = widgets.newButton(pseudoQuestion.id + "add", "Add", pane, lang.partial(addButtonClicked, grid, store, popupPageDefinition));
        
        pagePane.addChild(listContentPane);
        listContentPane.startup();
        
        return {
        	"store": store,
        	"listContentPane": listContentPane
        };
	}

	return {
		"insertGrid": insertGrid
	}
    
});