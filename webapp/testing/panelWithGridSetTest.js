require([
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/pointrel20150417/PointrelClient",
    "js/pointrel20150417/TripleStore",
    "mithril"
], function(
    PanelBuilder,
    PanelSpecificationCollection,
    PointrelClient,
    TripleStore,
    m
){
    "use strict";
    
    console.log("panelWithGridSetTest.js");

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
                "valueType": "set",
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
        // Thinking project ID should be a UUID?
        var projectID = "TestProject1234";
        var documentID = projectID + "-participantGroups";
        var committerID = "tester@example.com";
        
        var pointrelClient = new PointrelClient("loopback", projectID, committerID);
        var tripleStore = new TripleStore(pointrelClient, documentID);
     
        var panels = new PanelSpecificationCollection();
        
        panels.addPanelSpecification(page_partipantGroupsPanelSpecification);
        
        panels.addPanelSpecification(panel_addParticipantGroupSpecificationTextAbbreviated);

        var testModel = "Test3";
        console.log("testModel", testModel);
        
        var panelBuilder = new PanelBuilder({panelSpecificationCollection: panels});
        panelBuilder.project = {tripleStore: tripleStore};
        
        function testView() {
            console.log("view called", tripleStore);
            return panelBuilder.buildPanel("page_participantGroups", testModel);
        }   
        
        m.mount(document.getElementById("pageDiv"), {view: testView});
    }

    test();
});