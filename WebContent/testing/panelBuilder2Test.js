require([
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/text!js/applicationPanelSpecifications/planning/panel_addParticipantGroup.json",
    "dojo/Stateful",
    "dojo/domReady!"
], function(
    PanelBuilder,
    PanelSpecificationCollection,
    panel_addParticipantGroupSpecificationText,
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
    
    var panels = new PanelSpecificationCollection();
    panels.addPanelSpecificationFromJSONText(panel_addParticipantGroupSpecificationText);

    // var testModelTemplate = panels.buildModel("Test2Model");
    // var testModel = new Stateful(testModelTemplate);

    var panelBuilder = new PanelBuilder({panelSpecificationCollection: panels});
    
    var contentPane = panelBuilder.newContentPane();
    contentPane.placeAt("pageDiv").startup();
    console.log("contentPane", contentPane);
    
    var model = new Stateful();
    
    console.log("model", model);

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
            "dataOptions": [
                "none",
                "a little",
                "some",
                "a lot"
            ],
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