/*jslint node: true */
"use strict";

// TODO: Really big problem here. The server is intended to run and manage all resources (files).
// If the server is running when this tool runs, the server would not get the updates until restarted, and there might be conflicts

var pointrelServer = require("../server/pointrel20150417/pointrelServer");
var pointrelAccessControl = require("../server/pointrel20150417/pointrelAccessControl");

var narrafirmaProjectPrefix = "NarraFirmaProject-";

// Command line admin tools for creating users and projects and such
// console.log(process.argv);

function main() {
    console.log("NarraFirma admin command line tool");

    var myArgs = process.argv.slice(2);
    //console.log('myArgs: ', myArgs);
    
    var command = myArgs[0];
    
    // TODO: Probably should read this from a standard location
    pointrelAccessControl.initialize({"userIdentifier": "superuser"});

    // Make sure these exist:
    pointrelServer.addJournalSync("credentials");
    pointrelServer.addJournalSync("users");
    
    // Wasteful as indexes more journals than needed
    pointrelServer.indexAllJournals();
    
    // TODO: More validation
    
    if (command === "add-project") {
        if (myArgs.length < 2) return printUsage();
        addProject(myArgs[1]);
        return;
    }
    
    if (command === "add-user") {
        if (myArgs.length < 3) return printUsage();
        addUser(myArgs[1], myArgs[2]);
        return;
    }
    
    if (command === "list-users") {
        if (myArgs.length !== 1) return printUsage();
        listUsers();
        return;
    }
    
    if (command === "grant-project-user-role") {
        if (myArgs.length < 3) return printUsage();
        grantRole(myArgs[1], myArgs[2], myArgs[3] || "readerWriter");
        return;
    }
    
    console.log("Unsupported command:", command);
    printUsage();
}

function printUsage() {
    console.log("Usage:");
    console.log("  add-project projectIdentifier\n");
    console.log("  add-user userIdentifier password\n");
    console.log("  grant-project-user-role projectIdentifier userIdentifier role");
    console.log("    roles can be reader, writer, readerWriter, or administrator and defaults to readerWriter if not specified");
}

function addProject(projectIdentifier) {
    console.log("add-project", projectIdentifier);
    pointrelServer.addJournalSync(narrafirmaProjectPrefix + projectIdentifier);
}

function addUser(userIdentifier, password) {
    console.log("add-user", userIdentifier, password);
    
    // Check if user exists first, as otherwise will remove all roles and override other settings
    var userInformation = pointrelAccessControl.getUserInformation(userIdentifier);
    if (userInformation) {
        console.log("Error: user already exists", userIdentifier);
        return;
    }
    
    updateUserInformation(userIdentifier);
    setUserPassword(userIdentifier, password);
}

function grantRole(projectIdentifier, userIdentifier, role) {
    console.log("grant-project-user-role", projectIdentifier, userIdentifier, role);
    
    // Make sure the user already exists
    var userInformation = pointrelAccessControl.getUserInformation(userIdentifier);
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        return;
    }
    
    // TODO: Should confirm the project exists...
    
    // TODO: Should add to existing roles if not present rather than replace them all
    userInformation.rolesForJournals[narrafirmaProjectPrefix + projectIdentifier] = [role];
    updateUserInformation(userIdentifier, userInformation);
}

/// Support functions to change server data via processRequest

var serverRequestWithAuthenticatedSuperuser = {
    user: {
        userIdentifier: "superuser"
    },
    // Need to include an expected header
    headers: {
        'x-forwarded-for': "192.168.1.2"
    }
};

function updateUserInformation(userIdentifier, userInformation) {
    if (!userInformation) {
        userInformation = {
            userIdentifier: userIdentifier,
            name: userIdentifier,
            email: null,
            rolesForJournals: {
            }
        };
    }
    var createUserMessage = {
        "_topicIdentifier": {type: "userInformation", userIdentifier: userIdentifier},
        "_topicTimestamp": new Date().toISOString(),
        change: userInformation
    };

    var apiRequest = {
        "action": "pointrel20150417_storeMessage",
        "journalIdentifier": "users",
        "message": createUserMessage
    };

    pointrelServer.processRequest(apiRequest, function(response) {
        if (!response.success) {
            console.log("Error:", response);
        } else {
            console.log("OK:", JSON.stringify(response, null, 2));
        }
    }, serverRequestWithAuthenticatedSuperuser);
}

function setUserPassword(userIdentifier, password) {
    var userCredentials = {userIdentifier: userIdentifier, userPassword: password};

    var credentialsMessage = {
        "_topicIdentifier": {type: "authenticationInformation", userIdentifier: userIdentifier},
        "_topicTimestamp": new Date().toISOString(),
        change: userCredentials
    };

    var apiRequest = {
        action: "pointrel20150417_storeMessage",
        journalIdentifier: "credentials",
        message: credentialsMessage
    };

    pointrelServer.processRequest(apiRequest, function(response) {
        if (!response.success) {
            console.log("Error:", response);
        } else {
            console.log("OK:", JSON.stringify(response, null, 2));
        }
    }, serverRequestWithAuthenticatedSuperuser);
}

function listUsers() {
    console.log("not yet implemented");
}

main();