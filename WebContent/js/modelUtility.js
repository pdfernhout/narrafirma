define([], function() {
    "use strict";
    
    return {
        updateModelWithNewValues: function(model, newValues, copyOnlyModelFieldsFlag, removeOtherFieldsFromModelFlag) {
            var key;
            
            // Copy new data into model
            for (key in newValues) {
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
    };  
});