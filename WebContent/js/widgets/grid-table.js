"use strict";

define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "exports",
    "dojox/mvc/getPlainValue",
    "dojo/_base/lang",
    "dijit/registry",
    "js/translate",
    "js/utility",
    "js/widgetBuilder",
    "dgrid/extensions/ColumnResizer",
    "dijit/layout/ContentPane",
    "dgrid/extensions/DijitRegistry",
    "dijit/form/Form",
    "dgrid/Keyboard",
    "dojo/store/Memory",
    "dgrid/Selection",
    "dojo/Stateful",
    "dgrid/OnDemandGrid"
], function(
    array,
    declare,
    domConstruct,
    exports,
    getPlainValue,
    lang,
    registry,
    translate,
    utility,
    widgetBuilder,
    ColumnResizer,
    ContentPane,
    DijitRegistry,
    Form,
    Keyboard,
    Memory,
    Selection,
    Stateful,
    OnDemandGrid
){
    // Kludge because dgrid seems to need to be resized after shown to ensure header displayed correctly -- reset to [] for each new page
    var allGrids = [];
    
    function resizeGridsKludge() {
        // Kludge for dgrid header issue
        console.log("Kludge allGrids", allGrids);
        for (var gridIndex in allGrids) {
            console.log("resizing dgrid", gridIndex, allGrids);
            allGrids[gridIndex].resize();
            // allGrids[gridIndex].refresh();
            console.log("resize done");
        }
    }
    
    function clearGridsKludge() {
        while (allGrids.length) allGrids.pop();
    }

    // TODO: Maybe rethink how unique item IDs work? Setting to start at 1000 because of test data created in story browser
    var uniqueItemIDCounter = 1000;
    
    function newItemAdded(id, grid, itemContentPane, form, popupPageDefinition, store, statefulItem) {
        console.log("OK clicked", statefulItem);

        var uniqueItemID = ++uniqueItemIDCounter;
        
        var plainValue = getPlainValue(statefulItem);
        console.log("grid plainValue", plainValue);

        store.put(plainValue);
                
        console.log("put store for add form");
        
        itemContentPane.set("style", "display: none");
        
        // refresh ensures the new data is displayed
        console.log("Doing refresh for data", statefulItem);
        grid.refresh();
        
        // The next line is needed to get rid of duplicate IDs for next time the form is opened:
        form.destroyRecursive();
        console.log("shut down add form");
    }
    
    function addButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("add button pressed", id, event);
        
        if (grid.form) { // itemContentPane.domNode.childNodes.length > 0) {
            // Already have a panel displayed for either view or add
            console.log("Panel already displayed", grid.formType, grid.form);
            if (grid.formType === "add") {
                // TODO: Translate
                alert("Add already in progress; please cancel add form first");
                return;
            }
            grid.form.destroyRecursive();
            grid.formType = null;
            grid.form = null;
        }
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid green; margin: 1em; display: block");
        
        clearGridsKludge();
        
        var newItem = {};
        
        var statefulItem = new Stateful(newItem);
        
        popupPageDefinition.buildPage(widgetBuilder, form, statefulItem);
             
        utility.newButton("list_dialog_ok_" + grid.id, "button_OK", form, lang.partial(newItemAdded, id, grid, itemContentPane, form, popupPageDefinition, store, statefulItem));
        
        utility.newButton("list_dialog_cancel_" + grid.id, "button_Cancel", form, function() {
            console.log("Cancel chosen");
            
            // TODO: Confirm cancel if have entered data
            
            grid.formType = null;
            grid.form = null;
            
            itemContentPane.set("style", "display: none");       
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        grid.form = form;
        grid.formType = "add";
        
        itemContentPane.addChild(form);
        
        form.startup();
        resizeGridsKludge();
    }
    
    // TODO: Button should only be enabled if a selection
    function viewButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("view button pressed", id, event);
        
        if (grid.form) { // itemContentPane.domNode.childNodes.length > 0) {
            // Already have a panel displayed for either view or add
            console.log("Panel already displayed", grid.formType, grid.form);
            if (grid.formType === "add") {
                // TODO: Translate
                alert("Add already in progress; please cancel add form first");
                return;
            }
            grid.form.destroyRecursive();
            grid.formType = null;
            grid.form = null;
        }
        
        // TODO: Should only do for one of these... Need to break...
        // TODO: Need to search on unique field...
        var selection = null;
        
        for (var theSelection in grid.selection) {
            selection = theSelection;
        }
        
        if (!selection) {
            console.log("No selection");
            // TODO: Translate
            alert("Please select an item to view first");
            return;
        }
        
        var form = new Form(); 
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid blue; margin: 1em; display: block");
        
        clearGridsKludge();
                
        console.log("grid", grid, grid.selection);

        /*
        console.log("selection", selection);
        var matches = store.query({id: selection});
        console.log("matches", matches);
        // Should only be one match
        var itemToDisplay = null;
        array.forEach(matches, function (item) {
            console.log("item", item);
            itemToDisplay = item;
        });
        */
        
        console.log("selection", selection);
        var itemToDisplay = store.get(selection);
        
        if (itemToDisplay === null) {
            console.log("itemToDisplay is null", id);
            return;
        }
        
        console.log("item to display", itemToDisplay);
        
        popupPageDefinition.buildPage(widgetBuilder, form, new Stateful(itemToDisplay));

        /* TODO: Some way to disable editing?
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
        */

        utility.newButton("list_dialog_ok" + grid.id, "button_Done", form, function() {
            console.log("Done");
            
            grid.formType = null;
            grid.form = null;

            itemContentPane.set("style", "display: none");
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        grid.form = form;
        grid.formType = "view";
        
        itemContentPane.addChild(form);
        
        form.startup();
        resizeGridsKludge();
        console.log("done with view button clicked");
    }
    
    function formatObjectsIfNeeded(item) {
        if (lang.isString(item)) return item;
        if (item === undefined) return "";
        if (item === null) return "";
        return JSON.stringify(item);
    }
    
    function insertGridTableBasic(pagePane, id, dataStore, popupPageDefinition, includeAddButton, includeAllFields) {
        // Grid with list of objects
        console.log("insertGridTableBasic", id, dataStore);
        
        // TODO: Need to set better info for fields and meanings to display and index on
        
        var columns = [];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition", id, pagePane);
        }
        
        // TODO: FIX ME -- no longer have questions -- either add them back or find another approach...
        array.forEach(popupPageDefinition.questions, function (question) {
            var includeField = question.isGridColumn;
            if (includeAllFields) {
                // TODO: improve this
                if (question.type !== "label" && question.type !== "header") includeField = true;
            }
            if (includeField) {
                var newColumn =  {
                    field: question.id,
                    label: translate(question.id + "::shortName"),
                    formatter: formatObjectsIfNeeded
                };
                columns.push(newColumn);
            }
        });
        
        // console.log("making grid");
        var grid = new(declare([OnDemandGrid, DijitRegistry, Keyboard, Selection, ColumnResizer]))({
            "id": id,
            "store": dataStore,
            "columns": columns
        });
        
        if (!pagePane.addChild) {
            console.log("trouble -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(grid.domNode);
        } else {
            pagePane.addChild(grid);
        }
        
        grid.startup();
                
        var listContentPane = new ContentPane({
            // title: pseudoQuestion.text
        });
        
        if (!pagePane.addChild) {
            console.log("trouble -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(listContentPane.domNode);
        } else {
            pagePane.addChild(listContentPane);
        }
        
        listContentPane.startup();
        
        var pane = listContentPane.containerNode;
        
        var itemContentPane = new ContentPane({
        });
        
        // Bind first two arguments to function that will be callback receiving one extra argument
        // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
        var viewButtonClickedPartial = lang.partial(viewButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane);
        var viewButtonID = id + "view";
        var viewButton = utility.newButton(viewButtonID, "button_View", pane, viewButtonClickedPartial);

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
        
        // Support double click as view
        grid.on("dblclick", viewButtonClickedPartial);
        
        if (includeAddButton) {
            var addButton = utility.newButton(id + "add", "button_Add", pane, lang.partial(addButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        if (!pagePane.addChild) {
            console.log("trouble -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(itemContentPane.domNode);
        } else {
            pagePane.addChild(itemContentPane);
        } 
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.5em solid red; margin-left: 2em; display: none");
        
        itemContentPane.startup();

        // Kludge to support dgrid header fix as otherwise header not always sized correctly
        allGrids.push(grid);
        console.log("adding grid to kludge array", grid, allGrids);
        
        return {
            "store": dataStore,
            "listContentPane": listContentPane,
            "grid": grid
        };
    }
    
    var exportedFunctions = {
        "insertGridTableBasic": insertGridTableBasic,
        "clearGridsKludge": clearGridsKludge,
        "resizeGridsKludge": resizeGridsKludge,
        "allGrids": allGrids
    };
    
    lang.mixin(exports, exportedFunctions);
    
});