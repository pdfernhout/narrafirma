require([
    "dojo/text!js/applicationPanelSpecifications/planning/page_aboutYou.json",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/pointrel20141201Client",
    "dojo/domReady!"
], function(
    aboutYouPanelSpecificationText,
    PanelSpecificationCollection,
    pointrel20141201Client
){
    "use strict";
    
    function storeModel(model, documentID, previous, committerID, callbackWhenDone) {
        var contentType = "org.workingwithstories.TestModel";
        var contentVersion = "0.1.0";
        
        var metadata = {
            id: documentID,
            previous: previous,
            tags: [],
            contentType: contentType,
            contentVersion: contentVersion,
            author: null,
            committer: committerID,
            timestamp: true
        };        
        pointrel20141201Client.storeInNewEnvelope(model, metadata, function(error, serverResponse) {
            if (error) {
                console.log("could not write new model version:\n" + error);
                return callbackWhenDone(error);
            }
            var sha256HashAndLength = serverResponse.sha256AndLength;
            console.log("wrote sha256HashAndLength:", sha256HashAndLength);
            callbackWhenDone(null, sha256HashAndLength);
        });
    }
    
    function loadLatestModelVersion(documentID, callbackWhenDone) {
        console.log("============= loadLatestModelVersion");
        pointrel20141201Client.loadLatestEnvelopeForID(documentID, function(error, envelope) {
            if (error) {
                if (error === "No items found for id") error = "No stored versions could be loaded -- have any versions been saved?";
                return callbackWhenDone(error);
            }
            callbackWhenDone(null, envelope.content, envelope);           
        });
    }
    
    function test() {
        console.log("modelSaveLoadTest.js");
        
        var aboutYouPanelSpecification = JSON.parse(aboutYouPanelSpecificationText);
        
        aboutYouPanelSpecification.modelClass = "TestModel";
        
        var panels = new PanelSpecificationCollection();
        
        panels.addPanelWithFields(aboutYouPanelSpecification);
        
        var testModel = panels.buildModel("TestModel");
        
        console.log("testModel", testModel);
        
        testModel.aboutYou_experience = "none";
        testModel.aboutYou_help = "a lot";
        testModel.aboutYou_tech = "some";
        
        console.log("testModel updated", testModel);
        
        // Thinking project ID should be a UUID?
        var projectID = "TestProject1234";
        var documentID = projectID + "-aboutYou";
        var committerID = "tester@example.com";
    }

    test();
});