// This supports globals shared by modules

define([
    "dojo/Stateful"
], function(
    Stateful
) {
    "use strict";
    
    // Singleton domain object shared across application
    var domain = {
        // Initialize this here to make testing of domain easier without setupDomain being called
        projectAnswers: new Stateful(),
    
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
        },

        // Application should call this at startup
        setupDomain: function(panelSpecificationCollection) {
            var modelTemplate = panelSpecificationCollection.buildModel("ProjectModel");
            
            domain.updateModelWithNewValues(domain.projectAnswers, modelTemplate);

            var pages = panelSpecificationCollection.buildListOfPages();
            
            for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                var page = pages[pageIndex];
                if (!page.isHeader) {
                    var pageID = page.id;
                    domain.projectAnswers[pageID + "_pageStatus"] = null;
                }
            }
            
            /*
             Maybe this can be adapted for saving and loading individual pages?
            for (var fieldName in domain.projectAnswers) {
                var fieldValue = domain.projectAnswers[fieldName];
                if (fieldValue instanceof Array) {
                    domain.projectAnswers[fieldName] = new StatefulArray(fieldValue);
                }
            }
            */
            
            console.log("setupDomain result: domain", domain);
        }
    };
    
    return domain;
});