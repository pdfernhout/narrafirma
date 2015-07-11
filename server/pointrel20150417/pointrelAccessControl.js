/*jslint node: true */
"use strict";

var utility = require('./pointrelUtility');

// Provides a standard default type of access control based on users with roles per journal
// Roles define one or more actions a user can perform on a journal

// User information including role per journal is stored in "users".

// Password credentials are stored in "credentials".

// Information about journals like a short description of the purpose is stored in "journals".

// Right now, only four default roles are supported: read, write, readWrite, and administrate
// Eventually, these could be stored in a journal if more are required.
// These are of the form: "role: {action: true}"
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
   rolesForJournals: {}
};

// TODO: Perhaps rethink superuser idea to have least priviledges?
// Example user user information: {userIdentifier: "superuser", userPassword: "secret"}
var superuserInformation;

function initialize(superuserInformationOrFilename) {
    pointrelServer.configure({
        isAuthenticatedCallback: isAuthenticated,
        isAuthorizedCallback: isAuthorized,
        determineJournalsAccessibleByUserCallback: determineJournalsAccessibleByUser
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

// TODO: Should use a CSPRNG instead of Math.random()

function isMatchingPassword(storedAuthenticationInformation, suppliedUserCredentials) {
    // TODO: client-side hashing of password: var hashOfPassword = PointrelClient.calculateSHA256(salt + PointrelClient.calculateSHA256("irony" + newUserIdentifier + password));
    // console.log("isMatchingPassword", storedAuthenticationInformation, suppliedUserCredentials);
    var calculatedHash = utility.calculateSHA256("" + storedAuthenticationInformation.salt + suppliedUserCredentials.userPassword);
    // console.log("calculatedHash", calculatedHash);
    return storedAuthenticationInformation.hashOfPassword === calculatedHash;
}

function isAuthenticated(userIdentifier, userCredentials) {
    console.log("isAuthenticated", userIdentifier, userCredentials);
    var result = false;
    
    if (superuserInformation && userIdentifier === superuserInformation.userIdentifier) {
        // Handle superuser specially
        result = isMatchingPassword(superuserInformation, userCredentials);
    } else {
        // Handle regular user
        var authenticationInformation = getAuthenticationInformationForUser(userIdentifier);
        console.log("authenticationInformation", authenticationInformation);
        if (authenticationInformation && isMatchingPassword(authenticationInformation, userCredentials)) result = true;
    }
    
    console.log("isAuthenticated:", result);
    return result;
}

// Stored authentication information should have the form:
// {userIdentifier: "the-user", salt: "someSalt", hashOfPassword: "sha256-hash-of-someSalt+secret"}
// Supplied credentials should have the form:
// {userIdentifier: "the-user", userPassword "secret"}
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

function makeUnionOfPermissionsForUser(rolesForJournal, topic, messageType, apiRequest) {
    // Make union of permissions
    var unionOfPermissionsForUser = {};
    for (var i = 0; i < rolesForJournal.length; i++) {
       var role = rolesForJournal[i];
       if (role && typeof role === 'object') {
           // Special case of permission only for a specific topic and/or messageType and/or size; the last two are mainly an issue when writing
           if (role.topic && role.topic !== topic) continue;
           if (role.messageType && role.messageType !== messageType) continue;
           // This length limit check happens after any length limit check for the entire request using bodyParser, and so is inefficient
           if (role.lengthLimit && role.lengthLimit < JSON.stringify(apiRequest).length) continue;
           role = role.role;
       }
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

function isAuthorized(journalIdentifier, userIdentifier, requestedAction, apiRequest, request) {
    // console.log("==== isAuthorized for request?", apiRequest);
    
    // Ensure there is a userIdentifier that is a valid JavaScript object (includes null and "" and 0)
    if (userIdentifier === undefined) {
        console.log("ERROR: isAuthorized: userIdentifier was undefined");
        return false;
    }
    
    // Handle superuser specially
    if (superuserInformation && userIdentifier === superuserInformation.userIdentifier) {
        return true;
    }
    
    // Handle regular user or anonymous user
    var userInformation = getUserInformation(userIdentifier);
    
    if (!userInformation) {
        if (userIdentifier === "anonymous") {
            // Handle anonymous user specially if it has not been otherwise defined
            userInformation = anonymousUser;
        } else {
            console.log("ERROR: isAuthorized: userInformation was missing for", userIdentifier);
            return false;
        }
    }
    
    var rolesForJournal = userInformation.rolesForJournals[journalIdentifier];
    if (!rolesForJournal) rolesForJournal = [];
    
    var topic;
    var messageType;
    if (apiRequest) {
        if (apiRequest.action === "pointrel20150417_loadMessage" || apiRequest.action === "pointrel20150417_queryForNextMessage" || apiRequest.action === "pointrel20150417_queryForLatestMessage") {
            topic = apiRequest.topicIdentifier;
        } else if (apiRequest.action === "pointrel20150417_storeMessage" && apiRequest.message) {
            topic = apiRequest.message._topicIdentifier;
            messageType = apiRequest.message.messageType;
        }
    }
    
    var unionOfPermissionsForUser = makeUnionOfPermissionsForUser(rolesForJournal, topic, messageType, apiRequest);
    
    if (unionOfPermissionsForUser[requestedAction]) return true;
    
    // TODO: Probably will eventually want an "authenticated" group in addition to an anonymous user, and perhaps arbitrary groups in general
    
    if (userIdentifier !== "anonymous") {
        // Grant a regular user all priviledges of an anonymous one
        var isAnonymousAuthorized = isAuthorized(journalIdentifier, "anonymous", requestedAction, apiRequest, request);
        if (isAnonymousAuthorized) return true;
    }
    
    // TODO: The user is not generally authorized to do this action in the journal, but, there might be additional authorization for the topic
    
    return false;
}

function getUserInformation(userIdentifier) {
    if (superuserInformation && userIdentifier === superuserInformation.userIdentifier) {
        // Handle superuser specially
        // TODO: Maybe fill in more information?
        return {
            userIdentifier: userIdentifier,
            name: "superuser",
            email: null,
            rolesForJournals: {
                // TODO: What to put here?
            }
        };
    }
    
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
    var userInformation = getUserInformation(userIdentifier);
    
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
exports.getUserInformation = getUserInformation;