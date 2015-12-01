/*jslint node: true */
"use strict";

// TODO: Really big problem here. The server is intended to run and manage all resources (files).
// If the server is running when this tool runs, the server would not get the updates until restarted, and there might be conflicts

var pointrelServer = require("../server/pointrel20150417/pointrelServer");
var pointrelAccessControl = require("../server/pointrel20150417/pointrelAccessControl");
var pointrelUtility = require("../server/pointrel20150417/pointrelUtility");

var fs = require('fs');

// Command line admin tools for creating users and journals and such
// console.log(process.argv);

function main() {
    console.log("\nPointrel20150417 admin command line tool");
    console.log("Any changes made by this tool require a server restart for the server to see them.\n");

    var myArgs = process.argv.slice(2);
    //console.log('myArgs: ', myArgs);
    
    var command = myArgs[0];

    if (myArgs.length < 2 && command !== "update-superuser") {
        printUsage();
        return;
    }
    
    console.log("command: '" + command + "'");
    
    // TODO: Probably should read this from a standard location
    pointrelAccessControl.initialize({"userIdentifier": "superuser"});

    // Make sure these exist:
    pointrelServer.addJournalSync("credentials");
    pointrelServer.addJournalSync("users");
    
    // Wasteful as indexes more journals than needed
    pointrelServer.indexAllJournals();
    
    // TODO: More validation
    
    if (command === "add-journal") {
        addJournal(myArgs[1]);
        return;
    }
    
    if (command === "add-user") {
        if (myArgs.length !== 2) return console.log("Needs user identifier as first argument");
        addUser(myArgs[1], myArgs[2]);
        return;
    }
    
    if (command === "update-superuser") {
        // if (myArgs.length !== 2) return console.log("Needs superuser name");
        updateSuperuser(myArgs[1], myArgs[2]);
        return;
    }
    
    if (command === "grant") {
        if (myArgs.length < 4) return printUsage();
        grantRole(myArgs[1], myArgs[2], myArgs[3], myArgs[4]);
        return;
    }
    
    if (command === "revoke") {
        if (myArgs.length < 4) return printUsage();
        revokeRole(myArgs[1], myArgs[2], myArgs[3], myArgs[4]);
        return;
    }
    
    console.log("Unsupported command:", command);
    printUsage();
}


function readPassword(callback) {
    // Support for reading passwords from command line
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    var util = require('util');

    console.log("Type password and then press enter:");
    process.stdin.on('data', function (password) {
        process.stdin.pause();
        // Remove the new line, carriage return under Windows (if any), and leading and trailing whitespace
        if (password) password = password.trim();
        // console.log('received data:', util.inspect(password));
        callback(password);
    });
}

function printUsage() {
    console.log("Usage:\n");
    console.log("  add-journal journal\n");
    console.log("  add-user user [password, prompts for password if not supplied]\n");
    console.log("  update-superuser [name, defaults to superuser [password, prompts for password if not supplied]]\n");
    console.log("  grant user role journal topic");
    console.log("  revoke user role journal topic");
    console.log("    roles can be reader, writer, readerWriter, or administrator");
}

function addJournal(journalIdentifier) {
    console.log("add-journal", journalIdentifier);
    pointrelServer.addJournalSync(journalIdentifier);
}

function addUser(userIdentifier, password) {
    console.log("add-user", userIdentifier, password);
    
    // Check if user exists first, as otherwise will remove all roles and override other settings
    var userInformation = pointrelAccessControl.getUserInformation(userIdentifier);
    if (userInformation) {
        console.log("Error: user already exists", userIdentifier);
        return;
    }
    
    if (userIdentifier === "anonymous") {
        console.log("anonymous user is special and the password will not be used");
    } else {
        if (!password) {
            readPassword(doUpdate);
        } else {
            doUpdate(password);
        }
    }
    
    function doUpdate(password) {
        if (!password && (userIdentifier !== "anonymous")) {
            console.log("no password entered -- doing nothing");   
        } else {
            // console.log("using password", "'" + password + "'");
            updateUserInformation(userIdentifier);
            setUserPassword(userIdentifier, password);
        }
    }
}

function findIndexForRole(roles, role) {
    var index = -1;
    for (var i = 0; i < roles.length; i++) {
        if (JSON.stringify(roles[i]) === JSON.stringify(role)) {
            index = i;
            break;
        }
    }
    return index;
}

function grantRole(userIdentifier, role, journalIdentifier, topic) {
    console.log("grant", userIdentifier, role, journalIdentifier, topic);
    
    // Make sure the user already exists
    var userInformation = pointrelAccessControl.getUserInformation(userIdentifier);
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        return;
    }
    
    // TODO: Should confirm the journal exists...
    
    var roleToAdd;
    if (topic) {
        // Fields need to be in alphabetical order for JSON comparison with messages stored in canonical form
        roleToAdd = {role: role, topic: topic};
    } else {
        roleToAdd = role;
    }
    var roles = userInformation.rolesForJournals[journalIdentifier];
    if (!roles) {
        roles = [];
        userInformation.rolesForJournals[journalIdentifier] = roles;
    }
    
    if (findIndexForRole(roles, roleToAdd) !== -1) {
        console.log("User already has role", roleToAdd);
    } else {
        roles.push(roleToAdd);
        updateUserInformation(userIdentifier, userInformation);
    }
}

function revokeRole(userIdentifier, role, journalIdentifier, topic) {
    console.log("revoke", userIdentifier, role, journalIdentifier, topic);
    
    // Make sure the user already exists
    var userInformation = pointrelAccessControl.getUserInformation(userIdentifier);
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        return;
    }
    
    // TODO: Should confirm the journal exists...
    
    var roleToRemove;
    if (topic) {
        // Fields need to be in alphabetical order for JSON comparison with messages stored in canonical form
        roleToRemove = {role: role, topic: topic};
    } else {
        roleToRemove = role;
    }
    var roles = userInformation.rolesForJournals[journalIdentifier];
    if (!roles) {
        roles = [];
        userInformation.rolesForJournals[journalIdentifier] = roles;
    }
    
    var indexToRemove = findIndexForRole(roles, roleToRemove);
    
    if (indexToRemove === -1) {
        console.log("Did not find existing role to revoke", roleToRemove);
    } else {
        roles.splice(indexToRemove, 1);
        updateUserInformation(userIdentifier, userInformation);
    }
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

function makeStoredCredentials(userIdentifier, password) {
    var salt = pointrelUtility.calculateSHA256("toolsOfAbundance" + Math.random() + new Date().toISOString());
    // TODO: client-side hashing of password: var hashOfPassword = PointrelClient.calculateSHA256(salt + PointrelClient.calculateSHA256("irony" + newUserIdentifier + password));
    var hashOfPassword = pointrelUtility.calculateSHA256(salt + password);
    var userCredentials = {
        userIdentifier: userIdentifier,
        salt: salt,
        hashOfPassword: hashOfPassword
    };
    return userCredentials;
}

function setUserPassword(userIdentifier, password) {
    var userCredentials = makeStoredCredentials(userIdentifier, password);
    
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

function updateSuperuser(superuserIdentifier, password) {
    if (!superuserIdentifier) superuserIdentifier = "superuser";
    
    if (!password) {
        readPassword(doUpdate);
    } else {
        doUpdate(password);
    }
    
    function doUpdate(password) {
        if (!password) {
            console.log("no password entered -- doing nothing");   
        } else {
            // console.log("using password", "'" + password + "'");
            var userCredentials = makeStoredCredentials(superuserIdentifier, password);
            fs.writeFileSync("superuserInformation.json", JSON.stringify(userCredentials));
            console.log("Wrote file: superuserInformation.json");
        }
    }  
}

main();