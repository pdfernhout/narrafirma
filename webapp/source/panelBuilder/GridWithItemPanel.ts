import m = require("mithril");
import translate = require("./translate");
import PanelBuilder = require("panelBuilder/PanelBuilder");
import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import TripleStore = require("../pointrel20150417/TripleStore");
import valuePathResolver = require("./valuePathResolver");
import Globals = require("../Globals");
import _ = require("lodash");

"use strict";

// This defines a gui component which has a grid, some buttons, and a detail panel do display the currently selected item or enter a new item

// TODO: Probably need to prevent user surveys from having a question with a short name of "_id".

var gridsMade = 0;

var displayTypesToDisplayAsColumns = {
   text: true,
   textarea: true,
   select: true,
   radiobuttons: true
};

function computeColumnsForItemPanelSpecification(itemPanelSpecification, gridConfiguration: GridConfiguration) {
    // var self = this;
    
    var columns = [];
    
    var panelFields = itemPanelSpecification.panelFields;
    
    if (!panelFields || !gridConfiguration) return columns;
    
    var maxColumnCount = 5;
    var columnCount = 0;
    
    var fieldsToInclude = [];
    
    var columnsToDisplay = gridConfiguration.columnsToDisplay;
    
    // Put the columns in the order supplied if using columnsToDisplay, otherwise put them in order of panel specification
    if (columnsToDisplay && columnsToDisplay.constructor === Array) {
        (<Array<string>>columnsToDisplay).forEach(function (fieldName) {
            panelFields.forEach(function (fieldSpecification) {
                if (fieldSpecification.id === fieldName) fieldsToInclude.push(fieldSpecification);
            });
        });
    } else {
        panelFields.forEach(function (fieldSpecification) {
            var includeField = false;
            if (columnsToDisplay) {
                // TODO: improve this check if need to exclude other fields?
                if (fieldSpecification.displayType !== "label" && fieldSpecification.displayType !== "header") {
                    fieldsToInclude.push(fieldSpecification);
                }
            } else {
                if (columnCount < maxColumnCount) {
                    if (displayTypesToDisplayAsColumns[fieldSpecification.displayType]) fieldsToInclude.push(fieldSpecification);
                    columnCount++;
                }
            }
        });
    }
    
    fieldsToInclude.forEach(function (fieldSpecification) {
        // console.log("includeField", fieldSpecification);
        var newColumn =  {
            field: fieldSpecification.id,
            label: translate(fieldSpecification.id + "::shortName", fieldSpecification.displayName)
            // formatter: self.formatObjectsIfNeeded.bind(this),
            // sortable: !configuration.moveUpDownButtons
        };
        columns.push(newColumn);
        // console.log("newColumn", newColumn);
    });
    
    return columns;
}

function isElementInViewport(parent, element) {
    var elementRect = element.getBoundingClientRect();
    var parentRect = parent.getBoundingClientRect();
    return (
        elementRect.top >= parentRect.top &&
        elementRect.left >= parentRect.left &&
        elementRect.bottom <= parentRect.bottom &&
        elementRect.right <= parentRect.right
    );
}

// TODO: This code is not currently used and probably can be removed
function formatObjectsIfNeeded(item) {
    if (_.isString(item)) return item;
    if (item === undefined) return "";
    if (item === null) return "";
    return JSON.stringify(item);
}

class ItemPanel {
    
    static controller(args) {
        // console.log("Making ItemPanel: ", args);
        return new ItemPanel();
    }
    
    static view(controller, args) {
        // console.log("ItemPanel view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        // console.log("%%%%%%%%%%%%%%%%%%% ItemPanel view called");
        // return m("div", "work in progress");
        // TODO: Should provide copy of item?
        var panelBuilder: PanelBuilder = args.panelBuilder;
        // Possible recursion if the panels contain a table
        
        var theClass = "narrafirma-griditempanel-viewing";
        if (args.mode === "edit") {
            theClass = "narrafirma-griditempanel-editing";  
        }
        
        var oldReadOnly = panelBuilder.readOnly;
        if (args.mode === "view") {
            panelBuilder.readOnly = true;
        }
        try {
            var div = m("div", {"class": theClass}, panelBuilder.buildPanel(args.grid.itemPanelSpecification, args.item));
            return div;
        } finally {
            panelBuilder.readOnly = oldReadOnly;
        }
    }
}

var defaultGridConfiguration: GridConfiguration = {
    idProperty: undefined,
    
    viewButton: true,
    addButton: true,
    removeButton: true,
    editButton: true,
    columnsToDisplay: false,
    inlineButtons: false,
    navigationButtons: false,
    
    // Flag for whether removing an item then selects the next item after it
    // This flag makes it easy to quickly delete a lot of items, which is maybe not good in some cases
    shouldNextItemBeSelectedAfterItemRemoved: false,
   
    customButton: null,
    validateAdd: null,
    validateEdit: null,
    duplicateButton: false,

    // TODO: Need to make work:
    moveUpDownButtons: false
};

// Thin arrows
// var sortCharacterUp = "\u2191";
// var sortCharacterDown = "\u2193";
// var sortCharacterBoth = "\u2195";

// Thick arrows
var sortCharacterUp = "\u25B2";
var sortCharacterDown = "\u25BC";
// Blank space equal to 1em
var sortCharacterBoth = "\u2003";

// GridWithItemPanel needs to be a component so it can maintain a local sorted list
class GridWithItemPanel {
    
    gridID = "grid_" + (++gridsMade);
    
    gridConfiguration: GridConfiguration = null;
    dataStore: DataStore;
    columns = [];
    fieldSpecification = null;
    itemPanelSpecification = null;
    idProperty: string = "_id";
    model = null;
    valueProperty: Function;
    panelBuilder: PanelBuilder = null;
    
    // viewing, editing, adding
    displayMode = null;
    
    // TODO: Multiple select
    private selectedItem = null;
    
    isNavigationalScrollingNeeded: string = null;
    
    doubleClickAction = null;
    
    sortBy: string = null;
    sortDirection: string = "ascending";
    
    readOnly = false;
    
    onunload() {
        // console.log("+++++++++++++++++++++++++++++++++++++ unloading GridWithItemPanel");
    }
    
    constructor(args) {
        // console.log("************************************** GridWithItemPanel constructor called");
        this.panelBuilder = args.panelBuilder;
        this.fieldSpecification = args.fieldSpecification;
        this.model = args.model;
        this.readOnly = args.readOnly;
        
        // console.log("Grid readOnly =", this.readOnly, this.fieldSpecification.id);
            
        this.updateDisplayConfigurationAndData(this.fieldSpecification.displayConfiguration);
    }
    
    updateDisplayConfigurationAndData(theDisplayConfiguration: GridDisplayConfiguration) {
        // console.log("theDisplayConfiguration", theDisplayConfiguration);
        var itemPanelID: string;
        var itemPanelSpecification = null;
        
        if (_.isString(theDisplayConfiguration)) {
            itemPanelID = <any>theDisplayConfiguration;
            this.gridConfiguration = defaultGridConfiguration;
        } else {
            itemPanelID = theDisplayConfiguration.itemPanelID;
            if (theDisplayConfiguration.gridConfiguration) {
                this.gridConfiguration = theDisplayConfiguration.gridConfiguration;
            } else {
                this.gridConfiguration = defaultGridConfiguration;
            }
            itemPanelSpecification = theDisplayConfiguration.itemPanelSpecification;
        }
   
        if (!itemPanelSpecification && itemPanelID) {
            itemPanelSpecification = this.panelBuilder.getPanelDefinitionForPanelID(itemPanelID);
        }
        this.itemPanelSpecification = itemPanelSpecification;
        
        if (!this.itemPanelSpecification) {
            console.log("Trouble: no itemPanelSpecification for options: ", this.fieldSpecification);
        }
        
        if (!this.model) {
            console.log("Error: no model is defined for grid", this.fieldSpecification);
            throw new Error("Error: no model is defined for grid");
        }
        
        if (this.gridConfiguration.idProperty) this.idProperty = this.gridConfiguration.idProperty;
        
        this.columns = computeColumnsForItemPanelSpecification(this.itemPanelSpecification, this.gridConfiguration);
        if (this.columns.length) {
            this.sortBy = this.columns[0].field;
        }
        
        // viewing, editing
        this.displayMode = null;
        
        // TODO: Multiple select
        this.setSelectedItem(null);
        
        this.isNavigationalScrollingNeeded = null;
        
        this.valueProperty = valuePathResolver.newValuePathForFieldSpecification(this.model, this.fieldSpecification);
        
        var itemClassName = itemPanelSpecification.modelClass;
        if (!itemClassName) {
            console.log("ERROR: No modelClass in panel specification", itemPanelSpecification);
            throw new Error("ERROR: No modelClass in panel specification for grid");
            // itemClassName = "Item";
        }
        var setClassName = itemPanelSpecification.modelClass + "Set";
        
        if (this.useTriples()) {
            // console.log("Grid using triples", this.model);
            this.dataStore = new TripleSetDataStore(this.valueProperty, this.idProperty, this.gridConfiguration.transformDisplayedValues, setClassName, itemClassName, Globals.project().tripleStore);
        } else {
            // console.log("Grid using objects", this.model);
            this.dataStore = new DataStore(this.valueProperty, this.idProperty, this.gridConfiguration.transformDisplayedValues, setClassName, itemClassName);
        }
        this.updateData();
    }
    
    updateData() {
        // console.log("GridWithItemPanel updateData");
        this.dataStore.getDataArrayFromModel();
        this.sortData();
        if (this.selectedItem) {
            if (this.dataStore.data.indexOf(this.selectedItem) === -1) {
                this.setSelectedItem(null);
            }
        }
    }
      
    private sortData() {
        // TODO: This may need work for set???
        this.dataStore.sortData(this.sortBy, this.sortDirection);
    }
    
    static controller(args) {
        // console.log("Making ItemPanel: ", args);
        return new GridWithItemPanel(args);
    }
    
    static view(controller: GridWithItemPanel, args) {
        // console.log("Grid view called");
        
        return controller.calculateView();
    }
    
    addNavigationButtons(buttons) {
        // TODO: Improve navigation enabling
        var navigationDisabled = this.isEditing() || this.dataStore.isEmpty() || undefined;
        buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "start"), disabled: navigationDisabled}, translate("#button_navigateStart|[<<")));
        buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "previous"), disabled: navigationDisabled}, translate("#button_navigatePrevious|<")));
        buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "next"), disabled: navigationDisabled}, translate("#button_navigateNext|>")));
        buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "end"), disabled: navigationDisabled}, translate("#button_navigateEnd|>>]")));
    }
    
    calculateView() {
        // console.log("GridWithItemPanel calculateView", this.dataStore);
        
        // Deal with the fact that new items might be added at any time by other users
        // TODO: This is very inefficient. Alternatives include: listening for changes that add or remove items; or determing nature of change prompting redraw
        this.updateData();
        
        var panelBuilder = this.panelBuilder;
        
        var columnHeaders = this.columns.map((column) => {
            var sortCharacter = sortCharacterBoth;
            if (column.field === this.sortBy) {
                if (this.sortDirection === "ascending") {
                    sortCharacter = sortCharacterDown;
                } else if (this.sortDirection === "descending") {
                    sortCharacter = sortCharacterUp;
                }
            }
            return m("th[data-sort-by=" + column.field  + "]", {"text-overflow": "ellipsis"}, column.label + sortCharacter);
        });
        
        if (this.gridConfiguration.inlineButtons) {
            columnHeaders.push(m("th", ""));
        }
        
        var table = m("table.scrolling", this.tableConfigurationWithSortingOnHeaderClick(), [
            m("tr", {"class": "grid-header-row"}, columnHeaders),
            this.dataStore.map((item, index) => {
                return this.rowForItem(item, index);
            })
        ]);
        
        var addButtonDisabled = this.readOnly || this.isEditing() || undefined;
        
        var buttons = [];
        if (this.gridConfiguration.addButton) {
            var addButton = m("button", {onclick: this.addItem.bind(this), disabled: addButtonDisabled}, translate("#button_Add|Add"));
            buttons.push(addButton);
        }
        
        if (!this.gridConfiguration.inlineButtons) {
            buttons = buttons.concat(this.createButtons());
        }
        
        if (this.gridConfiguration.navigationButtons) {
            this.addNavigationButtons(buttons);
        }
        
        var buttonPanel = m("div.narrafirma-button-panel", buttons);
        
        var parts = [m("div.narrafirm-grid", [table]), buttonPanel];
        
        if (this.isViewing()) {
            parts.push(this.bottomEditorForItem(panelBuilder, this.selectedItem, "view"));
        }
        
        if (this.isEditing()) {
            parts.push(this.bottomEditorForItem(panelBuilder, this.selectedItem, "edit"));
        }
        
        // TODO: set class etc.
        return m("div", {"class": "questionExternal narrafirma-question-type-grid"}, parts);
    }

    private tableConfigurationWithSortingOnHeaderClick() {
        return {
            onclick: (e) => {
                var sortBy = e.target.getAttribute("data-sort-by");
                if (sortBy) {
                    // Sorting derived from: http://lhorie.github.io/mithril-blog/vanilla-table-sorting.htm
                    // Don't sort if have move up/down buttons
                    if (this.gridConfiguration.moveUpDownButtons) return;

                    // console.log("Sorting by", sortBy);
                    if (this.sortBy === sortBy) {
                        if (this.sortDirection === "ascending") {
                            this.sortDirection = "descending";
                            this.dataStore.reverseData();
                        } else {
                            this.sortDirection = "ascending";
                            this.dataStore.reverseData();
                        }
                    } else {
                        this.sortBy = sortBy;
                        this.sortDirection = "ascending";
                        this.sortData();
                    }
                } else {
                    this.selectItemInList(e);
                }
            },
            ondblclick: (e) => {
                var prop = e.target.getAttribute("data-sort-by");
                if (!prop) {
                    if (this.selectedItem && this.doubleClickAction) {
                        this.doubleClickAction(this.selectedItem);
                    }
                }
            },
            config: this.ensureTableRowIsVisibleConfig.bind(this)
        };
    }
    
    private selectItemInList(e) {
        if (this.isEditing()) return;
        var itemID = e.target.getAttribute("data-item-index");
        // console.log("item clicked", itemID);
        var item = this.dataStore.itemForId(itemID);
        if (item !== undefined) {
            this.setSelectedItem(item);
            if (this.gridConfiguration.viewButton) {
                this.displayMode = "viewing";
            }
        }
    }
    
    setSelectedItem(item) {
        this.selectedItem = item;
        
        if (this.gridConfiguration.selectCallback) {
            this.gridConfiguration.selectCallback(this.selectedItem);
        } 
    }

    private isEditing() {
        return (this.displayMode === "editing" || this.displayMode === "adding") && this.selectedItem;
    }
    
    private isViewing() {
        return (this.displayMode === "viewing") && this.selectedItem;
    }
    
    getSelectedItem() {
        return this.selectedItem;
    }
    
    private validateItem(item) {
        var validationMethodIdentifier = this.gridConfiguration.validateEdit;
        if (this.displayMode === "adding") validationMethodIdentifier = this.gridConfiguration.validateAdd || validationMethodIdentifier;
        if (validationMethodIdentifier) {
            var fakeFieldSpecification = {
                displayConfiguration: validationMethodIdentifier,
                value: item
           };
            var errors = this.panelBuilder.calculateFunctionResult(null, fakeFieldSpecification);
            if (!errors) return [];
            return errors;
        }
        return [];
    }
    
    // inlineEditorForItem is not currently used...
    private inlineEditorForItem(panelBuilder, item, mode) {
        return m("tr", [
            m("td", {colSpan: this.columns.length}, [
                m.component(<any>ItemPanel, {key: this.fieldSpecification.id + "_" + "inlineEditor" + "_" + mode, panelBuilder: panelBuilder, item: item, grid: this, mode: mode})
            ]),
            m("td", {"vertical-align": "top"}, [m("button", {onclick: this.doneClicked.bind(this, item)}, "close")])
        ]);
    }
    
    private bottomEditorForItem(panelBuilder, item, mode) {
        return m("div", [
            m("td", {colSpan: this.columns.length}, [
                m.component(<any>ItemPanel, {key: this.fieldSpecification.id + "_" + "bottomEditor" + "_" + mode, panelBuilder: panelBuilder, item: item, grid: this, mode: mode})
            ]),
            m("td", {"vertical-align": "top"}, [m("button", {onclick: this.doneClicked.bind(this, item)}, "close")])
        ]);
    }

    // Event handlers
    
    private addItem() {
        var newItem = this.dataStore.makeNewItem();
        this.setSelectedItem(newItem);
        this.displayMode = "adding";
    }
    
    private deleteItem(item) {
        if (!item) item = this.selectedItem; 
        // console.log("deleteItem", item);
        
        // TODO: Translate
        // TODO: Replace this with undo
        if (!confirm("Are you sure you want to delete this item?")) return;

        var index = this.dataStore.deleteItem(item);
        
        if (item === this.selectedItem) {
            this.setSelectedItem(null);
            
            if (this.gridConfiguration.shouldNextItemBeSelectedAfterItemRemoved) {
                if (index === this.dataStore.length()) {
                    index = index - 1;
                }  
                if (!this.dataStore.isEmpty()) {
                    this.setSelectedItem(this.dataStore.itemForIndex(index));
                } else {
                   this.setSelectedItem(null);
                }
                this.isNavigationalScrollingNeeded = "delete";
            }
        }
    }
    
    private editItem(item) {
        if (!item) item = this.selectedItem;
        // console.log("editItem", item);
        
       // TODO: This needs to create an action that affects original list  
        this.setSelectedItem(item);
        this.displayMode = "editing";
    }
    
    private viewItem(item, index) {
        if (!item) item = this.selectedItem;
        // console.log("viewItem", item);
        
        this.setSelectedItem(item);
        this.displayMode = "viewing";
    }
    
    private duplicateItem(item) {        
        if (!item) item = this.selectedItem;
        // console.log("duplicate button pressed", item);
        
        // TODO: May not need this
        if (this.isEditing) {
            alert("The edit must be finished before duplicating an item");
            return;
        }

        if (!item) {
            alert("Please select an item to duplicate first");
            return;
        }
        
        var newItem = this.dataStore.makeCopyOfItemWithNewId(item);
        
        this.setSelectedItem(newItem);
        this.displayMode = "adding";
    }

    private moveItemUp(item) {
        if (!item) item = this.selectedItem;
        // console.log("up button pressed", item);
        
        this.dataStore.moveItemUp(item);
    }
    
    private moveItemDown(item) {
        if (!item) item = this.selectedItem;
        // console.log("down button pressed", item);
        
        this.dataStore.moveItemDown(item);
    }
    
    private doneClicked(item) {
        // TODO: Should ensure the data is saved
        if (this.isEditing) {
            var errors = this.validateItem(item);
            if (errors.length) {
                // TODO: Translate
                alert("There are validation errors:\n" + errors);
                return;
            }
        }
        // Leave item selected: this.setSelection(null);
        this.displayMode = null;
    }
    
    navigateClicked(direction: string) {
        if (this.dataStore.isEmpty()) return;
        var newPosition;
        switch (direction) {
            case "start":
                newPosition = 0;
                break;
            case "previous":
                newPosition = this.dataStore.indexOf(this.selectedItem);
                if (newPosition === -1) newPosition = 0;
                if (newPosition > 0) newPosition--;
                break;
            case "next":
                newPosition = this.dataStore.indexOf(this.selectedItem);
                if (newPosition < this.dataStore.length() - 1) newPosition++;
                break;
            case "end":
                newPosition = this.dataStore.length() - 1;
                break;
            default:
               throw new Error("Unexpected direction: " + direction);
        }
        this.setSelectedItem(this.dataStore.itemForIndex(newPosition));
        this.isNavigationalScrollingNeeded = direction;
    }
    
    private createButtons(item = undefined) {
        var buttons = [];
       
        var unavailable = this.isEditing() || (!item && !this.selectedItem) || undefined;
        var disabled = this.readOnly || unavailable;
        
        // console.log("createButtons disabled", disabled, item, this.selectedItem, (!item && !this.selectedItem) );
         
        if (this.gridConfiguration.removeButton) {
            var removeButton = m("button", {onclick: this.deleteItem.bind(this, item), disabled: disabled, "class": "fader"}, translate("#button_Remove|Remove"));
            buttons.push(removeButton);
        }

        if (this.gridConfiguration.editButton) {
            var editButton = m("button", {onclick: this.editItem.bind(this, item), disabled: disabled, "class": "fader"}, translate("#button_Edit|Edit"));
            buttons.push(editButton);
        }
        
        if (this.gridConfiguration.viewButton) {
            var viewButton = m("button", {onclick: this.viewItem.bind(this, item), disabled: unavailable, "class": "fader"}, translate("#button_View|View"));
            buttons.push(viewButton); 
        }
        
        if (this.gridConfiguration.duplicateButton) {
            var duplicateButton = m("button", {onclick: this.duplicateItem.bind(this, item), disabled: disabled}, translate("#button_Duplicate|Duplicate"));
            buttons.push(duplicateButton);
        }
             
        if (this.gridConfiguration.moveUpDownButtons) {
            var upButton = m("button", {onclick: this.moveItemUp.bind(this, item), disabled: disabled}, translate("#button_Up|Up"));
            buttons.push(upButton);
            var downButton = m("button", {onclick: this.moveItemDown.bind(this, item), disabled: disabled}, translate("#button_Down|Down"));
            buttons.push(downButton);
        }
        
        if (this.gridConfiguration.customButton) {
            var options = this.gridConfiguration.customButton;
            var customButtonClickedPartial;
            if (_.isString(options.callback)) {
                var fakeFieldSpecification = {id: this.fieldSpecification.id, displayConfiguration: options.callback, grid: this, item: item};
                customButtonClickedPartial = this.panelBuilder.buttonClicked.bind(this.panelBuilder, this.model, fakeFieldSpecification);
            } else {
                customButtonClickedPartial = (event) => { options.callback(this, item); };
            }
            var doubleClickFunction;
            if (!this.gridConfiguration.viewButton) {
                this.doubleClickAction = customButtonClickedPartial;
            }
            var customButton = m("button", {onclick: customButtonClickedPartial, disabled: disabled}, translate(options.customButtonLabel));
            buttons.push(customButton);
        }
        
        // console.log("made buttons", buttons, item);
        return buttons;
    }

    private rowForItem(item, index) {
        /* TODO: Use inline editor, if some config option is set:
        return inlineEditorForItem(panelBuilder, item, mode);
        */
        
        var selected = (item === this.selectedItem);

        var selectionClass = "";
        if (selected) {
            if (index % 2 === 0) {
                selectionClass = "narrafirma-grid-row-selected-even";
            } else {
                selectionClass = "narrafirma-grid-row-selected-odd";
            }
        } else {
            if (index % 2 === 0) {
                selectionClass = "narrafirma-grid-row-unselected-even";
            } else {
                selectionClass = "narrafirma-grid-row-unselected-odd";
            }
        }
        
        var fields = this.columns.map((column) => {
            return m("td", {"text-overflow": "ellipsis", "data-item-index": this.dataStore.idForItem(item), id: this.makeHtmlIdForItem(item)}, this.dataStore.valueForField(item, column.field));
        });
        
        if (this.gridConfiguration.inlineButtons) {
            var buttons = this.createButtons(item);
            
            fields = fields.concat(m("td", {nowrap: true}, buttons));
        }
        return m("tr", {key: this.dataStore.idForItem(item), "class": selectionClass}, fields);
    }
    
    ensureTableRowIsVisibleConfig(tableElement: HTMLElement, isInitialized: boolean, context: any) {
        // Ensure the selected item is visible in the table
        // TODO: Could improve this so when navigating down the item is still near the bottom
        if (this.selectedItem && this.isNavigationalScrollingNeeded) {
            var rowElement = document.getElementById(this.makeHtmlIdForItem(this.selectedItem));
            if (rowElement && !isElementInViewport(tableElement, rowElement)) {
                if (this.isNavigationalScrollingNeeded === "next" || this.isNavigationalScrollingNeeded === "end") {
                    tableElement.scrollTop = rowElement.offsetTop - tableElement.clientHeight + rowElement.offsetHeight;
                } else {
                    tableElement.scrollTop = rowElement.offsetTop;
                }
            }
            this.isNavigationalScrollingNeeded = null;
        }
    }
         
    private makeHtmlIdForItem(item): string {
        return this.gridID + this.dataStore.idForItem(item);
    }
    
    useTriples() {
        if (typeof this.model === "string") return true;
        var storage = this.valueProperty(); 
        return typeof storage === "string";
    }
}

// ObjectArray datastore as base

class DataStore {
    data: Array<any>;
    
    constructor(public valueProperty: Function, public idProperty: string, public valueTransform: Function, public setClassName: string, public itemClassName: string) {
    }
    
    newIdForItem() {
        // return new Date().toISOString();
        return generateRandomUuid(this.itemClassName);
    }
    
    length() {
        return this.data.length;
    }
    
    isEmpty() {
        return this.data.length === 0;
    }
    
   getDataArrayFromModel() {
        var data = this.valueProperty();
        
        if (!data) {
            data = [];
            // console.log("Grid datastore getDataArrayFromModel defaulting data to empty array");
            this.valueProperty(data);
        }
        
        // Make a copy of the data because we will be sorting it
        // TODO: Copying data creates a problem because up/down movement wil not be reflected in original
        this.data = data.slice();
    }

    makeCopyOfItemWithNewId(item) {
        // TODO: This needs to create an action that affects original list
        // Make a copy of the selected item
        var newItem = JSON.parse(JSON.stringify(item));
                  
        // Set new id for copy
        // TODO: Will not work right if item is an object with some class
        newItem[this.idProperty] = this.newIdForItem();
        
        this.data.push(newItem);
        
        // TODO: This item will not be sorted
        return newItem;
    }
    
    makeNewItem(): any {
        // TODO: This needs to create an action that affects original list
        var newItem = {};
        // TODO: Will not work right if item is an object with some class
        newItem[this.idProperty] = this.newIdForItem();
        this.data.push(newItem);
        
        // TODO: This item will not be sorted
        return newItem;
    }
    
    deleteItem(item) {
        // TODO: This needs to create an action that affects original list
        var index = this.data.indexOf(item);
        this.data.splice(index, 1);
        
        return index;
    }
    
    moveItemUp(item) {
        // TODO: How to move this change back to project data???
        var index = this.data.indexOf(item);
        if (index <= 0) return;
        this.data[index] = this.data[index - 1];
        this.data[index - 1] = item;
    }
    
    moveItemDown(item) {
        // TODO: How to move this change back to project data???
        var index = this.data.indexOf(item);
        if (index === -1 || index === this.data.length - 1) return;
        this.data[index] = this.data[index + 1];
        this.data[index + 1] = item;
    }
    
    idForItem(item) {
        var value = item[this.idProperty];
        if (typeof value === "function") {
            value = value.bind(item)();
        }
        return value;
    }
    
    itemForId(itemID: string) {
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            if (this.idForItem(item) === itemID) {
                return item;
            }
        }
        return undefined;
    }
    
    valueForField(item, fieldName: string) {
        var value = item[fieldName];
        // Resolve accessing functions
        if (typeof value === "function") value = value.bind(item)();
        if (this.valueTransform) value = this.valueTransform(value, fieldName);
        return value;
    }
    
    itemForIndex(index: number) {
        return this.data[index];
    }
    
    map(callback: Function) {
        return this.data.map(<any>callback);
    }
    
    indexOf(item) {
        return this.data.indexOf(item);
    }
    
    sortData(fieldIdentifier: string, sortDirection: string) {
        // TODO: This may need work for set???
        this.data.sort((a, b) => {
            var aValue: string = this.valueForField(a, fieldIdentifier);
            if (aValue === null || aValue === undefined) aValue = "";
            if (typeof aValue === "string") aValue = aValue.toLowerCase();
            var bValue: string = this.valueForField(b, fieldIdentifier);
            if (bValue === null || bValue === undefined) bValue = "";
            if (typeof bValue === "string") bValue = bValue.toLowerCase();
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        });
        
        if (sortDirection === "descending") {
            // console.log("reversing");
            this.data.reverse();
        }
        // console.log("sorted list", this.data);
    }
    
    reverseData() {
        this.data.reverse();
    }
}

class TripleSetDataStore extends DataStore {    
    tripleStore: TripleStore;
    setIdentifier: string;
    
    constructor(valueProperty: Function, idProperty: string, valueTransform: Function, setClassName: string, itemClassName: string, tripleStore: TripleStore) {
        super(valueProperty, idProperty, valueTransform, setClassName, itemClassName);
        this.tripleStore = tripleStore;
    }
    
    getDataArrayFromModel() {
        this.setIdentifier = this.valueProperty();
        
        // Design issue: Should we make a set if none exists at this time as opposed to lazily at first insertion of data?

        if (this.setIdentifier) {
            this.data = this.tripleStore.getListForSetIdentifier(this.setIdentifier);
        } else {
            this.data = [];
        }
    }
    
    // We don't make the set at startup; lazily make it if needed now
    ensureSetExists() {
        // TODO: Remove temporary addition with comparison on string type (for upgrading old data)
        if (!this.setIdentifier || typeof this.setIdentifier !== "string") {
            this.setIdentifier = this.tripleStore.newIdForSet(this.setClassName);
            // console.log("Grid triplestore getDataArrayFromModel defaulting data to empty set with id", this.setIdentifier);
            this.valueProperty(this.setIdentifier);
        }
    }

    makeCopyOfItemWithNewId(item) {
        // TODO: This needs to create an action that affects original list
        // Make a copy of the selected item

        this.ensureSetExists();
        
        var newId = this.tripleStore.makeCopyOfSetItemWithNewId(this.setIdentifier, this.itemClassName, item);
        
        this.data.push(newId);
        
        return newId;
    }
    
    makeNewItem(): any {
        // TODO: This needs to create an action that affects original list

        this.ensureSetExists();

        var newId = this.tripleStore.makeNewSetItem(this.setIdentifier, this.itemClassName);
        
        this.data.push(newId);
        
        return newId;
    }
   
    deleteItem(item) {
        // TODO: This needs to create an action that affects original list
        
        // TODO: Should the C be undefined instead of null?
        this.tripleStore.deleteSetItem(this.setIdentifier, item);
        
        var index = this.data.indexOf(item);
        this.data.splice(index, 1);
         
        return index;
    }
    
    moveItemUp(item) {
        throw new Error("TripleSetDataStore moveItemUp Unfinished");
    }
    
    moveItemDown(item) {
        throw new Error("TripleSetDataStore moveItemDown Unfinished");
    }
    
    idForItem(item) {
        return item;
    }
    
    valueForField(item, fieldName: string) {
        var value = this.tripleStore.queryLatestC(item, fieldName);
        if (this.valueTransform) value = this.valueTransform(value, fieldName);
        return value;
    }
}

export = GridWithItemPanel;
