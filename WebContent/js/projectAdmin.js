require([
    "js/panelBuilder/toaster",
    "dijit/layout/ContentPane",
    "dojox/mvc/getPlainValue",
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/pointrel20150417/PointrelClient",
    "dojo/Stateful",
    "dojo/domReady!"
], function(
    toaster,
    ContentPane,
    getPlainValue,
    PanelBuilder,
    PanelSpecificationCollection,
    PointrelClient,
    Stateful
){
    "use strict";
    
    var journalIdentifier = "NarraFirma-administration";
    var projectAdministrationTopic = "ProjectAdministration";
    
    var pointrelClient;
    
    var allProjectsModel;
    
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
        
        var userIdentifier = prompt("User identifier?", "administrator");
        if (!userIdentifier) return;
        
        pointrelClient = new PointrelClient("/api/pointrel20150417", journalIdentifier, userIdentifier);

        var allProjectsModel = new Stateful({
            users: [],
            projects: []
        });
        
        pointrelClient.reportJournalStatus(function(error, response) {
            console.log("reportJournalStatus response", error, response);
            if (error) {
                console.log("Failed to startup project", error);
                alert("Problem connecting to journal on server. Application will not run.");
                document.getElementById("pleaseWaitDiv").style.display = "none";
                // TODO: Sanitize journalIdentifier
                document.body.innerHTML += '<br>Problem connecting to project journal on server for: "<b>' + journalIdentifier + '</b>"';
            } else {
                loadAllProjectsModel(allProjectsModel, function (error) {
                    if (error) {
                        // It is possible no data was ever set
                        console.log("error", error);
                    }
                    buildGUI(contentPane, allProjectsModel);
                });
                
            }
        });
    }
    
    function loadAllProjectsModel(model, callback) {
        console.log("loadAllProjectsModel initial", model);
        
        pointrelClient.fetchLatestMessageForTopic(projectAdministrationTopic, function(error, response) {
            if (error) {
                callback(error);
            } else {
                var message = null;
                if (response.latestRecord) {
                    message = response.latestRecord.messageContents;
                }
                if (!message) {
                    console.log("No latest message was available");
                    callback(null);
                    return;
                }
                if (message.messageType !== "ProjectAdministration-SetAll") {
                    console.log("Unexpected response messageType", response);
                    callback("Unexpected response messageType");
                } else {
                    var newModel = message.change;
                    for (var key in newModel) {
                        model.set(key, newModel[key]);
                    }
                    callback(null);
                }
            }
        });
    }
    
    function saveButtonClicked(model) {
        var plainValue = getPlainValue(model);
        console.log("saveButtonClicked plainValue", plainValue);
        
        // TODO: Need callback to report status on save...
        pointrelClient.createAndSendChangeMessage(projectAdministrationTopic, "ProjectAdministration-SetAll", model);
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
            // TODO: Use password hash! Add button to set it.
            {
                "id": "password",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Password",
                "displayPrompt": "Password"
            },
            {
                "id": "groups",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Groups",
                "displayPrompt": "Groups (space separated; standard groups include admin, editor, author, contributor, and subscriber)"
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
                "id": "editors",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Editors",
                "displayPrompt": "Editors (space separated; can be group like admin, editor, author, contributor, subscriber, or anonymous)"
            },
            {
                "id": "viewers",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Viewers",
                "displayPrompt": "Viewers (space separated; can be group)"
            },
            {
                "id": "surveyTakers",
                "dataType": "string",
                "displayType": "text",
                "displayName": "Survey takers",
                "displayPrompt": "Survey takers (space separated; can be group)"
            }
        ]
    };
    
    function buildGUI(mainContentPane, model) {
        var panelSpecificationCollection = new PanelSpecificationCollection();
        
        // Add panels to be looked up by panel builder for grid
        panelSpecificationCollection.addPanelSpecification(userPanelSpecification);
        panelSpecificationCollection.addPanelSpecification(projectDescriptionPanelSpecification);

        var panelBuilder = new PanelBuilder({panelSpecificationCollection: panelSpecificationCollection});
        
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
                    includeAllFields: ["id", "fullName", "email", "groups"]
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
        
        var saveButtonSpecification = {
            id: "saveButton",
            displayType: "button",
            displayName: "Save",
            displayPrompt: "Save",
            displayConfiguration: function() {
                saveButtonClicked(model);
            }
        };
        var saveButton = panelBuilder.buildField(panelContentPane, model, saveButtonSpecification);
        
        panelContentPane.placeAt(mainContentPane);
    }
    

    initialize();
});