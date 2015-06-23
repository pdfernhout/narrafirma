import m = require("mithril");
import translate = require("./translate");
import PanelBuilder = require("panelBuilder/PanelBuilder");

"use strict";

function computeColumnsForItemPanelSpecification(itemPanelSpecification, configuration) {
    // var self = this;
    
    var columns = [];
    
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

var ItemPanel = {
    controller: function(args) {
        console.log("%%%%%%%%%%%%%%%%%%% ItemPanel controller called");
    },
    
    view: function(controller, args) {
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
};

// Grid needs to be a component so it can maintain a local sorted list
var Grid = {
    controller: function(args) {
        var panelBuilder = args.panelBuilder;
        var model = args.model;
        var fieldSpecification = args.fieldSpecification;
        
        var displayConfiguration = {
            itemPanelID: undefined,
            itemPanelSpecification: undefined,
            idProperty: undefined,
            gridConfiguration: undefined
        };
        
        var gridConfiguration = {
            viewButton: true,
            addButton: true,
            removeButton: true,
            editButton: true,
            duplicateButton: true,
            moveUpDownButtons: false,
            includeAllFields: false,
            inlineButtons: false
        };
        
        var itemPanelID = fieldSpecification.displayConfiguration;
        if (!_.isString(itemPanelID)) {
            displayConfiguration = fieldSpecification.displayConfiguration;
            itemPanelID = displayConfiguration.itemPanelID;
            if (displayConfiguration.gridConfiguration) {
                gridConfiguration = displayConfiguration.gridConfiguration;
            }
        }
        
        // this.displayConfiguration = displayConfiguration;
        this.gridConfiguration = gridConfiguration;
        
        var itemPanelSpecification = displayConfiguration.itemPanelSpecification;
        if (!itemPanelSpecification) {
            itemPanelSpecification = panelBuilder.getPanelDefinitionForPanelID(itemPanelID);
        }
        
        if (!itemPanelSpecification) {
            console.log("Trouble: no itemPanelSpecification for options: ", fieldSpecification);
        }
        
        if (!model) {
            console.log("Error: no model is defined for grid", fieldSpecification);
            throw new Error("Error: no model is defined for grid");
        }
        
        // TODO: May want to use at or similar to get the value in case this is a plain object?
        var data = model[fieldSpecification.id];
        if (!data) {
            data = [];
            model[fieldSpecification.id] = data;
        }
        
        var idProperty = displayConfiguration.idProperty;
        if (!idProperty) idProperty = "_id";
        this.idProperty = idProperty;
        
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
        
        var columns = computeColumnsForItemPanelSpecification(itemPanelSpecification, displayConfiguration);
     
        this.data = data;
        this.columns = columns;
        this.itemPanelSpecification = itemPanelSpecification;
        
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
    },
    
    view: function(controller, args) {
        var panelBuilder = args.panelBuilder;
        var prompt = panelBuilder.buildQuestionLabel(args.fieldSpecification);
        
        function adjustHeaderWidth() {
            console.log("adjustHeaderWidth");
        }
        
        var columnHeaders = controller.columns.map(function (column) {
            return m("th[data-sort-by=" + column.field  + "]", {"text-overflow": "ellipsis"}, column.label);
        });
        
        if (controller.gridConfiguration.inlineButtons) {
            columnHeaders.push(m("th", ""));
        }
        
        var table = m("table.scrolling", sorts(controller, controller.data), [
            m("tr", {config: adjustHeaderWidth, "class": "selected-grid-row"}, columnHeaders),
            controller.data.map(function(item, index) {
                return Grid.rowForItem(controller, item, index);
            })
        ]);
        
        var disabled = controller.isEditing() || undefined;
        
        var buttons = [];
        if (controller.gridConfiguration.editButton) {
            var addButton = m("button", {onclick: Grid.addItem.bind(controller), disabled: disabled}, "Add");
            buttons.push(addButton);
        }
        
        if (!controller.gridConfiguration.inlineButtons) {
            buttons = buttons.concat(Grid.createButtons(controller));
        }
        
        var buttonPanel = m("div.narrafirma-button-panel", buttons);
        
        var parts = [prompt, m("div.narrafirm-grid", [table]), buttonPanel];
        
        if (controller.isViewing()) {
            parts.push(Grid.bottomEditorForItem(controller, panelBuilder, controller.selectedItem, "view"));
        }
        
        if (controller.isEditing()) {
            parts.push(Grid.bottomEditorForItem(controller, panelBuilder, controller.selectedItem, "edit"));
        }
        
        // TODO: set class etc.
        return m("div", {"class": "questionExternal narrafirma-question-type-grid"}, parts);
    },
    
    inlineEditorForItem: function(controller, panelBuilder, item, mode) {
        return m("tr", [
            m("td", {colSpan: controller.columns.length}, [
                m.component(<any>ItemPanel, {panelBuilder: panelBuilder, item: item, grid: controller, mode: mode})
            ]),
            m("td", {"vertical-align": "top"}, [m("button", {onclick: Grid.doneClicked.bind(controller, item)}, "close")])
        ]);
    },
    
    bottomEditorForItem: function(controller, panelBuilder, item, mode) {
        return m("div", [
            m("td", {colSpan: controller.columns.length}, [
                m.component(<any>ItemPanel, {panelBuilder: panelBuilder, item: item, grid: controller, mode: mode})
            ]),
            m("td", {"vertical-align": "top"}, [m("button", {onclick: Grid.doneClicked.bind(controller, item)}, "close")])
        ]);
    },
    
    addItem: function() {
        var newItem = {};
        newItem[this.idProperty] = new Date().toISOString();
        this.data.push(newItem);
        this.selectedItem = newItem;
        this.displayMode = "editing";
    },
    
    deleteItem: function (item) {
        if (!item) item = this.selectedItem; 
        console.log("deleteItem", item);
        
        // TODO: This needs to create an action that affects original list
        var index = this.data.indexOf(item);
        this.data.splice(index, 1);
        
        if (item === this.selectedItem) this.selectedItem = null;
    },
    
    editItem: function (item) {
        if (!item) item = this.selectedItem;
        console.log("editItem", item);
        
       // TODO: This needs to create an action that affects original list  
        this.selectedItem = item;
        this.displayMode = "editing";
    },
    
    viewItem: function (item, index) {
        if (!item) item = this.selectedItem;
        console.log("viewItem", item);
        
        this.selectedItem = item;
        this.displayMode = "viewing";
    },
    
    doneClicked: function(item) {
        // TODO: Should ensure the data is saved
        // Leave itme selected: this.selectedItem = null;
        this.displayMode = null;
    },
    
    createButtons: function (controller, item = null) {
        var buttons = [];
       
        var disabled = controller.isEditing() || (!item && !controller.selectedItem) || undefined;
         
        if (controller.gridConfiguration.removeButton) {
            var removeButton = m("button", {onclick: Grid.deleteItem.bind(controller, item), disabled: disabled, "class": "fader"}, "delete");
            buttons.push(removeButton);
        }

        if (controller.gridConfiguration.editButton) {
            var editButton = m("button", {onclick: Grid.editItem.bind(controller, item), disabled: disabled, "class": "fader"}, "edit");
            buttons.push(editButton);
        }
        
        if (controller.gridConfiguration.viewButton) {
            var viewButton = m("button", {onclick: Grid.viewItem.bind(controller, item), disabled: disabled, "class": "fader"}, "view");
            buttons.push(viewButton); 
        }
        
        console.log("made buttons", buttons, item);
        return buttons;
    },
    
    rowForItem: function (controller, item, index) {
        /*
        if (controller.selectedItem === item) {
            return m("tr", [
                m("td", {colSpan: controller.columns.length}, [
                    m.component(<any>ItemPanel, {panelBuilder: panelBuilder, item: item, grid: controller})
                ]),
                m("td", {"vertical-align": "top"}, [m("button", {onclick: Grid.doneClicked.bind(controller, item, index)}, "close")])
            ]);
        }
        */
        var selectionClass = "narrafirma-grid-row-unselected";
        var selected = (item === controller.selectedItem);
        if (selected) selectionClass = "narrafirma-grid-row-selected";
        
        var fields = controller.columns.map(function (column) {
            return m("td", {"text-overflow": "ellipsis", "data-item-index": item[controller.idProperty] }, item[column.field]);
        });
        
        if (controller.gridConfiguration.inlineButtons) {
            var buttons = Grid.createButtons(controller, item);
            
            fields = fields.concat(m("td", {nowrap: true}, buttons));
        }
        
        return m("tr", {key: item[controller.idProperty], "class": selectionClass}, fields);
    }
};
    
export function add_grid(panelBuilder, model, fieldSpecification) {
    return m.component(<any>Grid, {panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
}
