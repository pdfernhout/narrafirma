/*jslint node: true */
"use strict";

// Provides a standard default type of access control based on users with roles per journal
// Roles define one or more actions a user can perform on a journal

// User information including role per journal is stored in "users".

// Password credentials are stored in "credentials".

// Information about journals like a short description of the purpose is stored in "journals".

// Right now, only four default roles are supported: read, write, readWrite, and administrate
// Eventually, these could be stored in a journal if more are required.
// These are of the form: "roll: {action: true}"
var allRoles = {
    reader: {read: true},
    writer: {write: true},
    readerWriter: {read: true, write: true},
    administrator: {read: true, write: true, administrate: true}
};

// This defines what the superuser can do and is also a reference for all permissions
// TODO: Need to expand this by hand if add more permissions; how can this be improved?
var allPermissions = {
    read: true,
    write: true,
    administrate: true
};

var fs = require('fs');

var pointrelServer = require("./pointrelServer");

var defaultSuperuserInformationFilename = "./superuserInformation.json";

var credentialsJournalIdentifier = "credentials";
var usersJournalIdentifier = "users";
    
// TODO: Fix this to have better user ID and maybe other information
var anonymousUser = {
   userIdentifier: "anonymous",
   groups: ""
};

// TODO: Perhaps rethink superuser idea to have least priviledges?
// Example user user information: {userIdentifier: "superuser", userPassword: "secret"}
var superuserInformation;

function initialize(superuserInformationOrFilename) {
    pointrelServer.configure({
        isAuthenticatedCallback: isAuthenticated,
        isAuthorizedCallback: isAuthorized
    });
    if (!superuserInformationOrFilename) superuserInformationOrFilename = defaultSuperuserInformationFilename;
    if (typeof superuserInformationOrFilename === "string") {
        readSuperuserInformation(superuserInformationOrFilename);
    } else {
        superuserInformation = superuserInformationOrFilename;
    }
}

// TODO: Hashing of passwords
// TODO: Remove logging of credentials

// Get superuser information from special place, like server-data folder for initial system configuration
function readSuperuserInformation(superuserInformationFilename) {
    console.log("readSuperuserInformation", superuserInformationFilename);
    var fileContents;
    
    try {
        fileContents = fs.readFileSync(superuserInformationFilename);
    } catch (e) {
        console.log("ERROR: Problem reading superuser information from file", superuserInformationFilename, e);
    }
    
    if (!fileContents) return;
    
    try {
        superuserInformation = JSON.parse(fileContents);
    } catch (e) {
        console.log("ERROR: Problem parsing JSON in superuser information from file", superuserInformationFilename, fileContents.toString(), e);
    }
}

// Authentication

function isAuthenticated(userIdentifier, userCredentials) {
    console.log("isAuthenticated", userIdentifier, userCredentials);
    var result = false;
    
    if (superuserInformation && userIdentifier === superuserInformation.userIdentifier) {
        // Handle superuser specially
        result = superuserInformation.userPassword === userCredentials.userPassword;
    } else {
        // Handle regular user
        var authenticationInformation = getAuthenticationInformationForUser(userIdentifier);
        console.log("authenticationInformation", authenticationInformation);
        if (authenticationInformation && authenticationInformation.userPassword === userCredentials.userPassword) result = true;
    }
    
    console.log("isAuthenticated:", result);
    return result;
}

// authenticationInformation should have the form:
// {userIdentifier: "the-user", userPassword: "secret"}
function getAuthenticationInformationForUser(userIdentifier) {
    var authenticationInformationTopicForUser = {type: "authenticationInformation", userIdentifier: userIdentifier};
    var message = pointrelServer.latestMessageForTopicSync(credentialsJournalIdentifier, authenticationInformationTopicForUser);
    
    if (!message) return null;
    
    var authenticationInformation = message.change;
    // console.log("authenticationInformation", authenticationInformation);
    return authenticationInformation;
}

// Authorization

// userInformation should have the form:
// {userIdentifier: userIdentifier, roles: ["role1", "role2", ...], name: "Long name", email: "test@example.com"}

/*
var exampleUserInformation = {
    userIdentifier: "tester1",
    name: "Tester One",
    email: "tester1@example.com",
    rolesForJournals: {
        "users": ["reader"],
        "journal1": ["reader", "writer"],
        "journal2": ["readerWriter"],
        "journal3": ["administrator"],
        "journal4": ["writer"]
    }
};

// How to grant anonymous write access to a specific journal to push messages:
// TODO: Should the userIdentifier be "anonymous", null, or undefined?
var exampleAnonymousUserInformation = {
    userIdentifier: "anonymous",
    name: "Anonymous User",
    email: null,
    rolesForJournals: {
        "journal4": ["writer"]
    }
};

// And how to also grant that write access to everyone else, too?
// Want to use a "group" of all users to assign a role? Maybe good enough to have "authenticated" and "unauthenticed" users? And merge in permissions?
// Or maybe better to have users always in "authenticated" group, and also have them in arbitrary other groups? And then assign permissions to groups?
// Could do later for future version....
// Also want to distinguish user from group somehow, either with prefix for one or other or both, or having object for one or both with type
var exampleGroupInformation = {
    userIdentifier: "authenticated",
    name: "Authenticated User",
    email: null,
    rolesForJournals: {
        "journal4": ["writer"]
    }
};
*/

function makeUnionOfPermissionsForUser(rolesForJournal) {
    // Make union of permissions
    var unionOfPermissionsForUser = {};
    for (var i = 0; i < rolesForJournal.length; i++) {
       var role = rolesForJournal[i];
       var permissionsForRole = allRoles[role];
       if (!permissionsForRole) {
           console.log("ERROR: Missing permissions for role", role);
       } else {
           for (var key in permissionsForRole) {
               unionOfPermissionsForUser[key] = unionOfPermissionsForUser[key] || permissionsForRole[key];
           }
       }
    }
    return unionOfPermissionsForUser;
}

function isAuthorized(journalIdentifier, userIdentifier, requestedAction) {
    if (superuserInformation && userIdentifier === superuserInformation.userIdentifier) {
        // Handle superuser specially
        return true;
    }
    
    // Handle regular user
    var userInformation = getUserInformationForUser(userIdentifier);
    
    if (!userInformation) {
        console.log("ERROR: isAuthorized: userInformation was missing for", userIdentifier);
        return false;
    }
    
    var rolesForJournal = userInformation.rolesForJournals[journalIdentifier];
    if (!rolesForJournal) return false;
    
    var unionOfPermissionsForUser = makeUnionOfPermissionsForUser(rolesForJournal);
    
    return unionOfPermissionsForUser[requestedAction] || false;
}

function getUserInformationForUser(userIdentifier) {
    var userInformationTopicForUser = {type: "userInformation", userIdentifier: userIdentifier};
    var message = pointrelServer.latestMessageForTopicSync(usersJournalIdentifier, userInformationTopicForUser);
    
    if (!message) return null;
    
    var userInformation = message.change;
    // console.log("userInformation", userInformation);
    return userInformation;
}


// Enumerating

// TODO: What to do about returning extra information about journals like a description or name?
/* Older idea:
var projectInformation = {
        id: project.id,
        name: project.name,
        description: project.description,
        canRead: canRead,
        canWrite: canWrite
    };
*/

// This is intended to provide results the end user could consult to decide what journals to interact with of the ones accessible
function determineJournalsAccessibleByUser(userIdentifier) {
    var results = {};
    var journalIdentifier;
    
    if (superuserInformation && userIdentifier === superuserInformation.userIdentifier) {
        // Handle superuser specially
        // Get entire list of all journals for superuser
        var journalIdentifiers = pointrelServer.getAllJournalIdentifiers();
        for (var i = 0; i < journalIdentifiers.length; i++) {
            journalIdentifier = journalIdentifiers[i];
            results[journalIdentifier] = allPermissions;
        }
        return results;
    } 
    
    // Handle regular user
    var userInformation = getUserInformationForUser(userIdentifier);
    
    if (!userInformation) {
        console.log("ERROR: determineJournalsAccessibleByUser: userInformation was missing for", userIdentifier);
        return results;
    }

    for (journalIdentifier in userInformation.rolesForJournals) {
        var rolesForJournal = userInformation.rolesForJournals[journalIdentifier];
        var unionOfPermissionsForUser = makeUnionOfPermissionsForUser(rolesForJournal);
        // TODO: Might want to omit results if there are no true values for permissions for a journal?
        results[journalIdentifier] = unionOfPermissionsForUser;
    }
    
    return results;
}

exports.initialize = initialize;
exports.isAuthenticated = isAuthenticated;
exports.isAuthorized = isAuthorized;
exports.determineJournalsAccessibleByUser = determineJournalsAccessibleByUser;
