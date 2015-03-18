require([
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/pointrel20141201Client",
    "dojo/Stateful",
    "dojo/domReady!"
], function(
    PanelBuilder,
    PanelSpecificationCollection,
    pointrel20141201Client,
    Stateful
){
    "use strict";
    
    console.log("panelWithGridModularSaveLoadTest.js");
    
    function storeModel(model, documentID, previous, committerID, callbackWhenDone) {
        var contentType = "org.workingwithstories.Test2Model";
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
    
    var page_partipantGroupsPanelSpecification = {
        "id": "page_participantGroups",
        "displayName": "Describe participant groups",
        "displayType": "page",
        "section": "planning",
        "modelClass": "ProjectModel",
        "panelFields": [
            {
                "id": "project_aboutParticipantGroups",
                "dataType": "none",
                "displayType": "label",
                "displayPrompt": "On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists."
            },
            {
                "id": "project_participantGroupsList",
                "dataType": "array",
                "required": true,
                "displayType": "grid",
                "displayConfiguration": "panel_addParticipantGroup",
                "displayName": "Participant groups",
                "displayPrompt": "Please add participant groups in the list below (typically up to three groups)."
            }
        ]
    };
    
    var panel_addParticipantGroupSpecificationTextAbbreviated = {
        "id": "panel_addParticipantGroup",
        "displayName": "Participant group",
        "displayType": "panel",
        "section": "planning",
        "modelClass": "ParticipantGroupModel",
        "panelFields": [
            {
                "id": "participantGroup_name",
                "dataType": "string",
                "required": true,
                "displayType": "text",
                "displayName": "Name",
                "displayPrompt": "Please name this group of participants (for example, \"doctors\", \"students\", \"staff\")."
            },
            {
                "id": "participantGroup_description",
                "dataType": "string",
                "required": true,
                "displayType": "textarea",
                "displayName": "Description",
                "displayPrompt": "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?"
            }
        ]
    };
    
    function test() {
        page_partipantGroupsPanelSpecification.modelClass = "Test3Model";
        
        var panels = new PanelSpecificationCollection();
        
        panels.addPanelSpecification(page_partipantGroupsPanelSpecification);
        
        panels.addPanelSpecification(panel_addParticipantGroupSpecificationTextAbbreviated);
        
        var testModelTemplate = panels.buildModel("Test3Model");
        
        var testModel = new Stateful(testModelTemplate);
        
        console.log("testModel", testModel);
        
        var panelBuilder = new PanelBuilder({panelSpecificationCollection: panels});
        
        var contentPane = panelBuilder.newContentPane();
        contentPane.placeAt("pageDiv").startup();
        
        panelBuilder.buildPanel("page_participantGroups", contentPane, testModel);
        
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
        var documentID = projectID + "-participantGroups";
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

    test();
});