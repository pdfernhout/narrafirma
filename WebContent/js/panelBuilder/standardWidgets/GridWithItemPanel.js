define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "../dialogSupport",
    "dojox/mvc/getPlainValue",
    "dojo/_base/lang",
    "../translate",
    "dojox/uuid/generateRandomUuid",
    "../widgetSupport",
    "dgrid/extensions/ColumnResizer",
    "dgrid/extensions/DijitRegistry",
    "dijit/form/Form",
    "dgrid/Keyboard",
    'dstore/Memory',
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
    DijitRegistry,
    Form,
    Keyboard,
    Memory,
    Selection,
    Stateful,
    Trackable,
    OnDemandGrid
){
    "use strict";
    
    var debugSelecting = true;
    
    // This defines a gui component which has a grid, some buttons, and a detail panel do display the currently selected item or enter a new item

    // TODO: Probably need to prevent user surveys from having a question with a short name of "_id".
    
    // Possible configuration options
    // var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, navigationButtons: true, includeAllFields: false};
    function GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration) {
        var self = this;
        
        console.log("=========== creating GridWithItemPanel with itemPanelSpecification", itemPanelSpecification);
        console.log("constructing GridWithItemPanel", id, dataStore);
        
        if (!itemPanelSpecification) {
            console.log("Trouble: no itemPanelSpecification", id, pagePane);
        }
        
        this.configuration = configuration;
        this.panelBuilder = panelBuilder;

        // A count of how many items are currently selected
        this.selectedCount = 0;
                        
        this.itemPanelSpecification = itemPanelSpecification;
        
        // The detail form, its type, and the item it is displaying
        this.form = null;
        this.formType = null;
        this.formItem = null;
        this.itemContentPane = panelBuilder.newContentPane();
        
        // The button widgets created to interact with the current item
        this.buttons = {};
        
        // The dgrid that will display all items
        this.grid = null;

        // dataStore should be trackable!!!
        this.store = dataStore;

        // only for testing!!!
        // configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};

        // TODO: Need to set better info for fields and meanings to display and index on
        
        var columns = this.computeColumnsForItemPanelSpecification(configuration, itemPanelSpecification);
        
        // console.log("making grid");
        this.grid = new(declare([OnDemandGrid, DijitRegistry, Keyboard, Selection, ColumnResizer]))({
            // "sort": "order",
            collection: this.store,
            columns: columns,
            // Preserve the selections despite refresh needed when move items up or down
            deselectOnRefresh: false
        });
   
        pagePane.addChild(this.grid);
        
        var buttonContentPane = panelBuilder.newContentPane();
        pagePane.addChild(buttonContentPane);
        
        this.grid.on("dgrid-select", function(event) {
            if (debugSelecting) console.log("dgrid-select");
            self.selectedCount += event.rows.length;
            self.updateGridButtonsForSelectionAndForm();
            
            // Defer updating until later to ensure grid settles down with selecting
            if (configuration.selectCallback) setTimeout(function () {
                configuration.selectCallback(self, self.getSelectedItem());
            }, 0);
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") self.viewButtonClicked(event);
        });
        
        this.grid.on("dgrid-deselect", function(event) {
            if (debugSelecting) console.log("dgrid-deselect");
            self.selectedCount -= event.rows.length;
            self.updateGridButtonsForSelectionAndForm();
            
            // Defer updating until later to ensure grid settles down with selecting
            if (configuration.selectCallback) setTimeout(lang.partial(configuration.selectCallback, self, null), 0);
            
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") self.viewButtonClicked(event);
        });
        
        this.grid.on("dgrid-sort", function(event) {
            if (debugSelecting) console.log("dgrid-sort");
            // Sorting can change the enabling of the navigation buttons
            self.updateGridButtonsForSelectionAndFormLater();
        });
                
        if (configuration.addButton) {
            this.buttons.addButton = widgetSupport.newButton(buttonContentPane, "#button_Add|Add", lang.hitch(this, this.addButtonClicked));
        }
        
        if (configuration.removeButton) {
            this.buttons.removeButton = widgetSupport.newButton(buttonContentPane, "#button_Remove|Remove", lang.hitch(this, this.removeButtonClicked));
        }
        
        this.navigateCallback = null;
        
        if (configuration.viewButton) {
            // Bind first two arguments to function that will be callback receiving one extra argument
            // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
            var viewButtonClickedPartial = lang.hitch(this, this.viewButtonClicked);
            var viewButtonID = id + "_view";
            this.buttons.viewButton = widgetSupport.newButton(buttonContentPane, "#button_View|View", viewButtonClickedPartial);
            // TODO: Should there be an option of double click as edit?
            // Support double click as view
            this.grid.on("dblclick", viewButtonClickedPartial);
            this.navigateCallback = viewButtonClickedPartial;
        }

        if (configuration.editButton) {
            this.buttons.editButton = widgetSupport.newButton(buttonContentPane, "#button_Edit|Edit", lang.hitch(this, this.editButtonClicked));
        }
        
        if (configuration.duplicateButton) {
            this.buttons.duplicateButton = widgetSupport.newButton(buttonContentPane, "#button_Duplicate|Duplicate", lang.hitch(this, this.duplicateButtonClicked));
        }
             
        if (configuration.moveUpDownButtons) {
            this.buttons.upButton = widgetSupport.newButton(buttonContentPane, "#button_Up|Up", lang.hitch(this, this.upButtonClicked));
            this.buttons.downButton = widgetSupport.newButton(buttonContentPane, "#button_Down|Down", lang.hitch(this, this.downButtonClicked));
        }
        
        if (configuration.customButton) {
            var options = configuration.customButton;
            var customButtonClickedPartial = lang.partial(options.callback, this);
            this.buttons.customButton = widgetSupport.newButton(buttonContentPane, options.customButtonLabel, customButtonClickedPartial);
            if (!configuration.viewButton) {
                this.grid.on("dblclick", customButtonClickedPartial);
            }
        }
         
        if (configuration.navigationButtons) {
            this.buttons.navigateStartButton = widgetSupport.newButton(buttonContentPane, "#button_navigateStart|<<", lang.hitch(this, this.navigateButtonClicked, "start"));
            this.buttons.navigatePreviousButton = widgetSupport.newButton(buttonContentPane, "#button_navigatePrevious|<", lang.hitch(this, this.navigateButtonClicked, "previous"));
            this.buttons.navigateNextButton = widgetSupport.newButton(buttonContentPane, "#button_navigateNext|>", lang.hitch(this, this.navigateButtonClicked, "next"));
            this.buttons.navigateEndButton = widgetSupport.newButton(buttonContentPane, "#button_navigateEnd|>>", lang.hitch(this, this.navigateButtonClicked, "end"));
        }
           
        pagePane.addChild(this.itemContentPane);
        
        this.itemContentPane.set("style", "background-color: #C0C0C0; border: 0.5em solid red; margin-left: 2em; display: none");
        
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

        // Requires the rest of this to be setup, especially this.buttons and this.selectedCount
        this.updateGridButtonsForSelectionAndForm();
    }
    
    GridWithItemPanel.prototype.computeColumnsForItemPanelSpecification = function() {
        var self = this;
        
        var columns = [];
        
        var maxColumnCount = 5;
        var columnCount = 0;
        
        var displayTypesToDisplay = {
           text: true,
           textarea: true,
           select: true,
           radiobuttons: true
        };
        
        var configuration = this.configuration;
        
        var fieldsToInclude = [];
        var panelFields = this.itemPanelSpecification.panelFields;
        
        // Put the columns in the order supplied if using includeAllFields, otherwise put them in order of panel specification
        if (configuration.includeAllFields.constructor === Array) {
            array.forEach(configuration.includeAllFields, function (fieldName) {
                array.forEach(panelFields, function (fieldSpecification) {
                    if (fieldSpecification.id === fieldName) fieldsToInclude.push(fieldSpecification);
                });
            });
        } else {
            array.forEach(panelFields, function (fieldSpecification) {
                var includeField = false;
                if (configuration.includeAllFields) {
                    // TODO: improve this check if need to exclude other fields?
                    if (fieldSpecification.displayType !== "label" && fieldSpecification.displayType !== "header") {
                        fieldsToInclude.push(fieldSpecification);
                    }
                } else {
                    if (columnCount < maxColumnCount) {
                        if (displayTypesToDisplay[fieldSpecification.displayType]) fieldsToInclude.push(fieldSpecification);
                        columnCount++;
                    }
                }
            });
        }
        
        array.forEach(fieldsToInclude, function (fieldSpecification) {
            console.log("includeField", fieldSpecification);
            var newColumn =  {
                field: fieldSpecification.id,
                label: translate(fieldSpecification.id + "::shortName", fieldSpecification.displayName),
                formatter: lang.hitch(self, self.formatObjectsIfNeeded),
                sortable: !configuration.moveUpDownButtons
            };
            columns.push(newColumn);
            console.log("newColumn", newColumn);
        });
        
        return columns;
    };
    
    GridWithItemPanel.prototype.changeItemPanelSpecification = function(itemPanelSpecification) {
        // TODO: Maybe should close any currently open panel?
        this.itemPanelSpecification = itemPanelSpecification;
        var columns = this.computeColumnsForItemPanelSpecification();
        this.grid.set("columns", columns);
    };
    
    GridWithItemPanel.prototype.hideAndDestroyForm = function() {
        // The next line is needed to get rid of duplicate IDs for next time the form is opened:
        this.itemContentPane.set("style", "display: none");
        this.form.destroyRecursive();
        this.form = null;
        this.formType = null;
        this.formItem = null;
        this.updateGridButtonsForSelectionAndForm();
    };

    GridWithItemPanel.prototype.storeItem = function(statefulItem) {
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
    GridWithItemPanel.prototype.openFormForItem = function(formType, item) {
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
        
        this.form = new Form();
        this.formType = formType;
        this.formItem = statefulItem;
        
        this.form.set("style", "width: 800px; height 800px; overflow: auto;");

        this.panelBuilder.buildPanel(this.itemPanelSpecification, this.form, statefulItem);
        
        var borderColor = "green";
        if (formType === "view") {
            borderColor = "blue";
            
            widgetSupport.newButton(this.form, "#button_Done|Done", function() {
                console.log("Done");
                self.hideAndDestroyForm();
            });
            
            /* TODO: Some way to disable editing?
            array.forEach(itemPanelSpecification.panelFields, function (question) {
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
            widgetSupport.newButton(this.form, "#button_OK|OK", lang.hitch(this, this.storeItem, statefulItem));
            widgetSupport.newButton(this.form, "#button_Cancel|Cancel", function() {
                console.log("Cancel chosen");          
                // TODO: Confirm cancel if have entered data    
                self.hideAndDestroyForm();
            });
        }
        
        this.itemContentPane.addChild(this.form);
        
        this.itemContentPane.set("style", "background-color: #C0C0C0; border: 0.25em solid " + borderColor + "; margin: 1em; display: block");
        
        // Need to force the new form to resize so that the embedded grid will size its header correctly and not be zero height and overwritten
        this.form.resize();
        
        this.updateGridButtonsForSelectionAndForm();
    };
    
    GridWithItemPanel.prototype.addButtonClicked = function(event) {
        console.log("add button pressed", event);
        
        var newItem = {};
        var statefulItem = new Stateful(newItem);
        
        this.openFormForItem("add", statefulItem);  
    };
    
    GridWithItemPanel.prototype.getSelectedItemID = function() {
        var selectedItemID = null;
        
        if (debugSelecting) console.log("getSelectedItemID", this.grid.selection);
        for (var theSelection in this.grid.selection) {
            if (this.grid.selection[theSelection]) selectedItemID = theSelection;
        }

        if (debugSelecting) console.log("selectedItemID", selectedItemID);
        return selectedItemID;
    };
    
    GridWithItemPanel.prototype.getSelectedItem = function() {
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
    
    GridWithItemPanel.prototype.viewButtonClicked = function(event) {
        console.log("view button pressed or double click", event);
        
        var selectedItem = this.getSelectedItem();
        console.log("viewButtonClicked selectedItem", selectedItem);
        
        if (!selectedItem) {
            alert("Please select an item to view first");
            return;
        }
        
        this.openFormForItem("view", selectedItem);
    };
    
    GridWithItemPanel.prototype.removeButtonClicked = function(event) {
        var self = this;
        console.log("remove button pressed", event);
        // TODO: translate
        dialogSupport.confirm("Are you sure you want to delete the selected item(s)?", function () {
            console.log("Removal confirmed");
            for (var itemID in self.grid.selection) {
                self.store.remove(itemID);
            }
        });
    };
    
    GridWithItemPanel.prototype.editButtonClicked = function(event) {
        console.log("edit button pressed", event);

        var selectedItem = this.getSelectedItem();
        
        if (!selectedItem) {
            alert("Please select an item to edit first");
            return;
        }
        
        this.openFormForItem("edit", selectedItem);
    };
    
    GridWithItemPanel.prototype.duplicateButtonClicked = function(event) {
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
    
    GridWithItemPanel.prototype.upButtonClicked = function(event) {
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
    
    GridWithItemPanel.prototype.downButtonClicked = function(event) {
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
    
    GridWithItemPanel.prototype.navigateButtonClicked = function(direction, event) {
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
    
    GridWithItemPanel.prototype.formatObjectsIfNeeded = function(item) {
        if (lang.isString(item)) return item;
        if (item === undefined) return "";
        if (item === null) return "";
        return JSON.stringify(item);
    };
    
    GridWithItemPanel.prototype.updateGridButtonsForSelectionAndFormLater = function() {
        // Defer updating until later to ensure grid settles down with sorting
        // otherwise could calculate button status incorrectly
        setTimeout(lang.hitch(this, this.updateGridButtonsForSelectionAndForm), 0);
    };
    
    GridWithItemPanel.prototype.updateGridButtonsForSelectionAndForm = function() {
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
                // console.log("current", selectedItemID, "selectedCount", this.selectedCount, "above", idAbove, "below", idBelow);
                atStart = idAbove === selectedItemID;
                atEnd = idBelow === selectedItemID;
                // console.log("atStart", atStart, "atEnd", atEnd);
            }
        }
        if (buttons.navigateStartButton) buttons.navigateStartButton.set("disabled", atStart);
        if (buttons.navigatePreviousButton) buttons.navigatePreviousButton.set("disabled", atStart || !selectedItemID || this.selectedCount !== 1);
        if (buttons.navigateNextButton) buttons.navigateNextButton.set("disabled", atEnd || !selectedItemID || this.selectedCount !== 1);
        if (buttons.navigateEndButton) buttons.navigateEndButton.set("disabled", atEnd);
    };
    
    // Class level function, so no "prototype"
    GridWithItemPanel.newMemoryTrackableStore = function(data, idProperty) {
        if (!idProperty) idProperty = "id";
        return new (declare([Memory, Trackable]))({
            data: data,
            idProperty: idProperty
        });
    };
    
    return GridWithItemPanel;
    
});