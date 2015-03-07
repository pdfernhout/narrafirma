define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "./dialogSupport",
    "dojox/mvc/getPlainValue",
    "dojo/_base/lang",
    "js/translate",
    "dojox/uuid/generateRandomUuid",
    "./widgetSupport",
    "dgrid/extensions/ColumnResizer",
    "dijit/layout/ContentPane",
    "dgrid/extensions/DijitRegistry",
    "dijit/form/Form",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dojo/Stateful",
    "dstore/Trackable",
    "dgrid/OnDemandGrid"
], function(
    array,
    declare,
    dialogSupport,
    getPlainValue,
    lang,
    translate,
    generateRandomUuid,
    widgetSupport,
    ColumnResizer,
    ContentPane,
    DijitRegistry,
    Form,
    Keyboard,
    Selection,
    Stateful,
    Trackable,
    OnDemandGrid
){
    "use strict";

    // TODO: Probably need to prevent user surveys from having a question with a short name of "_id".
    
    // Possible configuration options
    // var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, navigationButtons: true, includeAllFields: false};
    function GridWithDetail(panelBuilder, pagePane, id, originalDataStore, popupPageDefinition, configuration) {
        var self = this;
        // Grid with list of objects
        console.log("constructing GridWithDetail", id, originalDataStore);
        
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
        
        console.log("=========== insertGridTableBasic popupPageDefinition", popupPageDefinition);
        
        var maxColumnCount = 5;
        var columnCount = 0;
        
        var displayTypesToDisplay = {
           text: true,
           textarea: true,
           select: true,
           radiobuttons: true
        };
        
        array.forEach(popupPageDefinition.questions, function (question) {
            var includeField = false;
            if (configuration.includeAllFields) {
                // TODO: improve this
                if (configuration.includeAllFields === true) {
                    if (question.displayType !== "label" && question.displayType !== "header") includeField = true;
                } else if (configuration.includeAllFields !== false) {
                    // Assume it is an array of field IDs to include
                    includeField = array.indexOf(configuration.includeAllFields, question.id) !== -1;
                }
            } else {
                if (columnCount < maxColumnCount) {
                    if (displayTypesToDisplay[question.displayType]) includeField = true;
                    columnCount++;
                }
            }
            // console.log("includeField", includeField, question.id);
            if (includeField) {
                var newColumn =  {
                    field: question.id,
                    label: translate("#" + question.id + "::shortName", question.displayName),
                    formatter: lang.hitch(this, this.formatObjectsIfNeeded),
                    sortable: !configuration.moveUpDownButtons
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
   
        pagePane.addChild(grid);
        
        var listContentPane = new ContentPane({
            // title: pseudoQuestion.text
        });
        
        pagePane.addChild(listContentPane);
        
        // TODO: Fix this so not using container node and adding directly to a contentPane
        var pane = listContentPane.containerNode;
        
        var itemContentPane = new ContentPane({
        });
        
        var buttons = {};
        this.buttons = buttons;
        this.selectedCount = 0;
        
        grid.on("dgrid-select", function(event) {
            console.log("dgrid-select");
            this.selectedCount += event.rows.length;
            self.updateGridButtonsForSelectionAndForm();
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") viewButtonClicked(id, grid, dataStore, popupPageDefinition, itemContentPane, event);
        });
        
        grid.on("dgrid-deselect", function(event) {
            console.log("dgrid-deselect");
            this.selectedCount -= event.rows.length;
            self.updateGridButtonsForSelectionAndForm();
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") viewButtonClicked(id, grid, dataStore, popupPageDefinition, itemContentPane, event);
        });
        
        grid.on("dgrid-sort", function(event) {
            console.log("dgrid-sort");
            // Sorting can change the enabling of the navigation buttons
            self.updateGridButtonsForSelectionAndFormLater();
        });
                
        if (configuration.addButton) {
            buttons.addButton = widgetSupport.newButton(pane, "#button_Add", lang.hitch(this, this.addButtonClicked));
        }
        
        if (configuration.removeButton) {
            buttons.removeButton = widgetSupport.newButton(pane, "#button_Remove", lang.hitch(this, this.removeButtonClicked));
        }
        
        this.navigateCallback = null;
        
        if (configuration.viewButton) {
            // Bind first two arguments to function that will be callback receiving one extra argument
            // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
            var viewButtonClickedPartial = lang.hitch(this, this.viewButtonClicked);
            var viewButtonID = id + "_view";
            buttons.viewButton = widgetSupport.newButton(pane, "#button_View", viewButtonClickedPartial);
            // TODO: Should there be an option of double click as edit?
            // Support double click as view
            grid.on("dblclick", viewButtonClickedPartial);
            this.navigateCallback = viewButtonClickedPartial;
        }

        if (configuration.editButton) {
            buttons.editButton = widgetSupport.newButton(pane, "#button_Edit", lang.hitch(this, this.editButtonClicked));
        }
        
        if (configuration.duplicateButton) {
            buttons.duplicateButton = widgetSupport.newButton(pane, "#button_Duplicate", lang.hitch(this, this.duplicateButtonClicked));
        }
             
        if (configuration.moveUpDownButtons) {
            buttons.upButton = widgetSupport.newButton(pane, "#button_Up", lang.hitch(this, this.upButtonClicked));
            buttons.downButton = widgetSupport.newButton(pane, "#button_Down", lang.hitch(this, this.downButtonClicked));
        }
        
        if (configuration.customButton) {
            var options = configuration.customButton;
            buttons.customButton = widgetSupport.newButton(pane, options.translationID, lang.partial(options.callback, this));
        }
         
        if (configuration.navigationButtons) {
            buttons.navigateStartButton = widgetSupport.newButton(pane, "#button_navigateStart", lang.hitch(this, this.navigateButtonClicked, "start"));
            buttons.navigatePreviousButton = widgetSupport.newButton(pane, "#button_navigatePrevious", lang.hitch(this, this.navigateButtonClicked, "previous"));
            buttons.navigateNextButton = widgetSupport.newButton(pane, "#button_navigateNext", lang.hitch(this, this.navigateButtonClicked, "next"));
            buttons.navigateEndButton = widgetSupport.newButton(pane, "#button_navigateEnd", lang.hitch(this, this.navigateButtonClicked, "end"));
        }
        
        
        this.updateGridButtonsForSelectionAndForm();
        
        pagePane.addChild(itemContentPane);
        
        itemContentPane.set("style", "background-color: #C0C0C0; border: 0.5em solid red; margin-left: 2em; display: none");
        
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
         
        this.panelBuilder = panelBuilder;

        this.store = dataStore;
        this.originalDataStore = originalDataStore;
        
        this.listContentPane = listContentPane;
        this.grid = grid;
        
        this.popupPageDefinition = popupPageDefinition;
        this.itemContentPane = itemContentPane;
        this.form = null;
        this.formType = null;
        this.formItem = null;
    }
    
    GridWithDetail.prototype.hideAndDestroyForm = function() {
        // The next line is needed to get rid of duplicate IDs for next time the form is opened:
        this.itemContentPane.set("style", "display: none");
        this.form.destroyRecursive();
        this.form = null;
        this.formType = null;
        this.formItem = null;
        this.updateGridButtonsForSelectionAndForm();
    };

    GridWithDetail.prototype.storeItem = function(statefulItem) {
        console.log("OK clicked", statefulItem);

        var uniqueItemID = generateRandomUuid();
        
        var plainValue = getPlainValue(statefulItem);
        console.log("grid plainValue", plainValue);

        if (this.formType === "add") {
            var idProperty = this.store.idProperty;
            plainValue[idProperty] = uniqueItemID;
            this.store.add(plainValue);
        } else {
            this.store.put(plainValue);
        }
                
        console.log("put store for add form");
        
        this.hideAndDestroyForm();
             
        console.log("shut down add form");
    };
    
    // formType can be view, add, edit
    GridWithDetail.prototype.openFormForItem = function(item, formType) {
        var self = this;
        console.log("openFormForItem", item);
        
        var statefulItem = new Stateful(item);
        
        if (this.form) {
            // Already have a panel displayed for either view or add
            console.log("Panel already displayed", this.formType, this.form);
            if (this.formType !== "view") {
                // TODO: Translate
                alert("Item change already in progress; please cancel form first");
                return;
            }
            // TODO: This comment and commented code looks out of date, since seems to rebuild even when viewing
            // Don't change anything if already viewing item
            // if (formType === "view" && statefulItem.get("id") === grid.formItem.get("id")) return;
            this.hideAndDestroyForm();
        }
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");

        this.panelBuilder.buildPanel(this.popupPageDefinition, this.form, statefulItem);
        
        var borderColor = "green";
        if (formType === "view") {
            borderColor = "blue";
            
            widgetSupport.newButton(form, "#button_Done", function() {
                console.log("Done");
                self.hideAndDestroyForm();
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
            widgetSupport.newButton(form, "#button_OK", lang.hitch(this, this.storeItem, statefulItem));
            widgetSupport.newButton(form, "#button_Cancel", function() {
                console.log("Cancel chosen");          
                // TODO: Confirm cancel if have entered data    
                self.hideAndDestroyForm();
            });
        }
        
        this.form = form;
        this.formType = formType;
        this.formItem = statefulItem;
        
        this.itemContentPane.addChild(form);
        
        this.itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid " + borderColor + "; margin: 1em; display: block");
        
        // Need to force the new form to resize so that the embedded grid will size its header correctly and not be zero height and overwritten
        form.resize();
        
        this.updateGridButtonsForSelectionAndForm();
    };
    
    GridWithDetail.prototype.addButtonClicked = function(event) {
        console.log("add button pressed", event);
        
        var newItem = {};
        var statefulItem = new Stateful(newItem);
        
        this.openFormForItem("add", statefulItem);  
    };
    
    GridWithDetail.prototype.getSelectedItemID = function() {
        var selectedItemID = null;
        
        console.log("getSelectedItemID", this.grid.selection);
        for (var theSelection in this.grid.selection) {
            if (this.grid.selection[theSelection]) selectedItemID = theSelection;
        }

        console.log("selectedItemID", selectedItemID);
        return selectedItemID;
    };
    
    GridWithDetail.prototype.getSelectedItem = function() {
        var selectedItemID = this.getSelectedItemID();
        
        if (!selectedItemID) {
            console.log("No selection");
            return null;
        }

        var selectedItem = this.store.getSync(selectedItemID);

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
            console.log("itemToDisplay was not found in store", selectedItemID, this.store);
            return null;
        }
        
        console.log("selectedItem", selectedItem);

        return selectedItem;
    };
    
    GridWithDetail.prototype.viewButtonClicked = function(event) {
        console.log("view button pressed or double click", event);
        
        var selectedItem = this.getSelectedItem();
        console.log("viewButtonClicked selectedItem", selectedItem);
        
        if (!selectedItem) {
            alert("Please select an item to view first");
            return;
        }
        
        this.openFormForItem("view", selectedItem);
    };
    
    GridWithDetail.prototype.removeButtonClicked = function(event) {
        console.log("remove button pressed", event);
        // TODO: translate
        dialogSupport.confirm("Are you sure you want to delete the selected item(s)?", function () {
            console.log("Removal confirmed");
            for (var itemID in this.grid.selection) {
                this.store.remove(itemID);
            }
        });
    };
    
    GridWithDetail.prototype.editButtonClicked = function(event) {
        console.log("edit button pressed", event);

        var selectedItem = this.getSelectedItem();
        
        if (!selectedItem) {
            alert("Please select an item to edit first");
            return;
        }
        
        this.openFormForItem("edit", selectedItem);
    };
    
    GridWithDetail.prototype.duplicateButtonClicked = function(event) {
        console.log("duplicate button pressed", event);

        var selectedItem = this.getSelectedItem();
        
        if (!selectedItem) {
            alert("Please select an item to duplicate first");
            return;
        }
        
        // Remove the ID so it will be treated as a new item
        delete selectedItem.id;
        
        this.openFormForItem("add", selectedItem);
    };
    
    GridWithDetail.prototype.upButtonClicked = function(event) {
        console.log("up button pressed", event);
        
        // Probably only work on Memory store
        var items = this.store.data;
        var lastSelectedObjectLocation = -1;
        var idProperty = this.store.idProperty;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[idProperty] in this.grid.selection) {
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
        // Tell grid to update for moved items
        this.grid.refresh();
    };
    
    GridWithDetail.prototype.downButtonClicked = function(event) {
        console.log("down button pressed", event);
        
        // Probably only work on Memory store
        var items = this.store.data;
        var lastSelectedObjectLocation = items.length;
        var idProperty = this.store.idProperty;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item[idProperty] in this.grid.selection) {
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
        // Tell grid to update for moved items
        this.grid.refresh();
    };
    
    GridWithDetail.prototype.navigateButtonClicked = function(direction, event) {
        console.log("navigate button pressed", direction);
        var selectedItemID = this.getSelectedItemID();
        var newRow;
        
        // TODO: Kludge of going to end at moving a million times, but would fail if more than a million items
        if (direction === "start") {
            newRow = this.grid.up(selectedItemID, 1000000, true);
        } else if (direction === "previous" && selectedItemID) {
            newRow = this.grid.up(selectedItemID, 1, true);
        } else if (direction === "next" && selectedItemID) {
            newRow = this.grid.down(selectedItemID, 1, true);
        } else if (direction === "end") {
            newRow = this.grid.down(selectedItemID, 1000000, true);
        }
        if (newRow) {
            if (selectedItemID) this.grid.deselect(selectedItemID);
            this.grid.select(newRow);
            if (this.formType === "view" && this.navigateCallback) this.navigateCallback();
        }
    };
    
    GridWithDetail.prototype.formatObjectsIfNeeded = function(item) {
        if (lang.isString(item)) return item;
        if (item === undefined) return "";
        if (item === null) return "";
        return JSON.stringify(item);
    };
    
    GridWithDetail.prototype.updateGridButtonsForSelectionAndFormLater = function() {
        // Defer updating until later to ensure grid settles down with sorting
        // otherwise could calculate button status incorrectly
        setTimeout(lang.hitch(this, this.updateGridButtonsForSelectionAndForm), 0);
    };
    
    GridWithDetail.prototype.updateGridButtonsForSelectionAndForm = function() {
        var buttons = this.buttons;
        var hasSelection = this.selectedCount;
        
        var isAdding = (this.formType === "add");
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
        var selectedItemID = this.getSelectedItemID();
        if (selectedItemID !== null) {
            var row = this.grid.row(selectedItemID);
            if (row) {
                var idAbove = this.grid.up(row, 1, true).id;
                var idBelow = this.grid.down(row, 1, true).id;
                console.log("current", selectedItemID, "above", idAbove, "below", idBelow);
                atStart = idAbove === selectedItemID;
                atEnd = idBelow === selectedItemID;
                console.log("atStart", atStart, "atEnd", atEnd);
            }
        }
        if (buttons.navigateStartButton) buttons.navigateStartButton.set("disabled", atStart);
        if (buttons.navigatePreviousButton) buttons.navigatePreviousButton.set("disabled", atStart || !selectedItemID || this.grid.selectedCount !== 1);
        if (buttons.navigateNextButton) buttons.navigateNextButton.set("disabled", atEnd || !selectedItemID || this.grid.selectedCount !== 1);
        if (buttons.navigateEndButton) buttons.navigateEndButton.set("disabled", atEnd);
    };
    
    return GridWithDetail;
    
});