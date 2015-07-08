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
                m("label", {"for": "jn3"}, "Journal: "),
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
    allProjectsModel.projects.push({name: journalName()});
    toaster.toast("Unfinished");
}

function addUserClicked() {
    console.log("addJournalClicked", userName(), userPassword());
    userPassword("");
    toaster.toast("Unfinished");
}

function accessClicked(grantOrRevoke: string) {
    console.log("accessClicked", grantOrRevoke, userName(), roleName(), journalName(), topicName());
    toaster.toast("Unfinished");
}

function grantAnonymousAccessToJournalForSurveysClicked() {
    console.log("grantAnonymousAccessToJournalForSurveysClicked", journalName());
    toaster.toast("Unfinished");
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
    console.log("++++++++++++++++++++++++++++++++++++++++ updateServerStatus", text);
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

