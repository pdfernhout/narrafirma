import Project = require("../Project");
import Globals = require("../Globals");

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
    
    constructor(public baseModel: any, public valuePath: string, public isAccessFunctionRequired = false) {
    }
    
    failIfAccessFunctionRequired() {
        if (this.isAccessFunctionRequired) {
            console.log("access function required", this);
            // alert("access function required");
            throw new Error("access function required " + this.valuePath);
        }
    }
    
    resolveModelAndField() {
        var currentModel = this.baseModel;
        var currentKey: string;
        
        // console.log("++++++++++++++ resolveModelAndField start", this.valuePath, this.baseModel, Globals);
        
        // Parse the dependency path
        var pathParts = this.valuePath.split("/");
        
        var isGlobalReference = false;
        var useTripleStore = false;
        
        // If the path starts with "/", use the context as the model
        if (pathParts[0] === "") {
            isGlobalReference = true;
            pathParts.shift();
            currentModel = Globals;
            if (!currentModel) {
                console.log("no object for context", currentKey, this.valuePath, Globals);
                return undefined;
            }
        } 
        
        if (pathParts.length < 1) throw new Error("Incorrect dependency path specified: " + this.valuePath);
       
        while (pathParts.length > 1) {
            currentKey = pathParts.shift();
            
            // console.log("resolveModelAndField", currentModel, currentKey);
            
            // TODO: Hard to distinguish with this between an incorrect path that might reference a field set somewhere to a string
            if (typeof currentModel === "string") {
                useTripleStore = true;
            }
            
            var nextModel;
            var currentModelDirectFieldValue = currentModel[currentKey];
            var useAccessorFunction = !useTripleStore && typeof currentModelDirectFieldValue === "function";
            
            if (useTripleStore) {
                this.failIfAccessFunctionRequired();
                nextModel = Globals.project().tripleStore.queryLatestC(currentModel, currentKey);
            } else if (useAccessorFunction) {
                nextModel = currentModel[currentKey]();
            } else if (currentModelDirectFieldValue === undefined && currentModel.fieldValue && typeof currentModel.fieldValue === "function") {
                nextModel = currentModel.fieldValue(currentKey);
            } else {
                this.failIfAccessFunctionRequired();
                nextModel = currentModel[currentKey];
            }
            if (!nextModel) {
                console.log("model is null while iterating", currentKey, pathParts.length, this.valuePath, currentModel);
                return undefined;
            }
            currentModel = nextModel;
            
            if (typeof currentModel === "string") {
                useTripleStore = true;
            }
            
        }  
        
        if (typeof currentModel === "string") {
            useTripleStore = true;
        }
        
        var field = pathParts[0];
        var result = {
            model: currentModel,
            field: field,
            isGlobalReference: isGlobalReference,
            useTripleStore: useTripleStore
        };
        
        // console.log("resolveModelAndField result", result);
        
        return result;
    }
    
    resolve(value = undefined): any {
        // console.log("resolve", this.valuePath, value, this);
        var modelAndField = this.resolveModelAndField();
        if (!modelAndField) {
            console.log("ERROR: modelAndField is undefined or null", this);
            return null;
        }
        var modelFieldDirectValue = modelAndField.model[modelAndField.field];
        var useAccessorFunction = !modelAndField.useTripleStore && typeof modelFieldDirectValue === "function";
        
        if (value !== undefined) {
            if (modelAndField === undefined) {
                console.log("Model missing; can't set value", this.valuePath, this.baseModel, Globals);
                return undefined; 
            }
                        
            if (modelAndField.useTripleStore) {
                this.failIfAccessFunctionRequired();
                Globals.project().tripleStore.addTriple(modelAndField.model, modelAndField.field, value);
            } else if (useAccessorFunction) {
                modelAndField.model[modelAndField.field](value);
            } else if (modelFieldDirectValue === undefined && modelAndField.model.fieldValue && typeof modelAndField.model.fieldValue === "function") {
                modelAndField.model.fieldValue(modelAndField.field, value);
            } else {
                this.failIfAccessFunctionRequired();
                modelAndField.model[modelAndField.field] = value;
            }
            
            // console.log("resolve-set", this.valuePath, value, modelAndField, this);
            
            // Design issue: Should a set return this or the value? Using value to me like m.prop, but prevents chaining
            return value;
        } else {
            if (modelAndField === undefined) return undefined;
            if (modelAndField.useTripleStore) {
                this.failIfAccessFunctionRequired();
                value = Globals.project().tripleStore.queryLatestC(modelAndField.model, modelAndField.field);
            } else if (useAccessorFunction) {
                value = modelAndField.model[modelAndField.field]();
            } else if (modelFieldDirectValue === undefined && modelAndField.model.fieldValue && typeof modelAndField.model.fieldValue === "function") {
                return modelAndField.model.fieldValue(modelAndField.field);
            } else {
                this.failIfAccessFunctionRequired();
                value = modelAndField.model[modelAndField.field];
            }
            
            // console.log("resolve-get", this.valuePath, value, modelAndField, this);
            
            return value;
        }
    }
}

export function newValuePathForFieldSpecification(model, fieldSpecification) {
    // console.log("newValuePathForFieldSpecification", fieldSpecification);
    var valuePath: string = fieldSpecification.valuePath;
    if (!valuePath) valuePath = fieldSpecification.id;
    return newValuePath(model, valuePath);
}

export function newValuePath(model, valuePath: string): Function {
    // console.log("newValuePath", valuePath);
    var valuePathResolver = new ValuePathResolver(model, valuePath);
    return valuePathResolver.resolve.bind(valuePathResolver);
}
