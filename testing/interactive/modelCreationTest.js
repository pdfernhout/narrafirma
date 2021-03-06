require([
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/text!js/applicationPanelSpecifications/planning/page_aboutYou.json",
    "dojo/domReady!"
], function(
    PanelSpecificationCollection,
    aboutYouPanelSpecificationText
){
    "use strict";
    
    console.log("modelCreationTest.js");
    
    // console.log("aboutYouPanelSpecificationText", aboutYouPanelSpecificationText);
    
    var aboutYouPanelSpecification = JSON.parse(aboutYouPanelSpecificationText);
    
    console.log("aboutYouPanelSpecification", aboutYouPanelSpecification);
    
    console.log("aboutYouPanelSpecification.modelClass", aboutYouPanelSpecification.modelClass);
    
    aboutYouPanelSpecification.modelClass = "TestModel";
    console.log("aboutYouPanelSpecification.modelClass", aboutYouPanelSpecification.modelClass);
    
    var panels = new PanelSpecificationCollection();
    
    panels.addPanelSpecification(aboutYouPanelSpecification);
    
    try {
        var modelMissing = panels.buildModel("ProjectModel");
        console.log("modelMissing (should not get here)", modelMissing);
    } catch (e) {
        console.log("missing model throws error OK", e);
    }
    
    var testModel = panels.buildModel("TestModel");
    
    console.log("testModel", testModel);
    
});