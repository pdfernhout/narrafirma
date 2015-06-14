define([
    "dojo/_base/declare",
    "../dialogSupport",
    'dojo/dom-class',
    "dojox/mvc/getPlainValue",
    "../translate",
    "../../pointrel20150417/generateRandomUuid",
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
], function (declare, dialogSupport, domClass, getPlainValue, translate, generateRandomUuid, widgetSupport, ColumnResizer, DijitRegistry, Form, Keyboard, Memory, Selection, Stateful, Trackable, OnDemandGrid) {
    "use strict";
    var debugSelecting = false;
    // This defines a gui component which has a grid, some buttons, and a detail panel do display the currently selected item or enter a new item
    // TODO: Probably need to prevent user surveys from having a question with a short name of "_id".
    // Possible configuration options
    /*
     var configuration = {
         viewButton: true,
         addButton: true,
         removeButton: true,
         editButton: true,
         duplicateButton: true,
         moveUpDownButtons: true,
         navigationButtons: true,
         includeAllFields: false, // Or ["fieldName1", "fieldName2", ...]
         customButton: {???},
         validateAdd: "methodName",
         validateEdit: "methodName"
    };
     */
    function GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration, model) {
        var self = this;
        console.log("=========== creating GridWithItemPanel with itemPanelSpecification", itemPanelSpecification);
        console.log("constructing GridWithItemPanel", id, dataStore);
        if (!itemPanelSpecification) {
            console.log("Trouble: no itemPanelSpecification", id, pagePane);
        }
        this.configuration = configuration;
        this.panelBuilder = panelBuilder;
        this.model = model;
        this.fieldId = id;
        this.itemPanelSpecification = itemPanelSpecification;
        // The detail form, its type, and the item it is displaying
        this.form = null;
        this.formType = null;
        this.formItem = null;
        this.itemContentPane = panelBuilder.newContentPane();
        domClass.add(this.itemContentPane.domNode, "narrafirma-griditempanel-hidden");
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
        this.grid = new (declare([OnDemandGrid, DijitRegistry, Keyboard, Selection, ColumnResizer]))({
            // "sort": "order",
            collection: this.store,
            columns: columns,
            // Preserve the selections despite refresh needed when move items up or down
            deselectOnRefresh: false
        });
        pagePane.addChild(this.grid);
        var buttonContentPane = panelBuilder.newContentPane();
        pagePane.addChild(buttonContentPane);
        this.grid.on("dgrid-select", function (event) {
            if (debugSelecting)
                console.log("dgrid-select");
            self.updateGridButtonsForSelectionAndForm();
            // Defer updating until later to ensure grid settles down with selecting
            if (configuration.selectCallback)
                setTimeout(function () {
                    configuration.selectCallback(self, self.getSelectedItem());
                }, 0);
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") self.viewButtonClicked(event);
        });
        this.grid.on("dgrid-deselect", function (event) {
            if (debugSelecting)
                console.log("dgrid-deselect");
            self.updateGridButtonsForSelectionAndForm();
            // Defer updating until later to ensure grid settles down with selecting
            if (configuration.selectCallback)
                setTimeout(configuration.selectCallback.bind(null, self, null), 0);
            // TODO: Track first selected item if view open -- this does not work as a deselect called before select always
            // if (grid.formType === "view") self.viewButtonClicked(event);
        });
        this.grid.on("dgrid-sort", function (event) {
            if (debugSelecting)
                console.log("dgrid-sort");
            // Sorting can change the enabling of the navigation buttons
            self.updateGridButtonsForSelectionAndFormLater();
        });
        if (configuration.addButton) {
            this.buttons.addButton = widgetSupport.newButton(buttonContentPane, "#button_Add|Add", this.addButtonClicked.bind(this));
        }
        if (configuration.removeButton) {
            this.buttons.removeButton = widgetSupport.newButton(buttonContentPane, "#button_Remove|Remove", this.removeButtonClicked.bind(this));
        }
        this.navigateCallback = null;
        if (configuration.viewButton) {
            // Bind first two arguments to function that will be callback receiving one extra argument
            // See: http://dojotoolkit.org/reference-guide/1.7/dojo/partial.html
            var viewButtonClickedPartial = this.viewButtonClicked.bind(this);
            var viewButtonID = id + "_view";
            this.buttons.viewButton = widgetSupport.newButton(buttonContentPane, "#button_View|View", this.viewButtonClicked.bind(this, null));
            // TODO: Should there be an option of double click as edit?
            // Support double click as view
            this.grid.on("dblclick", this.viewButtonClicked.bind(this, "forceOpen"));
            this.navigateCallback = this.viewButtonClicked.bind(this, "forceOpen");
        }
        if (configuration.editButton) {
            this.buttons.editButton = widgetSupport.newButton(buttonContentPane, "#button_Edit|Edit", this.editButtonClicked.bind(this));
        }
        if (configuration.duplicateButton) {
            this.buttons.duplicateButton = widgetSupport.newButton(buttonContentPane, "#button_Duplicate|Duplicate", this.duplicateButtonClicked.bind(this));
        }
        if (configuration.moveUpDownButtons) {
            this.buttons.upButton = widgetSupport.newButton(buttonContentPane, "#button_Up|Up", this.upButtonClicked.bind(this));
            this.buttons.downButton = widgetSupport.newButton(buttonContentPane, "#button_Down|Down", this.downButtonClicked.bind(this));
        }
        if (configuration.customButton) {
            var options = configuration.customButton;
            var customButtonClickedPartial;
            if (_.isString(options.callback)) {
                var fakeFieldSpecification = { id: id, displayConfiguration: options.callback, grid: this };
                customButtonClickedPartial = panelBuilder.buttonClicked.bind(panelBuilder, pagePane, model, fakeFieldSpecification);
            }
            else {
                customButtonClickedPartial = options.callback.bind(null, this);
            }
            this.buttons.customButton = widgetSupport.newButton(buttonContentPane, options.customButtonLabel, customButtonClickedPartial);
            if (!configuration.viewButton) {
                this.grid.on("dblclick", customButtonClickedPartial);
            }
        }
        if (configuration.navigationButtons) {
            this.buttons.navigateStartButton = widgetSupport.newButton(buttonContentPane, "#button_navigateStart|<<", this.navigateButtonClicked.bind(this, "start"));
            this.buttons.navigatePreviousButton = widgetSupport.newButton(buttonContentPane, "#button_navigatePrevious|<", this.navigateButtonClicked.bind(this, "previous"));
            this.buttons.navigateNextButton = widgetSupport.newButton(buttonContentPane, "#button_navigateNext|>", this.navigateButtonClicked.bind(this, "next"));
            this.buttons.navigateEndButton = widgetSupport.newButton(buttonContentPane, "#button_navigateEnd|>>", this.navigateButtonClicked.bind(this, "end"));
        }
        pagePane.addChild(this.itemContentPane);
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
        // Requires the rest of this to be setup, especially this.buttons
        this.updateGridButtonsForSelectionAndForm();
    }
    GridWithItemPanel.prototype.computeColumnsForItemPanelSpecification = function () {
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
        if (configuration.includeAllFields && configuration.includeAllFields.constructor === Array) {
            configuration.includeAllFields.forEach(function (fieldName) {
                panelFields.forEach(function (fieldSpecification) {
                    if (fieldSpecification.id === fieldName)
                        fieldsToInclude.push(fieldSpecification);
                });
            });
        }
        else {
            panelFields.forEach(function (fieldSpecification) {
                var includeField = false;
                if (configuration.includeAllFields) {
                    // TODO: improve this check if need to exclude other fields?
                    if (fieldSpecification.displayType !== "label" && fieldSpecification.displayType !== "header") {
                        fieldsToInclude.push(fieldSpecification);
                    }
                }
                else {
                    if (columnCount < maxColumnCount) {
                        if (displayTypesToDisplay[fieldSpecification.displayType])
                            fieldsToInclude.push(fieldSpecification);
                        columnCount++;
                    }
                }
            });
        }
        fieldsToInclude.forEach(function (fieldSpecification) {
            // console.log("includeField", fieldSpecification);
            var newColumn = {
                field: fieldSpecification.id,
                label: translate(fieldSpecification.id + "::shortName", fieldSpecification.displayName),
                formatter: self.formatObjectsIfNeeded.bind(this),
                sortable: !configuration.moveUpDownButtons,
            };
            columns.push(newColumn);
            // console.log("newColumn", newColumn);
        });
        return columns;
    };
    GridWithItemPanel.prototype.changeItemPanelSpecification = function (itemPanelSpecification) {
        // TODO: Maybe should close any currently open panel?
        this.itemPanelSpecification = itemPanelSpecification;
        var columns = this.computeColumnsForItemPanelSpecification();
        this.grid.set("columns", columns);
    };
    // Call this to deal with probable dgrid bug that it can't handle store data changing and also so rest of GUI will update
    GridWithItemPanel.prototype.dataStoreChanged = function (newDataStore) {
        this.grid.clearSelection();
        this.grid.set("collection", newDataStore);
        if (this.formType === "add") {
            // TODO: Not sure what to do about add or edit in progress... Just leaving them there for now...
            this.hideAndDestroyForm();
        }
        else {
            this.updateGridButtonsForSelectionAndForm();
        }
    };
    GridWithItemPanel.prototype.hideAndDestroyForm = function () {
        domClass.add(this.itemContentPane.domNode, "narrafirma-griditempanel-hidden");
        domClass.remove(this.itemContentPane.domNode, "narrafirma-griditempanel-viewing");
        domClass.remove(this.itemContentPane.domNode, "narrafirma-griditempanel-editing");
        // The next line is needed to get rid of duplicate IDs for next time the form is opened:
        this.form.destroyRecursive();
        this.form = null;
        this.formType = null;
        this.formItem = null;
        this.updateGridButtonsForSelectionAndForm();
    };
    GridWithItemPanel.prototype.sendFieldChangedMessageToModel = function (statefulItem) {
        if (this.model && this.fieldId) {
            // Try to signal to any watches that the array has changed
            this.model.set(this.fieldId, this.model.get(this.fieldId));
        }
    };
    GridWithItemPanel.prototype.storeItem = function (statefulItem) {
        console.log("OK clicked", statefulItem);
        var plainValue = getPlainValue(statefulItem);
        console.log("grid plainValue", plainValue);
        if (this.configuration.validateEdit) {
        }
        var validationMethodIdentifier = this.configuration.validateEdit;
        if (this.formType === "add")
            validationMethodIdentifier = this.configuration.validateAdd || validationMethodIdentifier;
        if (validationMethodIdentifier) {
            var fakeFieldSpecification = {
                displayConfiguration: validationMethodIdentifier,
                value: plainValue
            };
            var errors = this.panelBuilder.calculateFunctionResult(null, null, fakeFieldSpecification);
            if (errors) {
                // TODO: Translate
                alert("There are validation errors:\n" + errors);
                return;
            }
        }
        if (this.formType === "add") {
            this.store.add(plainValue);
        }
        else {
            this.store.put(plainValue);
        }
        this.sendFieldChangedMessageToModel();
        console.log("put store for add form");
        this.hideAndDestroyForm();
        console.log("shut down add form");
    };
    // formType can be view, add, edit
    GridWithItemPanel.prototype.openFormForItem = function (formType, item) {
        var self = this;
        console.log("openFormForItem", item);
        var statefulItem = new Stateful(item);
        if (this.form) {
            // Already have a panel displayed for either view or add
            console.log("Panel already displayed", this.formType, this.form);
            if (this.formType !== "view") {
                // TODO: Translate
                //alert("Item change already in progress; please cancel form first");
                alert("You are editing this item. Please choose OK or Cancel \nat the bottom of the form before you do anything else.");
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
        domClass.add(this.form.domNode, "narrafirma-griditempanel-form");
        // TODO: Should confirm close if editing or adding
        // TODO: Should have a close icon with X instead of cancel
        // var closeBox = widgetSupport.newButton(this.form, "#button_Close|Close", this.hideAndDestroyForm.bind(this));
        // Doesn't work: closeBox.set("style", "text-align: right;");
        this.panelBuilder.buildPanel(this.itemPanelSpecification, this.form, statefulItem);
        if (formType === "view") {
            widgetSupport.newButton(this.form, "#button_Done|Done", function () {
                console.log("Done");
                self.hideAndDestroyForm();
            });
        }
        else {
            widgetSupport.newButton(this.form, "#button_OK|OK", this.storeItem.bind(this, statefulItem));
            widgetSupport.newButton(this.form, "#button_Cancel|Cancel", function () {
                console.log("Cancel chosen");
                // TODO: Confirm cancel if have entered data    
                self.hideAndDestroyForm();
            });
        }
        this.itemContentPane.addChild(this.form);
        if (formType === "view") {
            domClass.remove(this.itemContentPane.domNode, "narrafirma-griditempanel-hidden");
            domClass.remove(this.itemContentPane.domNode, "narrafirma-griditempanel-editing");
            domClass.add(this.itemContentPane.domNode, "narrafirma-griditempanel-viewing");
        }
        else {
            domClass.remove(this.itemContentPane.domNode, "narrafirma-griditempanel-hidden");
            domClass.remove(this.itemContentPane.domNode, "narrafirma-griditempanel-viewing");
            domClass.add(this.itemContentPane.domNode, "narrafirma-griditempanel-editing");
        }
        // Need to force the new form to resize so that the embedded grid will size its header correctly and not be zero height and overwritten
        this.form.resize();
        this.updateGridButtonsForSelectionAndForm();
    };
    GridWithItemPanel.prototype.addButtonClicked = function (event) {
        console.log("add button pressed", event);
        var newItem = {};
        var uniqueItemID = generateRandomUuid();
        var idProperty = this.store.idProperty;
        newItem[idProperty] = uniqueItemID;
        this.openFormForItem("add", newItem);
    };
    GridWithItemPanel.prototype.getSelectedItemID = function () {
        var selectedItemID = null;
        if (debugSelecting)
            console.log("getSelectedItemID", this.grid.selection);
        for (var theSelection in this.grid.selection) {
            if (this.grid.selection[theSelection])
                selectedItemID = theSelection;
        }
        if (debugSelecting)
            console.log("selectedItemID", selectedItemID);
        return selectedItemID;
    };
    GridWithItemPanel.prototype.getSelectedCount = function () {
        var selectedCount = 0;
        for (var theSelection in this.grid.selection) {
            if (this.grid.selection[theSelection])
                selectedCount++;
        }
        if (debugSelecting)
            console.log("selectedCount", selectedCount);
        return selectedCount;
    };
    GridWithItemPanel.prototype.getSelectedItem = function () {
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
        matches.forEach(function (item) {
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
    GridWithItemPanel.prototype.viewButtonClicked = function (forceOpen, event) {
        console.log("view button pressed or double click", event);
        var selectedItem = this.getSelectedItem();
        console.log("viewButtonClicked selectedItem", selectedItem);
        if (!selectedItem) {
            alert("Please select an item to view first");
            return;
        }
        if (!forceOpen && this.formType === "view") {
            // Toggle the view
            this.hideAndDestroyForm();
        }
        else {
            this.openFormForItem("view", selectedItem);
        }
    };
    GridWithItemPanel.prototype.removeButtonClicked = function (event) {
        var self = this;
        console.log("remove button pressed", event);
        // TODO: translate
        dialogSupport.confirm("Are you sure you want to delete the selected item(s)?", function () {
            console.log("Removal confirmed");
            for (var itemID in self.grid.selection) {
                self.store.remove(itemID);
            }
            self.sendFieldChangedMessageToModel();
        });
    };
    GridWithItemPanel.prototype.editButtonClicked = function (event) {
        console.log("edit button pressed", event);
        var selectedItem = this.getSelectedItem();
        if (!selectedItem) {
            alert("Please select an item to edit first");
            return;
        }
        this.openFormForItem("edit", selectedItem);
    };
    GridWithItemPanel.prototype.duplicateButtonClicked = function (event) {
        console.log("duplicate button pressed", event);
        var selectedItem = this.getSelectedItem();
        if (!selectedItem) {
            alert("Please select an item to duplicate first");
            return;
        }
        // Make a copy of the selected item
        var newItem = JSON.parse(JSON.stringify(selectedItem));
        // Set new id for copy
        var uniqueItemID = generateRandomUuid();
        var idProperty = this.store.idProperty;
        newItem[idProperty] = uniqueItemID;
        this.openFormForItem("add", newItem);
    };
    GridWithItemPanel.prototype.upButtonClicked = function (event) {
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
                }
                else {
                    lastSelectedObjectLocation = i;
                }
            }
        }
        // Tell grid to update for moved items
        this.grid.refresh();
        this.sendFieldChangedMessageToModel();
    };
    GridWithItemPanel.prototype.downButtonClicked = function (event) {
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
                }
                else {
                    lastSelectedObjectLocation = i;
                }
            }
        }
        // Tell grid to update for moved items
        this.grid.refresh();
        this.sendFieldChangedMessageToModel();
    };
    GridWithItemPanel.prototype.navigateButtonClicked = function (direction, event) {
        if (debugSelecting)
            console.log("navigate button pressed", direction);
        var selectedItemID = this.getSelectedItemID();
        var nextRow = null;
        // TODO: Kludge of going to end at moving a million times, but would fail if more than a million items
        if (direction === "start") {
            nextRow = this.grid.up(selectedItemID, 1000000, true);
        }
        else if (direction === "previous" && selectedItemID) {
            nextRow = this.grid.up(selectedItemID, 1, true);
        }
        else if (direction === "next" && selectedItemID) {
            nextRow = this.grid.down(selectedItemID, 1, true);
        }
        else if (direction === "end") {
            nextRow = this.grid.down(selectedItemID, 1000000, true);
        }
        if (nextRow) {
            if (selectedItemID)
                this.grid.deselect(selectedItemID);
            this.grid.select(nextRow);
            if (debugSelecting)
                console.log("nextRow", nextRow);
            // This next commented line moves the entire window, which is not what we want; maybe a bug in dgrid?
            // nextRow.element.scrollIntoView();
            // TODO: This behavior is not ideal, because it moves the grid even when the item is visible
            this.grid.scrollTo({ y: this.grid.rowHeight * nextRow.element.rowIndex });
            if (this.formType === "view" && this.navigateCallback)
                this.navigateCallback();
        }
    };
    GridWithItemPanel.prototype.formatObjectsIfNeeded = function (item) {
        if (_.isString(item))
            return item;
        if (item === undefined)
            return "";
        if (item === null)
            return "";
        return JSON.stringify(item);
    };
    GridWithItemPanel.prototype.updateGridButtonsForSelectionAndFormLater = function () {
        // Defer updating until later to ensure grid settles down with sorting
        // otherwise could calculate button status incorrectly
        setTimeout(this.updateGridButtonsForSelectionAndForm.bind(this), 0);
    };
    GridWithItemPanel.prototype.updateGridButtonsForSelectionAndForm = function () {
        var buttons = this.buttons;
        var selectedCount = this.getSelectedCount();
        var hasSelection = selectedCount !== 0;
        if (debugSelecting)
            console.log("hasSelection selectedCount", hasSelection, selectedCount);
        var isAdding = (this.formType === "add");
        var isEditing = (this.formType === "edit");
        if (buttons.addButton)
            buttons.addButton.set("disabled", isAdding || isEditing);
        // disable other buttons if in the middle of adding a new item or if no selection; otherwise enable
        if (isAdding)
            hasSelection = false;
        if (buttons.viewButton)
            buttons.viewButton.set("disabled", !hasSelection || isEditing);
        if (buttons.removeButton)
            buttons.removeButton.set("disabled", !hasSelection || isEditing);
        if (buttons.editButton)
            buttons.editButton.set("disabled", !hasSelection || isEditing);
        if (buttons.duplicateButton)
            buttons.duplicateButton.set("disabled", !hasSelection || isEditing);
        if (buttons.upButton)
            buttons.upButton.set("disabled", !hasSelection || isEditing);
        if (buttons.downButton)
            buttons.downButton.set("disabled", !hasSelection || isEditing);
        if (buttons.customButton)
            buttons.customButton.set("disabled", !hasSelection || isEditing);
        // enabling for navigate buttons based on whether can move up or down in list in current sort order
        var atStart = true;
        var atEnd = true;
        var selectedItemID = this.getSelectedItemID();
        if (selectedItemID !== null) {
            var row = this.grid.row(selectedItemID);
            if (row) {
                var idAbove = this.grid.up(row, 1, true).id;
                var idBelow = this.grid.down(row, 1, true).id;
                if (debugSelecting)
                    console.log("current", selectedItemID, "selectedCount", selectedCount, "above", idAbove, "below", idBelow);
                atStart = idAbove === selectedItemID;
                atEnd = idBelow === selectedItemID;
                if (debugSelecting)
                    console.log("atStart", atStart, "atEnd", atEnd);
            }
        }
        if (buttons.navigateStartButton)
            buttons.navigateStartButton.set("disabled", atStart || isEditing || isAdding);
        if (buttons.navigatePreviousButton)
            buttons.navigatePreviousButton.set("disabled", atStart || !selectedItemID || selectedCount !== 1 || isEditing || isAdding);
        if (buttons.navigateNextButton)
            buttons.navigateNextButton.set("disabled", atEnd || !selectedItemID || selectedCount !== 1 || isEditing || isAdding);
        if (buttons.navigateEndButton)
            buttons.navigateEndButton.set("disabled", atEnd || isEditing || isAdding);
    };
    // Class level function, so no "prototype"
    GridWithItemPanel.newMemoryTrackableStore = function (data, idProperty) {
        if (!idProperty)
            idProperty = "id";
        return new (declare([Memory, Trackable]))({
            data: data,
            idProperty: idProperty
        });
    };
    return GridWithItemPanel;
});
