require([
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/Stateful",
    "dojo/domReady!"
], function(
    PanelBuilder,
    PanelSpecificationCollection,
    Stateful
) {
    "use strict";
    
    /*
    Intended for exploring how to make a list with a remembered current selection
    where items can be added, copied, editied, and deleted.

    Also intended to explore having a list edited in one place control what appears
    in a different list or drop down which has a current selection.

    May also explore issues with widgets sending events that can be listened for and acted on.
    */
    
    console.log("panelBuilder2Test.js");
    
    // var testModelTemplate = panels.buildModel("Test2Model");
    // var testModel = new Stateful(testModelTemplate);
    
    var model = new Stateful();
    
    model.set("project_participantGroupsList", [
        {
            "_id": "016ca591-2f29-4c2c-821a-0a3e29473092",
            "participantGroup_name": "One"
        },
        {
            "_id": "5d6e3727-47f5-442e-81cf-4c5cff26a774",
            "participantGroup_name": "Two"
        }
    ]);
    
    model.set("project_primaryGroup", "One");
    
    model.watch("project_primaryGroup", function(name, oldValue, newValue) {
        console.log("@@@@ Model field changed: name, oldValue, newValue", name, oldValue, newValue);
    });
    
    console.log("model", model);
    
    var panel_addParticipantGroup = {
        "id": "panel_addParticipantGroup",
        "displayName": "Participant group",
        "displayType": "panel",
        "section": "planning",
        "modelClass": "ParticipantGroup",
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
            },
        ]
    };
    
    var panels = new PanelSpecificationCollection();
    panels.addPanelSpecification(panel_addParticipantGroup);
    var panelBuilder = new PanelBuilder({panelSpecificationCollection: panels});
    
    var contentPane = panelBuilder.newContentPane();
    contentPane.placeAt("pageDiv").startup();
    console.log("contentPane", contentPane);

    var fieldSpecifications =  [
        {
            "id": "project_participantGroupsList",
            "dataType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": "panel_addParticipantGroup",
            "displayName": "Participant groups",
            "displayPrompt": "Please add participant groups in the list below (typically up to three groups)."
        },
        {
            "id": "project_primaryGroup",
            "dataType": "string",
            // "dataOptions": ["one", "two", "three"],
            "dataOptions": "project_participantGroupsList",
            "dataOptionValueKey": "participantGroup_name",
            // "displayDataOptionField": "name",
            "required": true,
            "displayType": "select",
            "displayName": "Primary group",
            "displayPrompt": "Which group is most important to this project?"
        },
        {
            "id": "addToObservation_createNewObservationWithResultButton",
            "dataType": "none",
            "displayType": "button",
            "displayConfiguration": "panel_createNewObservation",
            "displayPrompt": "Create new observation with this result"
        }
    ];
   
    panelBuilder.buildFields(fieldSpecifications, contentPane, model); 
    
    panelBuilder.setButtonClickedCallback(buttonClicked);
    
    function buttonClicked(panelBuilder, contentPane, model, fieldSpecification, value) {
        console.log("buttonClicked");
        console.log("panelBuilder", panelBuilder);
        console.log("contentPanel", contentPane);
        console.log("model", model);
        console.log("fieldSpecification", fieldSpecification);
        console.log("value", value);
    }
                            
});