import toaster = require("./panelBuilder/toaster");
import PanelBuilder = require("./panelBuilder/PanelBuilder");
import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");
import PointrelClient = require("./pointrel20150417/PointrelClient");
import m = require("mithril");

"use strict";

var narrafirmaProjectPrefix = "NarraFirmaProject-";

var usersJournalIdentifier = "users";
var projectAdministrationTopic = "ProjectAdministration";

var userIdentifier;

var pointrelClient: PointrelClient;

var allProjectsModel = {
    users: {},
    projects: []
};

var lastServerError = "";
// For this local instance only (not shared with other users or other browser tabs)
var clientState = {
    debugMode: null,
    serverStatus: "narrafirma-serverstatus-ok",
    serverStatusText: ""
};

// TODO: Change this to use Mithril and update it to use new approach to projects, users, and roles
console.log("UNFINISHED!!!");
// alert("Unfinished");

var journalName = m.prop("");
var userName = m.prop("");
var userPassword = m.prop("");
var roleName = m.prop("");
var topicName = m.prop("");

var AdminPageDisplayer: any = {
    controller: function(args) {
        console.log("AdminPageDisplayer created");
    },
    
    view: function(controller, args) {
        var contentsDiv;
        
        console.log("&&&&&&&&&& view called in AdminPageDisplayer");
        
        return m("div.pageContents", {key: "pageContents"}, [
            m("div", [
                m("span[id=narrafirma-name]", {
                    "class": clientState.serverStatus,
                    "title": clientState.serverStatusText
                }, m.trust("NarraFirma&#0153")),
                m("b", "Project Administration Tool"),
                " | Logged in as: " + userIdentifier + " ",
                m("a", {href: "/logout"}, "Log Out")
            ]),
            m("br"),
            m("b", "Projects:"),
            m("br"),
            allProjectsModel.projects.map(function(project) {
               return m("div", [project.name]);
            }),
            m("br"),
            m("b", "Users:"),
            m("br"),
            Object.keys(allProjectsModel.users).map(function(userIdentifier) {
                console.log("userIdentifier", userIdentifier);
                var user = allProjectsModel.users[userIdentifier];
                return m("div", [user.userIdentifier, m("pre", JSON.stringify(user.rolesForJournals, null, 4)), m("br")]);
            }),
            m("br"),
            m("div", [
                m("label", {"for": "jn1"}, "Journal name: " + narrafirmaProjectPrefix),
                m("input", {id: "jn1", value: journalName(), onchange: m.withAttr("value", journalName)}),
                m("br"),
                m("button", {onclick: addJournalClicked}, "Add journal"),
                m("button", {onclick: grantAnonymousAccessToJournalForSurveysClicked}, "Grant anonymous survey access"),
                m("br")
            ]),
            m("br"),
            m("br"),
            m("div", [
                m("label", {"for": "un2"}, "User name: "),
                m("input", {id: "un2", value: userName(), onchange: m.withAttr("value", userName)}),
                m("br"),
                m("label", {"for": "p2"}, "Password: "),
                m("input", {id: "p2", value: userPassword(), onchange: m.withAttr("value", userPassword), disabled: userName().trim() === "anonymous"}),
                m("br"),
                m("button", {onclick: addUserClicked}, "Add user"),
                m("br")
            ]),
            m("br"),
            m("br"),
            m("div", [
                m("label", {"for": "un3"}, "User name: "),
                m("input", {id: "un3", value: userName(), onchange: m.withAttr("value", userName)}),
                m("br"),
                m("label", {"for": "r3"}, "Role: "),
                m("input", {id: "r3", value: roleName(), onchange: m.withAttr("value", roleName)}),
                m("span", {style: 'float: left; display: inline-block;'}, "Role should be one of: reader, writer, readerWriter, administrator"),
                m("br"),
                m("label", {"for": "jn3"}, "Journal: " + narrafirmaProjectPrefix),
                m("input", {id: "jn3", value: journalName(), onchange: m.withAttr("value", journalName)}),
                m("br"),
                m("label", {"for": "t3"}, "Topic: "),
                m("input", {id: "t3", value: topicName(), onchange: m.withAttr("value", topicName)}),
                m("br"),
                m("button", {onclick: accessClicked.bind(null, "grant")}, "Grant"),
                m("button", {onclick: accessClicked.bind(null, "revoke")}, "Revoke"),
                m("br")
            ])
        ]);
    }
};

function addJournalClicked() {
    console.log("addJournalClicked", journalName());
    addJournal(narrafirmaProjectPrefix + journalName().trim());
    allProjectsModel.projects.push({name: journalName().trim()});
}

function addUserClicked() {
    console.log("addJournalClicked", userName(), userPassword());
    addUser(userName().trim(), userPassword());
    userPassword("");
}

function accessClicked(grantOrRevoke: string) {
    console.log("accessClicked", grantOrRevoke, userName(), roleName(), journalName(), topicName());
    
    if (grantOrRevoke === "grant") {
        grantRole(userName().trim(), roleName().trim(), narrafirmaProjectPrefix + journalName().trim(), topicName().trim());
    } else if (grantOrRevoke === "revoke") {
        revokeRole(userName().trim(), roleName().trim(), narrafirmaProjectPrefix + journalName().trim(), topicName().trim());
    } else {
        throw new Error("Unexpected case for grantOrRevoke: " + grantOrRevoke);
    }
}

function grantAnonymousAccessToJournalForSurveysClicked() {
    console.log("grantAnonymousAccessToJournalForSurveysClicked", journalName());
    grantAnonymousSurveyAccessToJournal(narrafirmaProjectPrefix + journalName().trim());
}

function initialize(theUserIdentifier, theProjects) {
    console.log("initialize called in site.js");
    toaster.createToasterWidget(document.getElementById("toasterDiv"));
    
    userIdentifier = theUserIdentifier;
    allProjectsModel.projects = theProjects;
    
    // turn off initial "please wait" display
    document.getElementById("pleaseWaitDiv").style.display = "none";
    document.getElementById("pageDiv").style.display = "block";
   
    // toaster.toast("Running...");
    
    m.mount(document.getElementById("pageDiv"), AdminPageDisplayer);
    
    var userCredentials = {userIdentifier: userIdentifier};
    
    pointrelClient = new PointrelClient("/api/pointrel20150417", usersJournalIdentifier, userCredentials, messageReceived, updateServerStatus);
    pointrelClient.startup();

    pointrelClient.reportJournalStatus(function(error, response) {
        console.log("reportJournalStatus response", error, response);
        if (error) {
            console.log("Failed to startup project", error);
            alert("Problem connecting to journal on server. Application will not run.");
            // document.getElementById("pleaseWaitDiv").style.display = "none";
            // TODO: Sanitize journalIdentifier
            document.body.innerHTML += '<br>Problem connecting to project journal on server for: "<b>' + usersJournalIdentifier + '</b>"';
        } else {
            var permissions = response.permissions;
            if (!permissions.read) {
                alert("No read access -- try logging in first as an administrator");
                return;
            }
            if (!permissions.write) {
                alert("No write access -- try logging in first as an administrator");
            }
        }
    });
}

function messageReceived(message)  {
    if (message._topicIdentifier && message._topicIdentifier.type === "userInformation") {
        console.log("userInformation", message.change);
        // TODO: Should really check timestamps rather than use last...
        allProjectsModel.users[message.change.userIdentifier] = message.change;
        // TOOO: Queue a redraw now, but might want to wait until idle instead...
        m.redraw();
    }
}

// TODO: Duplicate of what is in application.js
// TODO: Think more about how to integrate updatedServerStatus this with Mithril
function updateServerStatus(status, text) {
    // console.log("++++++++++++++++++++++++++++++++++++++++ updateServerStatus", text);
    // The serverStatusPane may be created only after we start talking to the server
    // if (!serverStatusPane) return;
    
    var nameDiv = document.getElementById("narrafirma-name");
    if (!nameDiv) return;
    
    // TODO: Translate
    
    var statusText = "Server status: (" + status + ") " + text;

    if (status === "ok") {
        nameDiv.className = "narrafirma-serverstatus-ok";
        //nameDiv.style.color = "green";
        //nameDiv.style.border = "initial";
        lastServerError = "";
    } else if (status === "waiting") {
        //nameDiv.style.color = "yellow";
        if (lastServerError) {
            // TODO: Translate
            nameDiv.className = "narrafirma-serverstatus-waiting-last-error";
            statusText += "\n" + "Last error: " + lastServerError;
        } else {
            nameDiv.className = "narrafirma-serverstatus-waiting";
        }
    } else if (status === "failure") {
        nameDiv.className = "narrafirma-serverstatus-failure";
        //nameDiv.style.color = "red";
        lastServerError = text;
        //nameDiv.style.border = "thick solid #FF0000";
        console.log("updateServerStatus failure", text);
    } else {
        console.log("Unexpected server status", status);
        nameDiv.className = "narrafirma-serverstatus-unexpected";
        //nameDiv.style.color = "black";
        console.log("updateServerStatus unexepected", text);
    }
    
    nameDiv.title = statusText;
    clientState.serverStatus = nameDiv.className;
    clientState.serverStatusText = statusText;
}

function addJournal(journalIdentifier) {
    console.log("add-journal", journalIdentifier);
    
    toaster.toast("Unfinished");
    
    pointrelServer.addJournalSync(journalIdentifier);
}

function addUser(userIdentifier, password) {
    console.log("add-user", userIdentifier, password);
    
    if (userIdentifier === "anonymous") {
        console.log("anonymous user is special and the password will not be used");
    }
    
    // Check if user exists first, as otherwise will remove all roles and override other settings
    var userInformation = allProjectsModel.users[userIdentifier];
    if (userInformation) {
        console.log("User already exists", userIdentifier);
        // toaster.toast("User already exists: " + userIdentifier);
        if (confirm("User already exists. Do you want to change the password of: " + userIdentifier + "?")) {
            setUserPassword(userIdentifier, password);
        }
        return;
    }
    
    updateUserInformation(userIdentifier);
    setUserPassword(userIdentifier, password);
}

function findIndexForRole(roles, role) {
    var index = -1;
    var roleStringified = JSON.stringify(role);
    for (var i = 0; i < roles.length; i++) {
        if (JSON.stringify(roles[i]) === roleStringified) {
            index = i;
            break;
        }
    }
    return index;
}

// TODO: All this role granting and revoking could suffer from multi-user collisions

function grantRole(userIdentifier, role, journalIdentifier, topic) {
    console.log("grant", userIdentifier, role, journalIdentifier, topic);
    
    // Make sure the user already exists
    var userInformation = allProjectsModel.users[userIdentifier];
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        toaster.toast("Error: could not find user: " + userIdentifier);
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
        console.log("Error: User already has role", roleToAdd);
        toaster.toast("Error: User already has role: " + roleToAdd);
    } else {
        roles.push(roleToAdd);
        updateUserInformation(userIdentifier, userInformation);
    }
}

function grantAnonymousSurveyAccessToJournal(journalIdentifier) {
    console.log("grantAnonymousSurveyAccessToJournal", journalIdentifier);
    
    var userIdentifier = "anonymous";
    
    // Make sure the user already exists
    var userInformation = allProjectsModel.users[userIdentifier];
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        toaster.toast("Error: could not find user: " + userIdentifier);
        return;
    }
    
    var example = {"NarraFirmaProject-test1": [
        {
          "role": "writer",
          "topic": "surveyResults"
        },
        {
          "role": "reader",
          "topic": "questionnaires"
        }
      ]};
    
    // TODO: Should confirm the journal exists...
    
    var roles = userInformation.rolesForJournals[journalIdentifier];
    if (!roles) {
        roles = [];
        userInformation.rolesForJournals[journalIdentifier] = roles;
    }

    // Fields need to be in alphabetical order for JSON comparison with messages stored in canonical form
    var readerRoleToAdd = {role: "reader", topic: "questionnaires"};

    var changed = false;
    if (findIndexForRole(roles, readerRoleToAdd) === -1) {
        roles.push(readerRoleToAdd);
        changed = true;
    }
 
    var writerRoleToAdd = {role: "writer", topic: "surveyResults"};
    if (findIndexForRole(roles, writerRoleToAdd) === -1) {
        roles.push(writerRoleToAdd);
        changed = true;
    }
    
    if (changed) {
        updateUserInformation(userIdentifier, userInformation);
    } else {
        toaster.toast("Roles already exist; no changes made.");
    }
}

function revokeRole(userIdentifier, role, journalIdentifier, topic) {
    console.log("revoke", userIdentifier, role, journalIdentifier, topic);
    
    // Make sure the user already exists
    var userInformation = allProjectsModel.users[userIdentifier];
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        toaster.toast("Error: could not find user: " + userIdentifier);
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
        toaster.toast("Error: Did not find existing role to revoke: " + roleToRemove);
    } else {
        roles.splice(indexToRemove, 1);
        updateUserInformation(userIdentifier, userInformation);
    }
}

/// Support functions to change server data

function updateUserInformation(userIdentifier, userInformation = undefined) {
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

    pointrelClient.sendMessage(createUserMessage, function(error, response) {
        if (error || !response.success) {
            console.log("Error updating user information: ", error, response);
            // TODO: Imporve error reporting
            toaster.toast("Error updating user information: " + error + " :: " + JSON.stringify(response));
        } else {
            console.log("OK:", response);
            toaster.toast("Updated user information OK");
        }
    });
}

function setUserPassword(newUserIdentifier, password) {
    var userCredentials = {userIdentifier: newUserIdentifier, userPassword: password};

    var credentialsMessage = {
        "_topicIdentifier": {type: "authenticationInformation", userIdentifier: newUserIdentifier},
        "_topicTimestamp": new Date().toISOString(),
        change: userCredentials
    };

    // Throwaway single-use pointrel client instance to access credentials journal
    var singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "credentials", {userIdentifier: userIdentifier});
    singleUsePointrelClient.sendMessage(credentialsMessage, function(error, response) {
        if (error || !response.success) {
            console.log("Error setting user password:", error, response);
            // TODO: Improve error reporting
            toaster.toast("Error: setting user password: " + error + " :: " + JSON.stringify(response));
        } else {
            console.log("Password change OK:", response);
            toaster.toast("Password changed OK");
        }
    });
}

function startup() {
    // Throwaway single-use pointrel client instance which does not access a specific journal
    var singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
    singleUsePointrelClient.getCurrentUserInformation(function(error, response) {
        if (error) {
            console.log("error", error, response);
            alert("Something went wrong determining the current user identifier");
            return;
        }
        
        // Identical code in applications to get project list
        var projects = [];
        for (var key in response.journalPermissions) {
            if (!_.startsWith(key, narrafirmaProjectPrefix)) continue;
            var permissions = response.journalPermissions[key];
            projects.push({
                id: key,
                name: key.substring(narrafirmaProjectPrefix.length),
                read: permissions.read,
                write: permissions.write,
                admin: permissions.admin
            });
        }
        
        initialize(response.userIdentifier, projects);
    });
}
 
startup();

