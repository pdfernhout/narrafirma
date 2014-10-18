"use strict";

define([
    "js/add_page",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dijit/registry",
    "js/translate",
    "js/widgets",
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
         { title: "More pickles!", body: "Story 3..."}
     ];

    // TODO: Maybe rethink how unique item IDs work? Setting to start at 1000 becaues of test data created in story browser
    var uniqueItemIDCounter = 1000;
    
    function addButtonClicked(grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("add button pressed");
        var dialog;
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid blue; display: block");
        
        addPage.addPageContents(form, popupPageDefinition);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("list_dialog_ok_" + grid.id, "OK", form, function() {
            console.log("OK");
            // itemContentPane.hide();
            // dialogOK(question, questionEditorDiv, form);

            var uniqueItemID = ++uniqueItemIDCounter;
            var newItem = {id: uniqueItemID};
            
            array.forEach(popupPageDefinition.questions, function (question) {
                // TODO: This may not work for more complex question types or custom widgets?
                console.log("question type", question, question.type);
                if (question.type !== "label" && question.type !== "header") {
                    var widget = registry.byId(question.id);
                    if (widget) {
                        newItem[question.id] = widget.get("value");
                    } else {
                        console.log("ERROR: could not find widget for:", question.id);
                    }
                }
            });
            
            console.log("got data for add form", store, newItem);
            
            store.put(newItem);
            
            console.log("put store for add form");
            
            itemContentPane.set("style", "display: none");
            
            // TODO: Works, but seems wrong; resize ensures the header is there; refresh ensures the data is there; bad side-effect of losing scroll position in grid
            grid.resize();
            grid.refresh();
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
            console.log("shut down add form");
            
        });
        
        widgets.newButton("list_dialog_cancel_" + grid.id, "Cancel", form, function() {
            console.log("Cancel");
            
            // itemContentPane.hide();
            itemContentPane.set("style", "display: none");
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        /*
        dialog = new Dialog({
            // TODO: Translate text
            // TODO: Make text specific to type of item
            title: "Add Item",
            content: form,
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        */
        
        itemContentPane.addChild(form);
        
        form.startup();
        //dialog.startup();
        //dialog.show();
        //itemContentPane.show();
    }
    
    // TODO: Button should only be enabled if a selection
    function viewButtonClicked(grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("view button pressed");
        var dialog;
        
        var form = new Form(); 
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid blue; display: block");
        
        addPage.addPageContents(form, popupPageDefinition);

        console.log("grid", grid, grid.selection);
        // var item = grid
        
        // TODO: Should only do for one of these... Need to break...
        // TODO: Need to search on unique field...
        var selection;
        for (var theSelection in grid.selection) {
            selection = theSelection;
        }
        if (theSelection) {
            console.log("selection", selection);
            var matches = store.query({id: selection});
            console.log("matches", matches);
            // Should only be one match
            array.forEach(matches, function (item) {
                console.log("item", item);
                array.forEach(popupPageDefinition.questions, function (question) {
                    // TODO: This may not work for more complex question types or custom widgets?
                    var widget = registry.byId(question.id);
                    if (widget) {
                        widget.set("value", item[question.id]);
                        widget.set("disabled", true);
                    } else {
                        console.log("ERROR: could not find widget for:", question.id);
                    }
                }); 
            });
        }

        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("list_dialog_ok", "Done", form, function() {
            console.log("Done");
            
            // dialog.hide();
            itemContentPane.set("style", "display: none");
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        /*
        dialog = new Dialog({
            // TODO: Translate text
            // TODO: Make text specific to type of item
            title: "View Item",
            content: form,
            style: "overflow: auto;",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        */
        
        itemContentPane.addChild(form);
        
        form.startup();
        //dialog.startup();
        //dialog.show();
    }
    
    function insertGridTableBasic(id, pagePane, popupPageDefinition, dataStore, includeAddButton) {
        // Grid with list of objects
        console.log("insertGridTableBasic", id, dataStore);
        
        // Check if using dojo at to wrap a domain value
        if (!dataStore || dataStore instanceof Array) {
            // TODO: Need to set better info for fields and meanings to display and index on
            
            var list = [];
           
            if (dataStore instanceof Array) {
                list = dataStore;
                console.log("datastore list", dataStore, list);
            }
            
                
            dataStore = new Memory({
                // data: storyList,
                data: list
                // TODO: title may not be unique
                // idProperty: "uniqueID",
            });            
        }
        
        var columns = {};
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition", id, pagePane);
        }
        
        array.forEach(popupPageDefinition.questions, function (question) {
            // TODO: Translate these texts
            if (question.shortText) {
                columns[question.id] = question.shortText;
            }
        });
        
        // console.log("making grid");
        var grid = new(declare([OnDemandGrid, DijitRegistry, Keyboard, Selection, ColumnResizer]))({
            "id": id,
            "store": dataStore,
            "columns": columns
        });
        
        if (!pagePane.addChild) {
            // console.log("trouble -- does not have addChild method!", pagePane);
            pagePane.domNode.appendChild(grid.domNode);
        } else {
            pagePane.addChild(grid);
        }
        
        grid.startup();
        
        var listContentPane = new ContentPane({
            // title: pseudoQuestion.text
        });
        
        if (!pagePane.addChild) {
            // console.log("trouble -- does not have addChild method!", pagePane);
            pagePane.domNode.appendChild(listContentPane.domNode);
        } else {
            pagePane.addChild(listContentPane);
        }
        
        listContentPane.startup();
        
        var pane = listContentPane.containerNode;
        
        var itemContentPane = new ContentPane({
        });
        
        // console.log("grid startup with", storyList, projectStoriesStore);
        
        // Bind first two arguments to function that will be callback recieving one extra arg
        // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
        // TODO: Translate text of label
        var viewButtonID = id + "view";
        var viewButton = widgets.newButton(viewButtonID, "View", pane, lang.partial(viewButtonClicked, grid, dataStore, popupPageDefinition, itemContentPane));

        var selected = 0;
        viewButton.set("disabled", true);
        
        grid.on("dgrid-select", function(e){
            selected += e.rows.length;
            viewButton.set("disabled", !selected);
        });
        
        grid.on("dgrid-deselect", function(e){
            selected -= e.rows.length;
            viewButton.set("disabled", !selected);
        });
        
        if (includeAddButton) {
            var addButton = widgets.newButton(id + "add", "Add", pane, lang.partial(addButtonClicked, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        if (!pagePane.addChild) {
            // console.log("trouble -- does not have addChild method!", pagePane);
            pagePane.domNode.appendChild(itemContentPane.domNode);
        } else {
            pagePane.addChild(itemContentPane);
        } 
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.5em solid red; display: none");
        
        itemContentPane.startup();
        
        return {
            "store": dataStore,
            "listContentPane": listContentPane,
            "grid": grid
        };
    }
    
    function insertGridTable(pseudoQuestion, pagePane, pageDefinitions) {
        // Grid with list of objects
        // console.log("insertGridTable");
        
        var popupPageDefinition = pageDefinitions[pseudoQuestion.options];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition for options: ", pseudoQuestion.options, pseudoQuestion);
        }
        
        // TODO: Need to translate
        var label = widgets.newLabel(pseudoQuestion.id + "label", pseudoQuestion.text, pagePane.domNode);
        
        return insertGridTableBasic(pseudoQuestion.id, pagePane, popupPageDefinition, pseudoQuestion.value, true);
    }

    return {
        "insertGridTable": insertGridTable,
        "insertGridTableBasic": insertGridTableBasic
    };
    
});