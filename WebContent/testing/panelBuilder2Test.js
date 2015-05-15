require([
    "js/panelBuilder/PanelBuilder",
    "dojo/domReady!"
], function(
    PanelBuilder
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
    
    var panelBuilder = new PanelBuilder();
    
    var contentPane = panelBuilder.newContentPane();
    contentPane.placeAt("pageDiv").startup();
    console.log("contentPane", contentPane);
    
    var model = {};
    
    console.log("model", model);

    var fieldSpecifications =  [
       {
            "id": "aboutYou_youHeader",
            "dataType": "none",
            "displayType": "header",
            "displayPrompt": "About you"
        },
        {
            "id": "aboutYou_experience",
            "dataType": "string",
            "dataOptions": [
                "none",
                "a little",
                "some",
                "a lot"
            ],
            "required": true,
            "displayType": "select",
            "displayName": "Experience",
            "displayPrompt": "How much experience do you have facilitating PNI projects?"
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