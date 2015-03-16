require([
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/text!js/applicationPanelSpecifications/planning/page_aboutYou.json",
    "dojo/domReady!"
], function(
    PanelSpecificationCollection,
    aboutYouPanelSpecificationText
){
    "use strict";
    
    console.log("modelSaveLoadTest.js");
    
    var aboutYouPanelSpecification = JSON.parse(aboutYouPanelSpecificationText);
    
    aboutYouPanelSpecification.modelClass = "TestModel";
    
    var panels = new PanelSpecificationCollection();
    
    panels.addPanelWithFields(aboutYouPanelSpecification);
    
    var testModel = panels.buildModel("TestModel");
    
    console.log("testModel", testModel);
    
});