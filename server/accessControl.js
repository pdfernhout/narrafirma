/*jslint node: true */
"use strict";

var pointrelServer = require("./pointrel20150417/pointrelServer");
// var pointrelUtility = require("./pointrel20150417/pointrelUtility");

function initialize() {
    pointrelServer.configure({
        isAuthenticatedCallback: isAuthenticated,
        isAuthorizedCallback: isAuthorized
    });
}

function isAuthenticated(userIdentifier, userCredentials) {
    console.log("isAuthenticated", userIdentifier, userCredentials);
    var result = false;
    var user = getAccessConfigurationForUser(userIdentifier);
    if (user && user.password === userCredentials.userPassword) result = true;
    console.log("isAuthenticated:", result);
    return result;
}

function splitAtWhitspace(text) {
    if (!text) return [];
    return text.match(/\S+/g);
}

function isUserInAccessList(userIdentifier, accessListOfUsersAndGroups) {
    if (accessListOfUsersAndGroups.indexOf(userIdentifier) !== -1) return true;
    // Also check for group matches as well as name matches
    // Find user object to know about groups user is in
    var user = getAccessConfigurationForUser(userIdentifier);
    if (user === null) user = anonymousUser;
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
    if (!accessConfigurationForJournal) {
        console.log("No access control has been set up for", journalIdentifier);
        return true;
    }
    
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
    console.log("permitted", permitted);
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
    
    var message = pointrelServer.latestMessageForTopicSync("NarraFirma-administration", "ProjectAdministration");
    // TODO: Need to think more about what happens if authentication data might be messed up
    if (!message) return null;
    
    var accessConfiguration = message.change;
    // console.log("accessConfiguration", accessConfiguration);
    return accessConfiguration;
}

function getAccessConfigurationForJournal(journalIdentifier) {
    console.log("getAccessConfigurationForJournal", journalIdentifier);
    var accessConfiguration = getAccessConfiguration();
    if (!accessConfiguration) return null;

    for (var i = 0; i < accessConfiguration.projects.length; i++) {
        var project = accessConfiguration.projects[i];
        console.log("project", project);
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
    if (!userIdentifier) return null;
    
    var accessConfiguration = getAccessConfiguration();
    if (!accessConfiguration) return null;

    for (var i = 0; i < accessConfiguration.users.length; i++) {
        var user = accessConfiguration.users[i];
        // TODO: Should support any type of user identifier, not just strings
        if (user.email === userIdentifier) {
            return user;
        }
    }
    return null;
}

exports.initialize = initialize;
