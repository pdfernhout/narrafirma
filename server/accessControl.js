/*jslint node: true */
"use strict";

var pointrelServer = require("./pointrel20150417/pointrelServer");
var pointrelUtility = require("./pointrel20150417/pointrelUtility");

function initialize() {
    pointrelServer.configure({
        isAuthenticatedCallback: isAuthenticated,
        isAuthorizedCallback: isAuthorized
    });
}

function isAuthenticated(userIdentifier, userCredentials) {
    // console.log("isAuthenticated", userIdentifier, userCredentials);
    var user = getAccessConfigurationForUser(userIdentifier);
    if (user && user.password === userCredentials) return true;
    return false;
}

function splitAtWhitspace(text) {
    if (!text) return [];
    return text.split(/(\s+)/);
}

function isUserInAccessList(userIdentifier, accessListOfUsersAndGroups) {
    if (accessListOfUsersAndGroups.indexOf(userIdentifier) !== -1) return true;
    // Also check for group matches as well as name matches
    // Find user object to know about groups user is in
    var user = getAccessConfigurationForUser(userIdentifier);
    var groups = splitAtWhitspace(user.groups);
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        if (accessListOfUsersAndGroups.indexOf(group) !== -1) return true;
    }
    return false;
}

function isAuthorized(journalIdentifier, userIdentifier, requestedAction) {
    console.log("isAuthorized", journalIdentifier, userIdentifier, requestedAction);

    var accessConfigurationForJournal = getAccessConfigurationForJournal(journalIdentifier);
    
    // No restrictions have been set up -- TODO: Should the default be the other way? Then need superuser?
    if (!accessConfigurationForJournal) return true;
    
    var permitted = false;
    
    // TODO: Need to change categories so readWrite, readOnly, and writeOnly
    
    // Check if access is permitted
    if (requestedAction === "write") {
        var editors = splitAtWhitspace(accessConfigurationForJournal.editors);
        console.log("editors", editors);
        permitted = isUserInAccessList(userIdentifier, editors);
    } else if (requestedAction === "read") {
        var viewers = splitAtWhitspace(accessConfigurationForJournal.viewers);
        console.log("viewers", viewers);
        permitted = isUserInAccessList(userIdentifier, viewers);
    }
    
    // TODO: Need to think about admin function
    // TODO: Need to think about survey takers
    return permitted;
}

//This assumes the callback will be synchronous and containe the messages, which is true at the moment with a default of caching the messages
function getAccessConfiguration() {
    var request = {
        action: "pointrel20150417_queryForLatestMessage",
        journalIdentifier: "NarraFirma-administration",
        topicIdentifier: "ProjectAdministration"
    };
    var result = null;
    // Important: Assuming processRequest for this request actually synchronous in practice and that message caching is enabled
    pointrelServer.processRequest(request, function (response) {
        // console.log("getAccessConfigurationForJournal response", response);
        // TODO: Need to think more about what happens if authentication data might be messed up
        if (!response.success || !response.latestRecord || !response.latestRecord.messageContents || response.latestRecord.messageContents.messageType !== "ProjectAdministration-SetAll") {
            result = null;
        } else {
            var accessConfiguration = response.latestRecord.messageContents.change;
            result = accessConfiguration;
        }
    });
    // console.log("accessConfiguration result", result);
    return result;
}

function getAccessConfigurationForJournal(journalIdentifier) {
    var accessConfiguration = getAccessConfiguration();
    if (!accessConfiguration) return null;

    for (var i = 0; i < accessConfiguration.projects.length; i++) {
        var project = accessConfiguration.projects[i];
        // TODO: Should support any type of journal identifier, not just strings
        if (project.id === journalIdentifier) {
            return project;
        }
    }
    return null;
}

// TODO: Fix this to have better user ID and maybe other information
var anonymousUser = {
   email: "anonymous",
   groups: ""
};

function getAccessConfigurationForUser(userIdentifier) {
    var accessConfiguration = getAccessConfiguration();
    if (!accessConfiguration) return null;

    for (var i = 0; i < accessConfiguration.users.length; i++) {
        var user = accessConfiguration.users[i];
        // TODO: Should support any type of user identifier, not just strings
        if (user.email === userIdentifier) {
            return user;
        }
    }
    return anonymousUser;
}

exports.initialize = initialize;
