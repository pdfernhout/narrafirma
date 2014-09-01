"use strict";

define([
    "narracoach/add_page",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "narracoach/translate",
    "narracoach/widgets",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form",
    "dojo/store/Memory",
    "dgrid/OnDemandGrid"
], function(
    addPage,
    domConstruct,
    lang,
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
            var newStory = { title: "More pickles " + count + "!", body: "Story " + count + "...",};
            store.put(newStory);
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
    	
    	// TODO: Need to set better info for fields and meanings to display and index on
        
        var store = new Memory({
            data: storyList,
            // TODO: title may not be unique
            idProperty: "title",
        });

        var listContentPane = new ContentPane({
            title: pseudoQuestion.text
        });
        
        var pane = listContentPane.containerNode;
        
        console.log("making grid");
        // TODO: Fix columns
        var grid = new OnDemandGrid({
        	store: store,
            columns: {
                title: "title",
            }
        });
        
        pagePane.addChild(grid);
        grid.startup();
        
        // console.log("grid startup with", storyList, projectStoriesStore);
        var popupPageDefinition = pageDefinitions[pseudoQuestion.options];
        
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