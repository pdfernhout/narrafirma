require([
    "js/panelBuilder/toaster",
    "dijit/layout/ContentPane",
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    // TODO: "js/pointrel20141201Client",
    "dojo/Stateful",
    "dojo/domReady!"
], function(
    toaster,
    ContentPane,
    PanelBuilder,
    PanelSpecificationCollection,
    Stateful
){
    "use strict";
    
    function initialize() {
        console.log("initialize called in site.js");
        toaster.createToasterWidget(document.getElementById("pleaseWaitDiv"));
        
        var contentPane = new ContentPane({
            content: "<b>Project Administration Tool</b>"
        });
        contentPane.placeAt(document.body);
        contentPane.startup();
        
        // turn off initial "please wait" display
        document.getElementById("pleaseWaitDiv").style.display = "none";
        
        // toaster.toast("Running...");
        
        buildGrid(contentPane);
    }
    
    // TODO: Translate
    var projectDescriptionPanelSpecification = {
        "id": "panel_projectDescription",
        "displayName": "Project description",
        "displayType": "panel",
        "section": "admin",
        "modelClass": "ProjectDescription",
        "panelFields": [
            {
                "id": "id",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Project identifier",
                "displayPrompt": "Project identifier"
            },
            {
                "id": "name",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Name",
                "displayPrompt": "Name"
            },
            {
                "id": "description",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Description",
                "displayPrompt": "Description"
            },
            {
                "id": "admins",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Admins",
                "displayPrompt": "Admins (separated by space)"
            },
            {
                "id": "editors",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Editors",
                "displayPrompt": "Editors"
            },
            {
                "id": "viewers",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Viewers",
                "displayPrompt": "Viewers"
            }
        ]
    };
    
    function buildGrid(mainContentPane) {
        var panelSpecificationCollection = new PanelSpecificationCollection();
        
        // Add this panel to as it will be looked up by panel builder for grid
        panelSpecificationCollection.addPanelSpecification(projectDescriptionPanelSpecification);

        var panelBuilder = new PanelBuilder({panelSpecificationCollection: panelSpecificationCollection});
        
        var model = new Stateful({
            projects: []
        });
        
        var panelContentPane = panelBuilder.newContentPane();
        
        var gridFieldSpecification = {
            id: "projects",
            dataType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_projectDescription",
                idProperty: "id",
                gridConfiguration: {
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true,
                    includeAllFields: ["id", "name", "description"]
                }
                // , customButton: {customButtonLabel: "Open panel", callback: _.partial(openPanel, panelContentPane, panelSpecificationCollection, panelBuilder)}}
            },
            displayName: "Projects",
            displayPrompt: "Projects"
        };
        
        var grid = panelBuilder.buildField(mainContentPane, model, gridFieldSpecification);
        grid.grid.set("selectionMode", "single");
        
        panelContentPane.placeAt(mainContentPane);
    }
    

    initialize();
});