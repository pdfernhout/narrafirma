import m = require("mithril");
import translate = require("./translate");
import PanelBuilder = require("panelBuilder/PanelBuilder");

"use strict";

function computeColumnsForItemPanelSpecification(itemPanelSpecification, configuration) {
    // var self = this;
    
    var columns = [];
    
    if (!itemPanelSpecification) return columns;
    
    var maxColumnCount = 5;
    var columnCount = 0;
    
    var displayTypesToDisplay = {
       text: true,
       textarea: true,
       select: true,
       radiobuttons: true
    };
    
    var fieldsToInclude = [];
    var panelFields = itemPanelSpecification.panelFields;
    
    // Put the columns in the order supplied if using includeAllFields, otherwise put them in order of panel specification
    if (configuration.includeAllFields && configuration.includeAllFields.constructor === Array) {
        configuration.includeAllFields.forEach(function (fieldName) {
            panelFields.forEach(function (fieldSpecification) {
                if (fieldSpecification.id === fieldName) fieldsToInclude.push(fieldSpecification);
            });
        });
    } else {
        panelFields.forEach(function (fieldSpecification) {
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
    
    fieldsToInclude.forEach(function (fieldSpecification) {
        // console.log("includeField", fieldSpecification);
        var newColumn =  {
            field: fieldSpecification.id,
            label: translate(fieldSpecification.id + "::shortName", fieldSpecification.displayName),
            // formatter: self.formatObjectsIfNeeded.bind(this),
            sortable: !configuration.moveUpDownButtons
        };
        columns.push(newColumn);
        // console.log("newColumn", newColumn);
    });
    
    return columns;
}

// Sorts function derived from: http://lhorie.github.io/mithril-blog/vanilla-table-sorting.html
function sorts(controller, list) {
    return {
        onclick: function(e) {
            var prop = e.target.getAttribute("data-sort-by");
            if (prop) {
                console.log("Sorting by", prop);
                var first = list[0];
                list.sort(function(a, b) {
                    return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
                });
                if (first === list[0]) {
                    console.log("reversing");
                    list.reverse();
                }
                console.log("sorted list", list);
            } else {
                if (controller.isEditing()) return;
                var itemID = e.target.getAttribute("data-item-index");
                console.log("item clicked", itemID);
                var itemIndex = null;
                for (var i = 0; i < list.length; i++) {
                    if (list[i][controller.idProperty] === itemID) {
                        itemIndex = i;
                        break;
                    }
                }
                console.log("found item at index", itemIndex, list[itemIndex]);
                if (itemIndex !== null) {
                    controller.selectedItem = list[itemIndex];
                    controller.displayMode = "viewing";
                }
            }
        }
    };
}

class ItemPanel {
    
    static controller(args) {
        console.log("Making ItemPanel: ", args);
        return new ItemPanel();
    }
    
    static view(controller, args) {
        console.log("ItemPanel view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        console.log("%%%%%%%%%%%%%%%%%%% ItemPanel view called");
        // return m("div", "work in progress");
        // TODO: Should provide copy of item?
        var panelBuilder: PanelBuilder = args.panelBuilder;
        // Possible recursion if the panels contain a table
        
        var theClass = "narrafirma-griditempanel-viewing";
        if (args.mode === "edit") {
            theClass = "narrafirma-griditempanel-editing";  
        }
        return m("div", {"class": theClass}, panelBuilder.buildPanel(args.grid.itemPanelSpecification, args.item));

    }
}

// GridWithItemPanel needs to be a component so it can maintain a local sorted list
class GridWithItemPanel {
    
    gridConfiguration = null;
    data = [];
    columns = [];
    fieldSpecification = null;
    itemPanelSpecification = null;
    idProperty = "_id";
    model = null;
    panelBuilder = null;
    
    // viewing, editing
    displayMode = null;
    
    // TODO: Multiple select
    selectedItem = null;
    
    isNavigationalScrollingNeeded = false;
    
    constructor(args) {
        this.panelBuilder = args.panelBuilder;
        this.model = args.model;
        this.fieldSpecification = args.fieldSpecification;
        
        this.updateDisplayConfigurationAndData(this.fieldSpecification.displayConfiguration);
    }
    
    updateDisplayConfigurationAndData(theDisplayConfiguration) {
        var displayConfiguration = {
            itemPanelID: undefined,
            itemPanelSpecification: undefined,
            gridConfiguration: undefined
        };
        
        var gridConfiguration = {
            idProperty: undefined,
            
            viewButton: true,
            addButton: true,
            removeButton: true,
            editButton: true,
            includeAllFields: false,
            inlineButtons: false,
            navigationButtons: true,
            
            // Flag for whether removing an item then selects the next item after it
            // This flag makes it easy to quickly delete a lot of items, which is maybe not good in some cases
            shouldNextItemBeSelectedAfterItemRemoved: false,
           
            // TODO: Need to make work:
            duplicateButton: false,
            moveUpDownButtons: false,
            customButton: null,
            validateAdd: null,
            validateEdit: null
        };
        
        var itemPanelID = theDisplayConfiguration;
        if (!_.isString(itemPanelID)) {
            displayConfiguration = theDisplayConfiguration;
            itemPanelID = displayConfiguration.itemPanelID;
            if (displayConfiguration.gridConfiguration) {
                gridConfiguration = displayConfiguration.gridConfiguration;
            }
        }
        
        // this.displayConfiguration = displayConfiguration;
        this.gridConfiguration = gridConfiguration;
        
        var itemPanelSpecification = displayConfiguration.itemPanelSpecification;
        if (!itemPanelSpecification && itemPanelID) {
            itemPanelSpecification = this.panelBuilder.getPanelDefinitionForPanelID(itemPanelID);
        }
        
        if (!itemPanelSpecification) {
            console.log("Trouble: no itemPanelSpecification for options: ", this.fieldSpecification);
        }
        
        if (!this.model) {
            console.log("Error: no model is defined for grid", this.fieldSpecification);
            throw new Error("Error: no model is defined for grid");
        }
        
        if (gridConfiguration.idProperty) this.idProperty = gridConfiguration.idProperty;
        
        this.itemPanelSpecification = itemPanelSpecification;
        this.columns = computeColumnsForItemPanelSpecification(itemPanelSpecification, displayConfiguration);
     
        this.isEditing = function() {
            return (this.displayMode === "editing") && this.selectedItem;
        };
        
        this.isViewing = function() {
            return (this.displayMode === "viewing") && this.selectedItem;
        };
        
        // viewing, editing
        this.displayMode = null;
        
        // TODO: Multiple select
        this.selectedItem = null;
        
        this.isNavigationalScrollingNeeded = false;
        
        this.updateData();
    }
    
    updateData() {
        // TODO: May want to use at or similar to get the value in case this is a plain object?
        var data = this.model[this.fieldSpecification.id];
        
        /*
        var bigData = [];
        for (var i = 0; i < 50; i++) {
            for (var j = 0; j < data.length; j++) {
                var newItem = JSON.parse(JSON.stringify(data[j]));
                newItem[idProperty] = "item_" + (i * data.length + j);
                bigData.push(newItem);
                console.log("newItem", newItem);
            }
        }
        data = bigData;
        */
        
        if (!data) {
            data = [];
            this.model[this.fieldSpecification.id] = data;
        }
        this.data = data;
    }
    
    static controller(args) {
        console.log("Making ItemPanel: ", args);
        return new GridWithItemPanel(args);
    }
    
    static view(controller: GridWithItemPanel, args) {
        console.log("Grid view called");
        
        return controller.calculateView();
    }
    
    calculateView() {
        console.log("GridWithItemPanel calculateView", this.data);
        
        var panelBuilder = this.panelBuilder;
        var prompt = panelBuilder.buildQuestionLabel(this.fieldSpecification);
        
        var columnHeaders = this.columns.map((column) => {
            return m("th[data-sort-by=" + column.field  + "]", {"text-overflow": "ellipsis"}, column.label);
        });
        
        if (this.gridConfiguration.inlineButtons) {
            columnHeaders.push(m("th", ""));
        }
        
        var table = m("table.scrolling", sorts(this, this.data), [
            m("tr", {"class": "selected-grid-row"}, columnHeaders),
            this.data.map((item, index) => {
                return this.rowForItem(item, index);
            })
        ]);
        
        var disabled = this.isEditing() || undefined;
        
        var buttons = [];
        if (this.gridConfiguration.editButton) {
            var addButton = m("button", {onclick: this.addItem.bind(this), disabled: disabled}, "Add");
            buttons.push(addButton);
        }
        
        if (!this.gridConfiguration.inlineButtons) {
            buttons = buttons.concat(this.createButtons(this));
        }
        
        if (this.gridConfiguration.navigationButtons) {
            // TODO: Improve navigation enabling
            var navigationDisabled = this.isEditing() || this.data.length === 0 || undefined;
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "start"), disabled: navigationDisabled}, "[<<"));
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "previous"), disabled: navigationDisabled}, "<"));
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "next"), disabled: navigationDisabled}, ">"));
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "end"), disabled: navigationDisabled}, ">>]"));
        }
        
        var buttonPanel = m("div.narrafirma-button-panel", buttons);
        
        var parts = [prompt, m("div.narrafirm-grid", [table]), buttonPanel];
        
        if (this.isViewing()) {
            parts.push(this.bottomEditorForItem(panelBuilder, this.selectedItem, "view"));
        }
        
        if (this.isEditing()) {
            parts.push(this.bottomEditorForItem(panelBuilder, this.selectedItem, "edit"));
        }
        
        // TODO: set class etc.
        return m("div", {"class": "questionExternal narrafirma-question-type-grid"}, parts);
    }

    isEditing() {
        return (this.displayMode === "editing") && this.selectedItem;
    }
    
    isViewing() {
        return (this.displayMode === "viewing") && this.selectedItem;
    }
    
    inlineEditorForItem(panelBuilder, item, mode) {
        return m("tr", [
            m("td", {colSpan: this.columns.length}, [
                m.component(<any>ItemPanel, {panelBuilder: panelBuilder, item: item, grid: this, mode: mode})
            ]),
            m("td", {"vertical-align": "top"}, [m("button", {onclick: this.doneClicked.bind(this, item)}, "close")])
        ]);
    }
    
    bottomEditorForItem(panelBuilder, item, mode) {
        return m("div", [
            m("td", {colSpan: this.columns.length}, [
                m.component(<any>ItemPanel, {panelBuilder: panelBuilder, item: item, grid: this, mode: mode})
            ]),
            m("td", {"vertical-align": "top"}, [m("button", {onclick: this.doneClicked.bind(this, item)}, "close")])
        ]);
    }
    
    addItem() {
        var newItem = {};
        newItem[this.idProperty] = new Date().toISOString();
        this.data.push(newItem);
        this.selectedItem = newItem;
        this.displayMode = "editing";
    }
    
    deleteItem(item) {
        if (!item) item = this.selectedItem; 
        console.log("deleteItem", item);
        
        // TODO: This needs to create an action that affects original list
        var index = this.data.indexOf(item);
        this.data.splice(index, 1);
        
        if (item === this.selectedItem) {
            this.selectedItem = null;
            
            if (this.gridConfiguration.shouldNextItemBeSelectedAfterItemRemoved) {
                if (index === this.data.length) {
                    index = index - 1;
                }  
                if (this.data.length) {
                    this.selectedItem = this.data[index];
                } else {
                   this.selectedItem = null;
                }
                this.isNavigationalScrollingNeeded = true;
            }
        }
    }
    
    editItem(item) {
        if (!item) item = this.selectedItem;
        console.log("editItem", item);
        
       // TODO: This needs to create an action that affects original list  
        this.selectedItem = item;
        this.displayMode = "editing";
    }
    
    viewItem(item, index) {
        if (!item) item = this.selectedItem;
        console.log("viewItem", item);
        
        this.selectedItem = item;
        this.displayMode = "viewing";
    }
    
    doneClicked(item) {
        // TODO: Should ensure the data is saved
        // Leave itme selected: this.selectedItem = null;
        this.displayMode = null;
    }
    
    navigateClicked(direction: string) {
        if (this.data.length === 0) return;
        var newPosition;
        switch (direction) {
            case "start":
                newPosition = 0;
                break;
            case "previous":
                newPosition = this.data.indexOf(this.selectedItem);
                if (newPosition === -1) newPosition = 0;
                if (newPosition > 0) newPosition--;
                break;
            case "next":
                newPosition = this.data.indexOf(this.selectedItem);
                if (newPosition < this.data.length - 1) newPosition++;
                break;
            case "end":
                newPosition = this.data.length - 1;
                break;
            default:
               throw new Error("Unexpected direction: " + direction);
        }
        this.selectedItem = this.data[newPosition];
        this.isNavigationalScrollingNeeded = true;
    }
    
    createButtons(item = null) {
        var buttons = [];
       
        var disabled = this.isEditing() || (!item && !this.selectedItem) || undefined;
         
        if (this.gridConfiguration.removeButton) {
            var removeButton = m("button", {onclick: this.deleteItem.bind(this, item), disabled: disabled, "class": "fader"}, "delete");
            buttons.push(removeButton);
        }

        if (this.gridConfiguration.editButton) {
            var editButton = m("button", {onclick: this.editItem.bind(this, item), disabled: disabled, "class": "fader"}, "edit");
            buttons.push(editButton);
        }
        
        if (this.gridConfiguration.viewButton) {
            var viewButton = m("button", {onclick: this.viewItem.bind(this, item), disabled: disabled, "class": "fader"}, "view");
            buttons.push(viewButton); 
        }
        
        // console.log("made buttons", buttons, item);
        return buttons;
    }
    
    rowForItem(item, index) {
        /*
        if (this.selectedItem === item) {
            return m("tr", [
                m("td", {colSpan: this.columns.length}, [
                    m.component(<any>ItemPanel, {panelBuilder: panelBuilder, item: item, grid: this})
                ]),
                m("td", {"vertical-align": "top"}, [m("button", {onclick: this.doneClicked.bind(this, item, index)}, "close")])
            ]);
        }
        */
        var selectionClass = "narrafirma-grid-row-unselected";
        var selected = (item === this.selectedItem);
        if (selected) selectionClass = "narrafirma-grid-row-selected";
        
        var fields = this.columns.map((column) => {
            return m("td", {"text-overflow": "ellipsis", "data-item-index": item[this.idProperty] }, item[column.field]);
        });
        
        if (this.gridConfiguration.inlineButtons) {
            var buttons = this.createButtons(item);
            
            fields = fields.concat(m("td", {nowrap: true}, buttons));
        }
        // TODO: Probably more efficient way to ensure table row is visible like by doing config just for entire table
        return m("tr", {key: item[this.idProperty], "class": selectionClass, config: this.ensureTableRowIsVisibleConfig.bind(this, item)}, fields);
    }
    
    ensureTableRowIsVisibleConfig(item, element: HTMLElement, isInitialized: boolean, context: any, vdom: _mithril.MithrilVirtualElement) {
        // Ensure the selected item is visible in the table
        // TODO: Could improve this so when navigating down the item is still near the bottom
        if (this.isNavigationalScrollingNeeded && this.selectedItem === item) {
            if (!isElementInViewport(element.parentNode, element)) {
                var rowPosition = element.offsetTop;
                element.parentElement.scrollTop = rowPosition;
            }
            this.isNavigationalScrollingNeeded = false;
        }
    }    
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

export = GridWithItemPanel;
