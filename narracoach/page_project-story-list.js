"use strict";

define([
    "narracoach/add_page",
    "dojo/dom-construct",
    "narracoach/page_project-story-entry",
    "narracoach/translate",
    "narracoach/widgets",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form",
    "dojo/store/Memory",
    "dgrid/OnDemandGrid"
], function(
    add_page,
    domConstruct,
    page_projectStoryEntry,
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
    
    // TODO: How to access this store from other modules?
    var projectStoriesStore = new Memory({
        data: storyList,
        // TODO: title may not be unique
        idProperty: "title",
    });

    var storyListGrid;
    
    var testCount = 0;
    
    function addProjectStory() {
    	console.log("addProjectStory pressed");
        var addStoryDialog;
        
        var form = new Form();
        
        var page = page_projectStoryEntry;
        
        add_page.addPageContents(form.domNode, page);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("OK", form, function() {
            console.log("OK");
            addStoryDialog.hide();
            // addStoryDialogOK(question, questionEditorDiv, form);

            var count = ++testCount;
            var newStory = { title: "More pickles " + count + "!", body: "Story " + count + "...",};
            projectStoriesStore.put(newStory);
            storyListGrid.refresh();
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        widgets.newButton("Cancel", form, function() {
            console.log("Cancel");
            addStoryDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        addStoryDialog = new Dialog({
            title: "Add project story",
            content: form,
            style: "width: 600px; height 800px; overflow: auto;",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        addStoryDialog.startup();
        addStoryDialog.show();
    }
    
    function createPage(tabContainer) {
    	// Project story list pane

        var projectStoryListPane = new ContentPane({
            title: "Project story list"
        });
        
        var pane = projectStoryListPane.containerNode;
             
        var grid = new OnDemandGrid({
        	store: projectStoriesStore,
            columns: {
                title: "Story title",
                body: "Story text",
            }
        });
        
        // grid.renderArray(storyList);
        storyListGrid = grid;
        
        pane.appendChild(grid.domNode);
        grid.startup();
        
        // console.log("grid startup with", storyList, projectStoriesStore);
        
        var addStoryButton = widgets.newButton("Add story", pane, addProjectStory);
                
        tabContainer.addChild(projectStoryListPane);
        projectStoryListPane.startup();
	}

	return createPage;
    
});