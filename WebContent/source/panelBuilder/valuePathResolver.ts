import PanelBuilder = require("PanelBuilder");

"use strict";
   
export function resolveModelAndFieldForFieldSpecification(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var valuePath = fieldSpecification.valuePath;
    if (!valuePath) valuePath = fieldSpecification.id;
    var dataModelAndField = resolveModelAndFieldForValuePath(panelBuilder, model, valuePath);
    return resolveModelAndFieldForValuePath(panelBuilder, model, valuePath);
}

export function resolveModelAndFieldForValuePath(panelBuilder: PanelBuilder, model, valuePath) {
    // Parse the dependency path
    var pathParts = valuePath.split("/");
    if (pathParts[0] === "") {
        model = panelBuilder[pathParts[1]];
        if (!model) throw new Error("model is null");
        pathParts.shift();
        pathParts.shift();
    }
    if (pathParts.length < 1) throw new Error("Incorrect dependency path specified: " + valuePath);
    while (pathParts.length > 1) {
        // TODO: Should ideally establish dependencies all along the line in case something along path changes
        model = model[pathParts[0]];
        if (!model) throw new Error("model is null while iterating");
        pathParts.shift();
    }
    var field = pathParts[0];
    
    return {
        model: model,
        field: field
    };
}

export function resolveValueForFieldSpecification(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var modelAndField = resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
    return modelAndField.model.get(modelAndField.field);
}

export function resolveValueForValuePath(panelBuilder: PanelBuilder, model, valuePath) {
    var modelAndField = resolveModelAndFieldForValuePath(panelBuilder, model, valuePath);
    return modelAndField.model.get(modelAndField.field);
}