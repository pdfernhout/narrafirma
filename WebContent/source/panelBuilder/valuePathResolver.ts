import PanelBuilder = require("PanelBuilder");
import Project = require("../Project");
"use strict";

/*
ValuePathResolver helps with getting and setting values that are nested inside multiple objects.
It also helps with getting and setting valeus stores in a triple store.

ValuePathResolver will start from a supplied baseModel and sequentially move along a series of fields
defined in a valuePath string and separated by slashes.
It resolves the object at each position in the path and uses that to resolve the next part of the valuePath.

If the baseModel is a string instead of a JavaScript objects,
it uses that as the "A" field of a triple to use with a triple store lookup.
In that case, the "B" field of the tripel is the field in the value path.
If a value is beign set, the "C" field in the triple is the new value being set, and A and B are the same as for the lookup.

If part of a path is a function, it uses that function to get the field's value -- or set the value, if it is the final field.

If the valuePath starts with "/", the resolution process will use an optional supplied context object instead of the baseModel.
This is useful when building a panel where most of the panel fields use the same model,
but one or two fields or options may relay on values in the project or configuration or such.

An example valuePath starting from the baseModel with three segments is "a/b/c".
That would resolve to "baseModel.a.b.c" or set as "baseModel.a.b.c = newValue".

An example valuePath starting from the context with two segments is: "/project/userIdentifier".
That would resolve to "context.project.userIdentifier".
*/

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
                console.log("no object for first path segment", currentKey, this.valuePath, this.context);
                return undefined;
            }
        } 
        
        if (typeof currentModel === "string") {
            useTripleStore = true;
        }
        
        if (pathParts.length < 1) throw new Error("Incorrect dependency path specified: " + this.valuePath);
       
        while (pathParts.length > 1) {
            currentKey = pathParts.shift();
            if (currentKey === "currentPattern") {
                console.log("key is currentPattern");
            }
            var nextModel;
            var useAccessorFunction = !useTripleStore && typeof currentModel[currentKey] === "function";

            if (useTripleStore) {
                nextModel = (<Project>this.context.project).tripleStore.queryLatestC(currentModel, currentKey);
            } if (useAccessorFunction) {
                nextModel = currentModel[currentKey]();
            } else {
                nextModel = currentModel[currentKey];
            }
            if (!nextModel) {
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
            
            var useAccessorFunction = !modelAndField.useTripleStore && typeof modelAndField.model[modelAndField.field] === "function";
            
            if (modelAndField.useTripleStore) {
                (<Project>this.context.project).tripleStore.addTriple(modelAndField.model, modelAndField.field, value);
            } else if (useAccessorFunction) {
                modelAndField.model[modelAndField.field](value);
            } else {
                modelAndField.model[modelAndField.field] = value;
            }
            
            // Design issue: Should a set return this or the value? Using value to me like m.prop, but prevents chaining
            return value;
        } else {
            if (modelAndField === undefined) return undefined;
            if (modelAndField.useTripleStore) {
                return (<Project>this.context.project).tripleStore.queryLatestC(modelAndField.model, modelAndField.field);
            } else if (useAccessorFunction) {
                return modelAndField.model[modelAndField.field]();
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
