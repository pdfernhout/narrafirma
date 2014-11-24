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
    "./widgetSupport",
    "dgrid/extensions/ColumnResizer",
    "dijit/layout/ContentPane",
    "dgrid/extensions/DijitRegistry",
    "dijit/form/Form",
    "dgrid/Keyboard",
    "dojo/store/Memory",
    "dgrid/Selection",
    "dojo/Stateful",
    "dojo/store/Observable",
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
    widgetSupport,
    ColumnResizer,
    ContentPane,
    DijitRegistry,
    Form,
    Keyboard,
    Memory,
    Selection,
    Stateful,
    Observable,
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
    
    function hideAndDestroyForm(itemContentPane, form, grid) {
        // The next line is needed to get rid of duplicate IDs for next time the form is opened:
        itemContentPane.set("style", "display: none");
        form.destroyRecursive();
        grid.form = null;
        grid.formType = null;
        grid.formItemToDisplay = null;
        grid.formItemToAdd = null;
        updateGridButtonsForSelectionAndForm(grid);
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
        
        hideAndDestroyForm(itemContentPane, form, grid);
             
        // refresh ensures the new data is displayed
        console.log("Doing refresh for data", statefulItem);
        grid.refresh();
          
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
            hideAndDestroyForm(itemContentPane, grid.form, grid);
        }
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
            
        clearGridsKludge();
        
        var newItem = {};
        
        var statefulItem = new Stateful(newItem);
        
        popupPageDefinition.buildPage(widgetBuilder, form, statefulItem);
             
        utility.newButton("list_dialog_ok_" + grid.id, "button_OK", form, lang.partial(newItemAdded, id, grid, itemContentPane, form, popupPageDefinition, store, statefulItem));
        
        utility.newButton("list_dialog_cancel_" + grid.id, "button_Cancel", form, function() {
            console.log("Cancel chosen");
            
            // TODO: Confirm cancel if have entered data
              
            hideAndDestroyForm(itemContentPane, form, grid);
        });
        
        grid.form = form;
        grid.formType = "add";
        grid.formItemToAdd = statefulItem;
        
        itemContentPane.addChild(form);
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid green; margin: 1em; display: block");
        
        form.startup();
        resizeGridsKludge();
        
        updateGridButtonsForSelectionAndForm(grid);
    }
    
    function viewButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("view button pressed or double click", id, event);
        
        var selection = null;
        
        for (var theSelection in grid.selection) {
            selection = theSelection;
        }
        
        if (grid.form) { // itemContentPane.domNode.childNodes.length > 0) {
            // Already have a panel displayed for either view or add
            console.log("Panel already displayed", grid.formType, grid.form);
            if (grid.formType === "add") {
                // TODO: Translate
                alert("Add already in progress; please cancel add form first");
                return;
            }
            // Don't change anything if already viewing item
            if (selection === grid.formItemToDisplay) return;
            hideAndDestroyForm(itemContentPane, grid.form, grid);
        }
        
        if (!selection) {
            console.log("No selection");
            // TODO: Translate
            alert("Please select an item to view first");
            return;
        }
        
        console.log("selection", selection);
        
        // Can't use store.get becaues store.index may be out of date if the array changed; store only updates the index on a put
        // var itemToDisplay = store.get(selection);
        var matches = store.query({id: selection});
        console.log("matches", matches);
        // Should only be one match
        var itemToDisplay = null;
        array.forEach(matches, function (item) {
            console.log("item", item);
            itemToDisplay = item;
        });
        
        if (!itemToDisplay) {
            console.log("itemToDisplay was not found in store", id, store);
            return;
        }
        
        console.log("item to display", itemToDisplay);
                
        var form = new Form(); 
        form.set("style", "width: 800px; height 800px; overflow: auto;");
            
        clearGridsKludge();
                
        console.log("grid", grid, grid.selection);
        
        var statefulItem = new Stateful(itemToDisplay);
        
        popupPageDefinition.buildPage(widgetBuilder, form, statefulItem);

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
            
            hideAndDestroyForm(itemContentPane, form, grid);
        });
        
        grid.form = form;
        grid.formType = "view";
        grid.formItemToDisplay = itemToDisplay;
        
        itemContentPane.addChild(form);
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid blue; margin: 1em; display: block");
        
        form.startup();
        resizeGridsKludge();
        
        updateGridButtonsForSelectionAndForm(grid);
        // console.log("done with view button clicked");
    }
    
    function removeButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("remove button pressed", id, event);
        // TODO: translate
        widgetSupport.confirm("Are you sure you with to delete the selected item(s)?", function () {
            console.log("Removal confirmed");
            for (var id in grid.selection) {
                store.remove(id);
            }
        });
    }
    
    function editButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("edit button pressed", id, event);
    }
    
    function duplicateButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("duplicate button pressed", id, event);
    }
    
    function upButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("up button pressed", id, event);
    }
    
    function downButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("down button pressed", id, event);
    }
    
    function formatObjectsIfNeeded(item) {
        if (lang.isString(item)) return item;
        if (item === undefined) return "";
        if (item === null) return "";
        return JSON.stringify(item);
    }
    
    function updateGridButtonsForSelectionAndForm(grid) {
        var buttons = grid.buttons;
        var selected = grid.selectedCount;
        
        var isAdding = (grid.formType === "add");
        if (buttons.addButton) buttons.addButton.set("disabled", isAdding);
        
        // disable other buttons if in the middle of adding a new item or if no selection; otherwise enable
        if (isAdding) selected = false;
        if (buttons.viewButton) buttons.viewButton.set("disabled", !selected);
        if (buttons.removeButton) buttons.removeButton.set("disabled", !selected);
        if (buttons.editButton) buttons.editButton.set("disabled", !selected);
        if (buttons.duplicateButton) buttons.duplicateButton.set("disabled", !selected);
        if (buttons.upButton) buttons.upButton.set("disabled", !selected);
        if (buttons.downButton) buttons.downButton.set("disabled", !selected);
    }
    
    // Possible configuration options
    // var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};
    function insertGridTableBasic(pagePane, id, dataStore, popupPageDefinition, configuration) {
        // Grid with list of objects
        console.log("insertGridTableBasic", id, dataStore);
        
        // TODO: may need to check if already observable so dont; do extra wrapping.
        dataStore = new Observable(dataStore);

        // TODO: only for testing!!!
        configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};

        // TODO: Need to set better info for fields and meanings to display and index on
        
        var columns = [];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition", id, pagePane);
        }
        
        // TODO: FIX ME -- no longer have questions -- either add them back or find another approach...
        array.forEach(popupPageDefinition.questions, function (question) {
            var includeField = question.isGridColumn;
            if (configuration.includeAllFields) {
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
            "sort": "order",
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
        
        var buttons = {};
        grid.buttons = buttons;
        grid.selectedCount = 0;

        grid.on("dgrid-select", function(event) {
            console.log("dgrid-select", event);
            grid.selectedCount += event.rows.length;
            updateGridButtonsForSelectionAndForm(grid);
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") viewButtonClicked(id, grid, dataStore, popupPageDefinition, itemContentPane, event);
        });
        
        grid.on("dgrid-deselect", function(event) {
            console.log("dgrid-deselect", event);
            grid.selectedCount -= event.rows.length;
            updateGridButtonsForSelectionAndForm(grid);
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") viewButtonClicked(id, grid, dataStore, popupPageDefinition, itemContentPane, event);
        });
                
        if (configuration.addButton) {
            buttons.addButton = utility.newButton(id + "_add", "button_Add", pane, lang.partial(addButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        if (configuration.removeButton) {
            buttons.removeButton = utility.newButton(id + "_remove", "button_Remove", pane, lang.partial(removeButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        if (configuration.viewButton) {
            // Bind first two arguments to function that will be callback receiving one extra argument
            // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
            var viewButtonClickedPartial = lang.partial(viewButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane);
            var viewButtonID = id + "_view";
            buttons.viewButton = utility.newButton(viewButtonID, "button_View", pane, viewButtonClickedPartial);
            // TODO: Should there be an option of double click as edit?
            // Support double click as view
            grid.on("dblclick", viewButtonClickedPartial);
        }

        if (configuration.editButton) {
            buttons.editButton = utility.newButton(id + "_edit", "button_Edit", pane, lang.partial(editButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        if (configuration.duplicateButton) {
            buttons.duplicateButton = utility.newButton(id + "_duplicate", "button_Duplicate", pane, lang.partial(duplicateButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        if (configuration.moveUpDownButtons) {
            buttons.upButton = utility.newButton(id + "_up", "button_Up", pane, lang.partial(upButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane));
            buttons.downButton = utility.newButton(id + "_down", "button_Down", pane, lang.partial(downButtonClicked, id, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        updateGridButtonsForSelectionAndForm(grid);
        
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