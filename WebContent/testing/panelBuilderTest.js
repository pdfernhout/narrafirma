require([
    "js/panelBuilder/PanelBuilder",
    "dojo/domReady!"
], function(
    PanelBuilder
){
    "use strict";
    
    console.log("panelBuilderTest.js");
    
    var panelBuilder = new PanelBuilder();
    
    var contentPane = panelBuilder.newContentPane();
    contentPane.placeAt("pageDiv").startup();
    console.log("contentPane", contentPane);
    
    var model = {};
    
    console.log("model", model);

    var fieldSpecifications = [
        {
            id: "aboutYou_youHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "About you"
        },
        {
            id: "aboutYou_experience",
            dataType: "string",
            dataOptions: ["none","a little","some","a lot"],
            required: true,
            displayType: "select",
            displayName: "Experience",
            displayPrompt: "How much experience do you have facilitating PNI projects?"
        },
    ];
   
    
    panelBuilder.addQuestions(fieldSpecifications, contentPane, model);
    
    var panel1 = {
        id: "panel_addResonantStory",
        displayName: "Add resonant story",
        displayType: "panel",
        section: "sensemaking",
        modelClass: "ResonantStoryModel",
        panelFields: [
            {
                id: "sensemakingSessionRecord_resonantStory_selection",
                dataType: "none",
                displayType: "storiesList",
                displayName: "Resonant story",
                displayPrompt: "Choose a story to mark as a resonant story for this sensemaking session."
            },
            {
                id: "sensemakingSessionRecord_resonantStory_type",
                dataType: "string",
                dataOptions: ["pivot","voice","discovery","other"],
                required: true,
                displayType: "select",
                displayName: "Type",
                displayPrompt: "Which type of resonant story is this?"
            },
            {
                id: "sensemakingSessionRecord_resonantStory_reason",
                dataType: "string",
                required: true,
                displayType: "textarea",
                displayName: "Why",
                displayPrompt: "Why did this story stand out?"
            },
            {
                id: "sensemakingSessionRecord_resonantStory_groups",
                dataType: "string",
                required: true,
                displayType: "text",
                displayName: "Groups",
                displayPrompt: "For which participant groups was this story important?"
            },
            {
                id: "sensemakingSessionRecord_resonantStory_notes",
                dataType: "string",
                displayType: "textarea",
                displayName: "Notes",
                displayPrompt: "Would you like to make any other notes about this story?"
            }
        ]
    };
    
    panelBuilder.buildPanel(panel1, contentPane, model);
});