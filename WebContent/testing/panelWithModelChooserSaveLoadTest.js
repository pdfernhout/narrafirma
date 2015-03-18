require([
    "js/applicationPanelSpecifications/loadAllPanelSpecifications",
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/pointrel20141201Client",
    "dojo/Stateful",
    "dojo/domReady!"
], function(
    loadAllPanelSpecifications,
    PanelBuilder,
    PanelSpecificationCollection,
    pointrel20141201Client,
    Stateful
){
    "use strict";
    
    console.log("panelWithModelChooserSaveLoadTest.js");
    
    function storeModel(model, documentID, previous, committerID, callbackWhenDone) {
        var contentType = "org.workingwithstories.testing." + model.__type;
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
    
    function buildPanel(contentPane, panels, panelBuilder, panelSpecification) { 
        console.log("buildPanel panelSpecification", panelSpecification);
        
        var testModelTemplate = panels.buildModel(panelSpecification.modelClass);
        
        var testModel = new Stateful(testModelTemplate);
        
        console.log("testModel", testModel);
        
        panelBuilder.buildPanel(panelSpecification.id, contentPane, testModel);
        
        var loadLatestButtonSpecification = {
            id: "loadButton",
            displayType: "button",
            displayPrompt: "Load latest",
            displayConfiguration: loadLastestModelVersion,
            displayPreventBreak: true
        };
        
        var loadLatestButton = panelBuilder.buildField(contentPane, testModel, loadLatestButtonSpecification);
        
        var storeButtonSpecification = {
            id: "storeButton",
            displayType: "button",
            displayPrompt: "Store",
            displayConfiguration: storeModelVersion
        };
        
        var storeButton = panelBuilder.buildField(contentPane, testModel, storeButtonSpecification);
        
        // Thinking project ID should be a UUID?
        var projectID = "TestProject1234";
        var documentID = projectID + "-" + panelSpecification.modelClass;
        var committerID = "tester@example.com";
        
        function loadLastestModelVersion() {
            console.log("trying to load latest");
            loadLatestModelVersion(documentID, function(error, latestModelVersion, envelope) {
                console.log("load result", error, latestModelVersion, envelope);
                if (error) {
                    alert("An error happened when loading: " + error);
                } else {
                    console.log("Loaded OK");
                    for (var key in testModelTemplate) {
                        console.log("key", key);
                        if (testModel.hasOwnProperty(key)) {
                            console.log("Trying to copy", key);
                            testModel.set(key, latestModelVersion[key]);
                        }
                    }
                    alert("Loaded OK\n" + envelope.__sha256HashAndLength);
                }
            });
        }
        
        function storeModelVersion() {
            console.log("trying to store", testModel);
            storeModel(testModel, documentID, null, committerID, function(error, sha256AndLength) {
                console.log("store result", error, sha256AndLength);
                if (error) {
                    alert("An error happened when storing: " + error);
                } else {
                    alert("Stored OK\n" + sha256AndLength);
                }
            });
        }
    }
    
    var modelItemPanelSpecification = {
        "id": "panel_modelItem",
        "displayName": "Model item",
        "displayType": "panel",
        "section": "testing",
        "modelClass": "ModelItemModel",
        "displayPanel": "panel_modelItem",
        "panelFields": [
            {
                "id": "id",
                "dataType": "string",
                "displayType": "text",
                "displayName": "ID",
                "displayPrompt": "ID"
            },
            {
                "id": "section",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Section",
                "displayPrompt": "Section"
            },
            {
                "id": "displayName",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Name",
                "displayPrompt": "Name"
            },
            {
                "id": "displayType",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Type",
                "displayPrompt": "Type"
            },
            {
                "id": "modelClass",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Model Class",
                "displayPrompt": "Model Class"
            }
        ]
    };

    // TODO: Load all panels and build list of them from panels loaded
    function test() {
        var panelSpecificationCollection = new PanelSpecificationCollection();
        loadAllPanelSpecifications(panelSpecificationCollection);

        var panelBuilder = new PanelBuilder({panelSpecificationCollection: panelSpecificationCollection});
        
        var mainContentPane = panelBuilder.newContentPane();
        mainContentPane.placeAt("pageDiv").startup();
        
        var allPanels = panelSpecificationCollection.buildListOfPanels();
        
        // Change all the models
        var panels = [];
        allPanels.forEach(function(panelSpecification) {
            if (panelSpecification.modelClass) panelSpecification.modelClass = "Test-" + panelSpecification.modelClass;
            console.log("panelSpecification", panelSpecification);
            panels.push(panelSpecification);
        });
        
        // Add this panel to as it will be looked up by panel builder for grid
        panelSpecificationCollection.addPanelSpecification(modelItemPanelSpecification);
        
        var model = new Stateful({
            panels: panels
        });
        
        var gridFieldSpecification = {
            "id": "panels",
            "dataType": "array",
            "displayType": "grid",
            "displayConfiguration": "panel_modelItem",
            "displayName": "Panels",
            "displayPrompt": "Panels"
        };
        
        var grid = panelBuilder.buildField(mainContentPane, model, gridFieldSpecification);
        
        var panelContentPane = panelBuilder.newContentPane();
        panelContentPane.placeAt(mainContentPane);
           
        // TODO: Hook this up so it will build whatever panel is selected
        // TODO: Also issue with blue selection staying on items when you click on another
        // buildPanel(panelSpecification);
    }
    
    test();
});