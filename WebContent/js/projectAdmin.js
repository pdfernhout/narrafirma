require([
    "js/panelBuilder/toaster",
    "dijit/layout/ContentPane",
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/pointrel20150417/PointrelClient",
    "dojo/Stateful",
    "dojo/domReady!"
], function(
    toaster,
    ContentPane,
    PanelBuilder,
    PanelSpecificationCollection,
    PointrelClient,
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
    
    var userRoles = [
        "admin",
        "editor",
        "author",
        "contributor",
        "subscriber",
        "anonymous"
    ];
    
    // TODO: Translate
    var userPanelSpecification = {
        "id": "panel_user",
        "displayName": "User",
        "displayType": "panel",
        "section": "admin",
        "modelClass": "User",
        "panelFields": [
            {
                "id": "id",
                "dataType": "string",
                "displayType": "text",
                "displayName": "System user identifier",
                "displayPrompt": "System user identifier",
                readOnly: true
            },
            {
                "id": "email",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Email",
                "displayPrompt": "Email",
            },
            {
                "id": "password",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Password",
                "displayPrompt": "Password"
            },
            {
                "id": "role",
                "dataType": "string",
                "dataOptions": userRoles,
                "required": true,
                "displayType": "select",
                "displayName": "Role",
                "displayPrompt": "Role"
            },
            {
                "id": "fullName",
                "dataType": "string",
                "displayType": "text",
                "displayName": "User name",
                "displayPrompt": "User name"
            }
        ]
    };
    
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
                "displayPrompt": "Project identifier",
                readOnly: true
            },
            {
                "id": "name",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Name",
                "displayPrompt": "Project Name"
            },
            {
                "id": "description",
                "dataType": "string",
                "displayType": "textarea",
                "displayName": "Description",
                "displayPrompt": "Project Description"
            },
            {
                "id": "roleToEditProject",
                "dataType": "string",
                "dataOptions": userRoles,
                "required": true,
                "displayType": "select",
                "displayName": "Role to edit project",
                "displayPrompt": "Role required to edit project"
            },
            {
                "id": "roleToViewProject",
                "dataType": "string",
                "dataOptions": userRoles,
                "required": true,
                "displayType": "select",
                "displayName": "Role to view project",
                "displayPrompt": "Role required to view project"
            },
            {
                "id": "roleToTakeSurvey",
                "dataType": "string",
                "dataOptions": userRoles,
                "required": true,
                "displayType": "select",
                "displayName": "Role to take survey",
                "displayPrompt": "Role required to take survey"
            }
        ]
    };
    
    function buildGrid(mainContentPane) {
        var panelSpecificationCollection = new PanelSpecificationCollection();
        
        // Add panels to be looked up by panel builder for grid
        panelSpecificationCollection.addPanelSpecification(userPanelSpecification);
        panelSpecificationCollection.addPanelSpecification(projectDescriptionPanelSpecification);

        var panelBuilder = new PanelBuilder({panelSpecificationCollection: panelSpecificationCollection});
        
        var model = new Stateful({
            users: [],
            projects: []
        });
        
        var panelContentPane = panelBuilder.newContentPane();
        
        var userGridSpecification = {
            id: "users",
            dataType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_user",
                idProperty: "id",
                gridConfiguration: {
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true,
                    includeAllFields: ["id", "loginIdentifier", "role", "fullName"]
                }
                // , customButton: {customButtonLabel: "Open panel", callback: _.partial(openPanel, panelContentPane, panelSpecificationCollection, panelBuilder)}}
            },
            displayName: "Users",
            displayPrompt: "Users"
        };
        
        var userGrid = panelBuilder.buildField(panelContentPane, model, userGridSpecification);
        userGrid.grid.set("selectionMode", "single");
            
        var projectGridSpecification = {
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
        
        var projectGrid = panelBuilder.buildField(panelContentPane, model, projectGridSpecification);
        projectGrid.grid.set("selectionMode", "single");
        
        panelContentPane.placeAt(mainContentPane);
    }
    

    initialize();
});