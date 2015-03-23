// This supports globals shared by modules

define([
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/Stateful"
], function(
    PanelSpecificationCollection,    
    Stateful
) {
    "use strict";
    
    // Singleton domain object shared across application
    var domain = {
        // Initialize this here to make testing of domain easier without setupDomain being called
        projectAnswers: new Stateful(),
        
        // This will hold information about all the panels used
        panelSpecificationCollection: new PanelSpecificationCollection(),
    
        getPageSpecification: function(pageID) {
            // For now, any "page" defined in the panelSpecificationCollection is available
            return domain.panelSpecificationCollection.getPageSpecificationForPageID(pageID);
        },
    
        updateModelWithNewValues: function(model, newValues) {
            var key;
            
            // Copy new data into model
            for (key in newValues) {
                if (newValues.hasOwnProperty(key)) {
                    model.set(key, newValues[key]);
                }
            }
            
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
    };
    
    return domain;
});