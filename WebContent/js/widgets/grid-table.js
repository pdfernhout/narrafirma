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
    "dojox/uuid/generateRandomUuid",
    "js/widgetBuilder",
    "./widgetSupport",
    "dgrid/extensions/ColumnResizer",
    "dijit/layout/ContentPane",
    "dgrid/extensions/DijitRegistry",
    "dijit/form/Form",
    "dgrid/Keyboard",
    "dstore/Memory",
    "dgrid/Selection",
    "dojo/Stateful",
    "dijit/Tooltip",
    "dstore/Trackable",
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
    uuid,
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
    Tooltip,
    Trackable,
    OnDemandGrid
){
    "use strict";

    // Kludge because dgrid seems to need to be resized after shown to ensure header displayed correctly -- reset to [] for each new page
    var allGrids = [];
    
    // TODO: Probably need to prevent user surveys from having a question with a short name of "_id".
    
    function resizeGridsKludge() {
        // Kludge for dgrid header issue
        console.log("Kludge allGrids", allGrids);
        for (var gridIndex in allGrids) {
            console.log("resizing dgrid", gridIndex, allGrids);
            allGrids[gridIndex].resize();
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
        grid.formItem = null;
        updateGridButtonsForSelectionAndForm(grid);
    }

    function storeItem(id, grid, store, popupPageDefinition, itemContentPane, form, statefulItem) {
        console.log("OK clicked", statefulItem);

        var uniqueItemID = uuid();
        
        var plainValue = getPlainValue(statefulItem);
        console.log("grid plainValue", plainValue);

        if (grid.formType === "add") {
            var idProperty = store.idProperty;
            plainValue[idProperty] = uniqueItemID;
            store.add(plainValue);
        } else {
            store.put(plainValue);
        }
                
        console.log("put store for add form");
        
        hideAndDestroyForm(itemContentPane, form, grid);
             
        console.log("shut down add form");
    }
    
    // formType can be view, add, edit
    function openFormForItem(id, grid, store, popupPageDefinition, itemContentPane, formType, item) {
        console.log("openFormForItem", grid, formType, item);
        
        var statefulItem = new Stateful(item);
        
        if (grid.form) {
            // Already have a panel displayed for either view or add
            console.log("Panel already displayed", grid.formType, grid.form);
            if (grid.formType !== "view") {
                // TODO: Translate
                alert("Item change already in progress; please cancel form first");
                return;
            }
            // Don't change anything if already viewing item
            // if (formType === "view" && statefulItem.get("id") === grid.formItem.get("id")) return;
            hideAndDestroyForm(itemContentPane, grid.form, grid);
        }
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
            
        clearGridsKludge();

        popupPageDefinition.buildPage(widgetBuilder, form, statefulItem);
        
        var borderColor = "green";
        if (formType === "view") {
            borderColor = "blue";
            
            utility.newButton("list_dialog_ok" + grid.id, "button_Done", form, function() {
                console.log("Done");
                hideAndDestroyForm(itemContentPane, form, grid);
            });
            
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
        } else {
            utility.newButton("list_dialog_ok_" + grid.id, "button_OK", form, lang.partial(storeItem, id, grid, store, popupPageDefinition, itemContentPane, form, statefulItem));
            utility.newButton("list_dialog_cancel_" + grid.id, "button_Cancel", form, function() {
                console.log("Cancel chosen");          
                // TODO: Confirm cancel if have entered data    
                hideAndDestroyForm(itemContentPane, form, grid);
            });
        }
        
        grid.form = form;
        grid.formType = formType;
        grid.formItem = statefulItem;
        
        itemContentPane.addChild(form);
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid " + borderColor + "; margin: 1em; display: block");
        
        resizeGridsKludge();
        
        updateGridButtonsForSelectionAndForm(grid);
    }
    
    function addButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("add button pressed", id, event);
        
        var newItem = {};
        var statefulItem = new Stateful(newItem);
        
        openFormForItem(id, grid, store, popupPageDefinition, itemContentPane, "add", statefulItem);  
    }
    
    function getSelectedItemID(grid) {
        var selectedItemID = null;
        
        console.log("getSelectedItemID", grid.selection);
        for (var theSelection in grid.selection) {
            if (grid.selection[theSelection]) selectedItemID = theSelection;
        }

        console.log("selectedItemID", selectedItemID);
        return selectedItemID;
    }
    
    function getSelectedItem(grid, store) {
        var selectedItemID = getSelectedItemID(grid);
        
        if (!selectedItemID) {
            console.log("No selection");
            return null;
        }

        var selectedItem = store.getSync(selectedItemID);

        // TODO: This is probably out of date and can be removed now that using Observable? Can these grids be changed elsewhere when this grid is visible?
        // Can't use store.get because store.index may be out of date if the array changed; store only updates the index on a put
        // var itemToDisplay = store.get(selectedItemID);
        /*
         * var matches = store.query({id: selectedItemID});
        console.log("matches", matches);
        // Should only be one match
        var selectedItem = null;
        array.forEach(matches, function (item) {
            console.log("item", item);
            selectedItem = item;
        });
        */
        
        if (!selectedItem) {
            alert("itemToDisplay was not found in store: " + selectedItemID);
            console.log("itemToDisplay was not found in store", selectedItemID, store);
            return null;
        }
        
        console.log("selectedItem", selectedItem);

        return selectedItem;
    }
    
    function viewButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("view button pressed or double click", id, event);
        
        var selectedItem = getSelectedItem(grid, store);
        console.log("viewButtonClicked selectedItem", selectedItem);
        
        if (!selectedItem) {
            alert("Please select an item to view first");
            return;
        }
        
        openFormForItem(id, grid, store, popupPageDefinition, itemContentPane, "view", selectedItem);
    }
    
    function removeButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("remove button pressed", id, event);
        // TODO: translate
        widgetSupport.confirm("Are you sure you want to delete the selected item(s)?", function () {
            console.log("Removal confirmed");
            for (var itemID in grid.selection) {
                store.remove(itemID);
            }
        });
    }
    
    function editButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("edit button pressed", id, event);

        var selectedItem = getSelectedItem(grid, store);
        
        if (!selectedItem) {
            alert("Please select an item to edit first");
            return;
        }
        
        openFormForItem(id, grid, store, popupPageDefinition, itemContentPane, "edit", selectedItem);
    }
    
    function duplicateButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("duplicate button pressed", id, event);

        var selectedItem = getSelectedItem(grid, store);
        
        if (!selectedItem) {
            alert("Please select an item to duplicate first");
            return;
        }
        
        // Remove the ID so it will be treated as a new item
        delete selectedItem.id;
        
        openFormForItem(id, grid, store, popupPageDefinition, itemContentPane, "add", selectedItem);
    }
    
    function upButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("up button pressed", id, event);
        
        // Probably only work on Memory store
        var items = store.data;
        var lastSelectedObjectLocation = -1;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[store.idProperty] in grid.selection) {
                if (lastSelectedObjectLocation < i - 1) {
                    var otherItem = items[i - 1];
                    items[i - 1] = item;
                    items[i] = otherItem;
                    lastSelectedObjectLocation = i - 1;
                } else {
                    lastSelectedObjectLocation = i;
                }
            }
        }
        grid.refresh();
    }
    
    function downButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("down button pressed", id, event);
        
        // Probably only work on Memory store
        var items = store.data;
        var lastSelectedObjectLocation = items.length;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item[store.idProperty] in grid.selection) {
                if (lastSelectedObjectLocation > i + 1) {
                    var otherItem = items[i + 1];
                    items[i + 1] = item;
                    items[i] = otherItem;
                    lastSelectedObjectLocation = i + 1;
                } else {
                    lastSelectedObjectLocation = i;
                }
            }
        }
        grid.refresh();
    }
    
    function navigateButtonClicked(direction, id, grid, store, popupPageDefinition, itemContentPane, event) {
        console.log("navigate button pressed", direction);
        var selectedItemID = getSelectedItemID(grid);
        var newRow;
        
        if (direction === "start") {
            newRow = null;
        } else if (direction === "previous" && selectedItemID) {
            newRow = grid.up(selectedItemID, 1, true);
        } else if (direction === "next" && selectedItemID) {
            newRow = grid.down(selectedItemID, 1, true);
        } else if (direction === "end") {
            newRow = null;
        }
        if (newRow) {
            if (selectedItemID) grid.deselect(selectedItemID);
            grid.select(newRow);
        }
    }
    
    function formatObjectsIfNeeded(item) {
        if (lang.isString(item)) return item;
        if (item === undefined) return "";
        if (item === null) return "";
        return JSON.stringify(item);
    }
    
    function updateGridButtonsForSelectionAndFormLater(grid) {
        // Defer updating until later to ensure grid settles down with sorting
        // otherwise could calculate button status incorrectly
        setTimeout(lang.partial(updateGridButtonsForSelectionAndForm, grid), 0);
    }
    
    function updateGridButtonsForSelectionAndForm(grid) {
        var buttons = grid.buttons;
        var hasSelection = grid.selectedCount;
        
        var isAdding = (grid.formType === "add");
        if (buttons.addButton) buttons.addButton.set("disabled", isAdding);
        
        // disable other buttons if in the middle of adding a new item or if no selection; otherwise enable
        if (isAdding) hasSelection = false;
        if (buttons.viewButton) buttons.viewButton.set("disabled", !hasSelection);
        if (buttons.removeButton) buttons.removeButton.set("disabled", !hasSelection);
        if (buttons.editButton) buttons.editButton.set("disabled", !hasSelection);
        if (buttons.duplicateButton) buttons.duplicateButton.set("disabled", !hasSelection);
        if (buttons.upButton) buttons.upButton.set("disabled", !hasSelection);
        if (buttons.downButton) buttons.downButton.set("disabled", !hasSelection);
        if (buttons.customButton) buttons.customButton.set("disabled", !hasSelection);
        
        // enabling for navigate buttons based on whether can move up or down in list in current sort order
        var atStart = true;
        var atEnd = true;
        var selectedItemID = getSelectedItemID(grid);
        if (selectedItemID !== null) {
            var row = grid.row(selectedItemID);
            if (row) {
                var idAbove = grid.up(row, 1, true).id;
                var idBelow = grid.down(row, 1, true).id;
                console.log("current", selectedItemID, "above", idAbove, "below", idBelow);
                atStart = idAbove === selectedItemID;
                atEnd = idBelow === selectedItemID;
                console.log("atStart", atStart, "atEnd", atEnd);
            }
        }
        if (buttons.navigateStartButton) buttons.navigateStartButton.set("disabled", atStart);
        if (buttons.navigatePreviousButton) buttons.navigatePreviousButton.set("disabled", atStart || !selectedItemID || grid.selectedCount !== 1);
        if (buttons.navigateNextButton) buttons.navigateNextButton.set("disabled", atEnd || !selectedItemID || grid.selectedCount !== 1);
        if (buttons.navigateEndButton) buttons.navigateEndButton.set("disabled", atEnd);
    }
    
    // Possible configuration options
    // var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, navigationButtons: true, includeAllFields: false};
    function insertGridTableBasic(pagePane, id, originalDataStore, popupPageDefinition, configuration) {
        // Grid with list of objects
        console.log("insertGridTableBasic", id, originalDataStore);
        
        // TODO: may need to check if already observable so don't do extra wrapping.
        // var dataStore = new Observable(originalDataStore);
        var dataStore = Trackable.create(originalDataStore);

        // only for testing!!!
        // configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};

        // TODO: Need to set better info for fields and meanings to display and index on
        
        var columns = [];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition", id, pagePane);
        }
        
        // TODO: FIX ME -- no longer have questions -- either add them back or find another approach...
        array.forEach(popupPageDefinition.questions, function (question) {
            var includeField = question.isGridColumn || false;
            if (configuration.includeAllFields) {
                // TODO: improve this
                if (configuration.includeAllFields === true) {
                    if (question.type !== "label" && question.type !== "header") includeField = true;
                } else if (configuration.includeAllFields !== false) {
                    // Assume it is an array of field IDs to include
                    includeField = array.indexOf(configuration.includeAllFields, question.id) !== -1;
                }
            }
            // console.log("includeField", includeField, question.id);
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
            id: id,
            // "sort": "order",
            collection: dataStore,
            columns: columns,
            // Preserve the selections despite refresh needed when move items up or down
            deselectOnRefresh: false
        });
        
        if (!pagePane.addChild) {
            alert("TROUBLE -- see log");
            console.log("TROUBLE -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(grid.domNode);
        } else {
            pagePane.addChild(grid);
        }
        
        var listContentPane = new ContentPane({
            // title: pseudoQuestion.text
        });
        
        if (!pagePane.addChild) {
            alert("TROUBLE -- see log");
            console.log("TROUBLE -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(listContentPane.domNode);
        } else {
            pagePane.addChild(listContentPane);
        }
        
        var pane = listContentPane.containerNode;
        
        var itemContentPane = new ContentPane({
        });
        
        var buttons = {};
        grid.buttons = buttons;
        grid.originalDataStore = originalDataStore;
        grid.selectedCount = 0;

        grid.on("dgrid-select", function(event) {
            console.log("dgrid-select");
            grid.selectedCount += event.rows.length;
            updateGridButtonsForSelectionAndForm(grid);
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") viewButtonClicked(id, grid, dataStore, popupPageDefinition, itemContentPane, event);
        });
        
        grid.on("dgrid-deselect", function(event) {
            console.log("dgrid-deselect");
            grid.selectedCount -= event.rows.length;
            updateGridButtonsForSelectionAndForm(grid);
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") viewButtonClicked(id, grid, dataStore, popupPageDefinition, itemContentPane, event);
        });
        
        grid.on("dgrid-sort", function(event) {
            console.log("dgrid-sort");
            // Sorting can change the enabling of the navigation buttons
            updateGridButtonsForSelectionAndFormLater(grid);
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
        
        if (configuration.customButton) {
            var options = configuration.customButton;
            buttons.customButton = utility.newButton(id + "_" + options.id, options.translationID, pane, lang.partial(options.callback, id, grid, dataStore, popupPageDefinition, itemContentPane));
            // Make this function available to users
            grid.getSelectedItem = getSelectedItem;
        }
         
        if (configuration.navigationButtons) {
            buttons.navigateStartButton = utility.newButton(id + "_navigateStart", "button_navigateStart", pane, lang.partial(navigateButtonClicked, "start", id, grid, dataStore, popupPageDefinition, itemContentPane));
            buttons.navigatePreviousButton = utility.newButton(id + "_navigatePrevious", "button_navigatePrevious", pane, lang.partial(navigateButtonClicked, "previous",  id, grid, dataStore, popupPageDefinition, itemContentPane));
            buttons.navigateNextButton = utility.newButton(id + "_navigateNext", "button_navigateNext", pane, lang.partial(navigateButtonClicked, "next",  id, grid, dataStore, popupPageDefinition, itemContentPane));
            buttons.navigateEndButton = utility.newButton(id + "_navigateEnd", "button_navigateEnd", pane, lang.partial(navigateButtonClicked, "end",  id, grid, dataStore, popupPageDefinition, itemContentPane));
        }
        
        updateGridButtonsForSelectionAndForm(grid);
        
        if (!pagePane.addChild) {
            alert("TROUBLE -- see log");
            console.log("TROUBLE -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(itemContentPane.domNode);
        } else {
            pagePane.addChild(itemContentPane);
        } 
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.5em solid red; margin-left: 2em; display: none");
        
        // Kludge to support dgrid header fix as otherwise header not always sized correctly
        allGrids.push(grid);
        console.log("adding grid to kludge array", grid, allGrids);
        
        /*
        if (configuration.showTooltip) {
            console.log("using tooltip for widget", id, grid);
            new Tooltip({
                connectId: id,
                selector: ".dgrid-cell",
                getContent: function(matchedNode) {
                    console.log("trying to get tooltip text", matchedNode);
                    // return matchedNode.getAttribute("tooltipText");
                    return matchedNode.innerHTML;
                },
                position: ["below", "above", "before", "after"],
                label: "the text for the tooltip",
                showDelay: 600
            });
        }
        */
         
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