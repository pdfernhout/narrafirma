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
        }
    };
    
    return domain;
});