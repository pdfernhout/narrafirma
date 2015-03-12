require([
    "js/panelBuilder/PanelBuilder",
    "dojo/domReady!"
], function(
    PanelBuilder
){
    "use strict";
    
    console.log("panelBuilderTest.js");
    
    var questions = [
        {
            id: "page_aboutYou",
            displayName: "About you",
            displayType: "page",
            section: "planning",
            modelClass: "ProjectModel"
        },
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
    
    var panelBuilder = new PanelBuilder();
    
    var contentPane = panelBuilder.newContentPane();
    contentPane.placeAt("pageDiv").startup();
    console.log("contentPane", contentPane);

});