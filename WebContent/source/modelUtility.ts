import getPlainValue = require("dojox/mvc/getPlainValue");

"use strict";

// TODO: Note that this approach depends on object keys maintaining their order, which is not guaranteed by the JS standards but most browsers support it
// isObject and copyObjectWithSortedKeys are from Mirko Kiefer (with added semicolons):
// https://raw.githubusercontent.com/mirkokiefer/canonical-json/master/index2.js
var isObject = function(a) {
    return Object.prototype.toString.call(a) === '[object Object]';
};

var copyObjectWithSortedKeys = function(object) {
    if (isObject(object)) {
        var newObj = {};
        var keysSorted = Object.keys(object).sort();
        var key;
        for (var i = 0, len = keysSorted.length; i < len; i++) {
            key = keysSorted[i];
            newObj[key] = copyObjectWithSortedKeys(object[key]);
        }
        return newObj;
    } else if (Array.isArray(object)) {
        return object.map(copyObjectWithSortedKeys);
    } else {
        return object;
    }
};   

export function updateModelWithNewValues(model, newValuesOriginal, copyOnlyModelFieldsFlag, removeOtherFieldsFromModelFlag) {
    var key;
    
    // Make a deep copy of the original values to ensure any arrays or objects are full deep copies
    var newValues = JSON.parse(JSON.stringify(newValuesOriginal));
    
    // Copy new data into model
    for (key in newValues) {
        // If copying only model fields, don't copy keys with underscores to ensure our model __type gets fixed if needed
        if (copyOnlyModelFieldsFlag && key.charAt(0) === "_") continue;
        if (newValues.hasOwnProperty(key) && (!copyOnlyModelFieldsFlag || model.get(key) !== undefined)) {
            model.set(key, newValues[key]);
        }
    }
    
    if (removeOtherFieldsFromModelFlag) {
        // TODO: A little dangerous to remove stuff, should this extra data just be kept?
        // Remove old data from model not in newValues
        var fieldsToRemove = {};
        for (key in model) {
            if (model.hasOwnProperty(key) && !newValues.hasOwnProperty(key)) {
                // Stateful model adds "_watchCallbacks" so don't remove it
                if (!_.startsWith(key, "_")) fieldsToRemove[key] = true;
            }
        }
        for (key in fieldsToRemove) {
            console.log("removing old field/data", key, model.get(key));
            model.set(key, undefined);
        }
    }
}

export function isModelChanged(model, initialValues) {
    var initialValuesJSON = JSON.stringify(copyObjectWithSortedKeys(initialValues), null, 4);
    var currentValuesJSON = JSON.stringify(copyObjectWithSortedKeys(getPlainValue(model)), null, 4);
    var isChanged = initialValuesJSON !== currentValuesJSON;
    /*
    if (isChanged) {
        console.log("changed from to", initialValues, model);
        console.log("initial", initialValuesJSON);
        console.log("current", currentValuesJSON);
    }
    */
    return isChanged;
}

export var getPlainValue = getPlainValue;

