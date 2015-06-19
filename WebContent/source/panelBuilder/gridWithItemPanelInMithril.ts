import m = require("mithril");
import translate = require("./translate");

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
            sortable: !configuration.moveUpDownButtons,
        };
        columns.push(newColumn);
        // console.log("newColumn", newColumn);
    });
    
    return columns;
}

function sorts(list) {
    return {
        onclick: function(e) {
            var prop = e.target.getAttribute("data-sort-by")
            if (prop) {
                var first = list[0]
                list.sort(function(a, b) {
                    return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0
                })
                if (first === list[0]) list.reverse()
            }
        }
    }
}

export function add_grid(panelBuilder, model, fieldSpecification) {
    // return m("div", "Mithril grid unfinished");
    
    var configuration = {
        itemPanelID: undefined,
        itemPanelSpecification: undefined,
        idProperty: undefined,
        gridConfiguration: undefined   
    };
    
    var itemPanelID = fieldSpecification.displayConfiguration;
    if (!_.isString(itemPanelID)) {
        configuration = fieldSpecification.displayConfiguration;
        itemPanelID = configuration.itemPanelID;
    }
    
    var itemPanelSpecification = configuration.itemPanelSpecification;
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
    if (!model.get) {
        console.log("Error: model that supports get is needed for grid", fieldSpecification);
        throw new Error("Error: model that supports get is needed for grid");
    }
    
    // TODO: May want to use at or similar to get the value in case this is a plain object?
    var data = model.get(fieldSpecification.id);
    if (!data) {
        data = [];
        model.set(fieldSpecification.id, data);
    }
    
    var bigData = [];
    for (var i = 0; i < 100; i++) {
        bigData = bigData.concat(data);
    }
    data = bigData;
    
    var idProperty = configuration.idProperty;
    if (!idProperty) idProperty = "_id";
    
    var columns = computeColumnsForItemPanelSpecification(itemPanelSpecification, configuration);
    
    // return m("table", sorts(ctrl.list), [
    return m("table", [
        m("tr[style=outline: thin solid; background-color: red]", columns.map(function (column) {
                return m("th", column.label)
            }).concat(m("th", "Actions"))
        ),
        data.map(function(item) {
            return m("tr", columns.map(function (column) {
                return m("td[style=outline: thin solid;]", item[column.field])
            }).concat(m("td[style=outline: thin solid;]", {nowrap: true}, [m("button", "delete"), m("button", "edit"), m("button", "view")])))
        })
    ])
}