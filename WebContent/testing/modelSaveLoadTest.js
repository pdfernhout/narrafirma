require([
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/text!js/applicationPanelSpecifications/planning/page_aboutYou.json",
    "dojo/domReady!"
], function(
    PanelSpecificationCollection,
    aboutYouPanelSpecificationText
){
    "use strict";
    
    console.log("modelSaveLoad.js");
    
    // console.log("aboutYouPanelSpecificationText", aboutYouPanelSpecificationText);
    
    var aboutYouPanelSpecification = JSON.parse(aboutYouPanelSpecificationText);
    
    console.log("aboutYouPanelSpecification", aboutYouPanelSpecification);
    
    console.log("aboutYouPanelSpecification.modelClass", aboutYouPanelSpecification.modelClass);
    
    aboutYouPanelSpecification.modelClass = "TestModel";
    console.log("aboutYouPanelSpecification.modelClass", aboutYouPanelSpecification.modelClass);
    
    var panels = new PanelSpecificationCollection();
    
    panels.addPanelWithFields(aboutYouPanelSpecification);
    
    var modelMissing = panels.buildModel("ProjectModel");
    
    console.log("modelMissing (should be null)", modelMissing);
    
    var testModel = panels.buildModel("TestModel");
    
    console.log("testModel", testModel);
    
});