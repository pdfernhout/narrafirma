import PanelBuilder = require("PanelBuilder");
import Project = require("../Project");
"use strict";

// TODO: Store a reference to the Project in an intiatilziation step
// TODO: Use the tripel store to store all this data

class ValuePathResolver {
    constructor(public context: any, public baseModel: any, public valuePath: string) {
    }
    
    resolveModelAndField() {
        var currentModel = this.baseModel;
        var currentKey: string;
        
        // Parse the dependency path
        var pathParts = this.valuePath.split("/");
        
        var isGlobalReference = false;
        var useTripleStore = false;
        
        // If the path starts with "/", use the context as the model
        if (pathParts[0] === "") {
            isGlobalReference = true;
            pathParts.shift();
            currentKey = pathParts.shift();
            currentModel = this.context[currentKey];
            if (!currentModel) {
                // TODO: Needs work!!!
                // throw new Error("model is null");
                console.log("no object for first path segment", currentKey, this.valuePath, this.context);
                return undefined;
            }
        } 
        
        if (typeof currentModel === "string") {
            useTripleStore = true;
        }
        
        if (pathParts.length < 1) throw new Error("Incorrect dependency path specified: " + this.valuePath);
       
        while (pathParts.length > 1) {
            // TODO: Should ideally establish dependencies all along the line in case something along path changes
            currentKey = pathParts.shift();
            if (currentKey === "currentPattern") {
                console.log("key is currentPattern");
            }
            var nextModel;
            if (useTripleStore) {
                nextModel = (<Project>this.context.project).tripleStore.queryLatestC(currentModel, currentKey);
            } else {
                nextModel = currentModel[currentKey];
            }
            if (!nextModel) {
                // TODO: Needs work!!!
                // throw new Error("model is null while iterating");
                console.log("model is null while iterating", currentKey, pathParts.length, this.valuePath, currentModel);
                return undefined;
            }
            currentModel = nextModel;
        }
        var field = pathParts[0];
        return {
            model: currentModel,
            field: field,
            isGlobalReference: isGlobalReference,
            useTripleStore: useTripleStore
        };
    }
    
    resolve(value = undefined): any {
        // console.log("resolve", this.valuePath, value, this);
        var modelAndField = this.resolveModelAndField();
        if (value !== undefined) {
            if (modelAndField === undefined) {
                console.log("Model missing; can't set value", this.valuePath, this.baseModel, this.context);
                return undefined; 
            }
            
            // TODO: Need to have hook here to save the data to the server somehow...
            if (modelAndField.useTripleStore) {
                (<Project>this.context.project).tripleStore.addTriple(modelAndField.model, modelAndField.field, value);
            } else {
                modelAndField.model[modelAndField.field] = value;
            }
            
            // TODO: Should a set return this or the value? Using value to me like m.prop, but prevents chaining
            return value;
        } else {
            if (modelAndField === undefined) return undefined;
            if (modelAndField.useTripleStore) {
                return (<Project>this.context.project).tripleStore.queryLatestC(modelAndField.model, modelAndField.field);
            } else {
                return modelAndField.model[modelAndField.field];
            }
        }
    }
}

export function newValuePathForFieldSpecification(panelBuilder: PanelBuilder, model, fieldSpecification) {
    // console.log("newValuePathForFieldSpecification", fieldSpecification);
    var valuePath: string = fieldSpecification.valuePath;
    if (!valuePath) valuePath = fieldSpecification.id;
    return newValuePath(panelBuilder, model, valuePath);
}

export function newValuePath(panelBuilder: PanelBuilder, model, valuePath: string) {
    // console.log("newValuePath", valuePath);
    var valuePathResolver = new ValuePathResolver(panelBuilder, model, valuePath);
    return valuePathResolver.resolve.bind(valuePathResolver);
}
