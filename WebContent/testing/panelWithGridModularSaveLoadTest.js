require([
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/pointrel20141201Client",
    "mithril"
], function(
    PanelBuilder,
    PanelSpecificationCollection,
    pointrel20141201Client,
    m
){
    "use strict";
    
    console.log("panelWithGridModularSaveLoadTest.js", pointrel20141201Client);
    
    function storeModel(model, documentID, previous, committerID, callbackWhenDone) {
        var contentType = "org.workingwithstories.Test3Model";
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
        "modelClass": "Test3Model",
        "panelFields": [
            {
                "id": "project_aboutParticipantGroups",
                "valueType": "none",
                "displayType": "label",
                "displayPrompt": "On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists."
            },
            {
                "id": "project_participantGroupsList",
                "valueType": "array",
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
                "valueType": "string",
                "required": true,
                "displayType": "text",
                "displayName": "Name",
                "displayPrompt": "Please name this group of participants (for example, \"doctors\", \"students\", \"staff\")."
            },
            {
                "id": "participantGroup_description",
                "valueType": "string",
                "required": true,
                "displayType": "textarea",
                "displayName": "Description",
                "displayPrompt": "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?"
            }
        ]
    };
    
    function test() {
        var panels = new PanelSpecificationCollection();
        
        panels.addPanelSpecification(page_partipantGroupsPanelSpecification);
        
        panels.addPanelSpecification(panel_addParticipantGroupSpecificationTextAbbreviated);
        
        var testModelTemplate = panels.buildModel("Test3Model");
        
        // var testModel = "Test3";
        var testModel = {};
        
        // STOPPED HERE!!! Would need to implement additional support in PanelSpecificationCollection and add_grid for a "store" type in addition to current "array"
        // testModel.set("project_participantGroupsList", {type: "store", itemClass: "ParticipantGroupModel"});
        
        console.log("testModel", testModel);
        
        var panelBuilder = new PanelBuilder({panelSpecificationCollection: panels});
        
        function testView() {
        
            var page = panelBuilder.buildPanel("page_participantGroups", testModel);
            
            var loadLatestButtonSpecification = {
                id: "loadButton",
                displayType: "button",
                displayPrompt: "Load latest",
                displayConfiguration: loadLastestModelVersion,
                displayPreventBreak: true
            };
            
            var loadLatestButton = panelBuilder.buildField(testModel, loadLatestButtonSpecification);
            
            var storeButtonSpecification = {
                id: "storeButton",
                displayType: "button",
                displayPrompt: "Store",
                displayConfiguration: storeModelVersion
            };
            
            var storeButton = panelBuilder.buildField(testModel, storeButtonSpecification);
            
            return [page, loadLatestButton, storeButton];
        }
        
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
        
        m.mount(document.getElementById("pageDiv"), {view: testView});
    }

    test();
});