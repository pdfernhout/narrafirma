import toaster = require("./panelBuilder/toaster");
import PointrelClient = require("./pointrel20150417/PointrelClient");
import m = require("mithril");
import _ = require("lodash");

"use strict";

const narrafirmaProjectPrefix = "NarraFirmaProject-";

const usersJournalIdentifier = "users";
const projectAdministrationTopic = "ProjectAdministration";

let userIdentifier;

let pointrelClient: PointrelClient;

const allProjectsModel = {
    users: {},
    projects: []
};

let lastServerError = "";
// For this local instance only (not shared with other users or other browser tabs)
let clientState = {
    debugMode: null,
    serverStatus: "narrafirma-serverstatus-ok",
    serverStatusText: ""
};

let journalName = m.prop("");
let userName = m.prop("");
let userPassword = m.prop("");
let roleName = m.prop("");
let topicName = m.prop("");

let userToDisplay;

(<any>window).projectAdmin_selectRole = function(theRole) {
    console.log("projectAdmin_selectRole", theRole);
    roleName(theRole);
    m.redraw();
};

(<any>window).projectAdmin_selectJournal = function(theJournal) {
    console.log("projectAdmin_selectJournal", theJournal);
    journalName(theJournal);
    m.redraw();
};

(<any>window).projectAdmin_selectUser = function(theUser) {
    console.log("projectAdmin_selectUser", theUser);
    userToDisplay = theUser;
    userName(theUser);
    m.redraw();
};

const AdminPageDisplayer: any = {
    controller: function(args) {
        console.log("AdminPageDisplayer created");
    },
    
    view: function(controller, args) {
        const buttonStyleText = "margin-left: 1em;"
        const labelStyleText = "margin-right: 0.25em";
        const hrStyleText = "display: block; clear: both; height: 2px; border-top: 2px solid #c5d2eb; background-color: #c5d2eb; margin-top: 1em; margin-right: 1em; border-radius: 5px;";
        let chooseProjectLink;
        let isWordPressAJAX = !!window["ajaxurl"];
        if (!isWordPressAJAX) {
            chooseProjectLink = "\\";
        } else {
            chooseProjectLink = "../webapp/narrafirma.html";
        }
        const pWithStyle = 'p[style="margin-right: 0.5em"]';
        
        return m("div.pageContents", {key: "pageContents"}, [
            // note this style is copied from standard.css (navigationDiv) 
            m("div", {"style": ` 
                background-color: #b0d4d4;
                border-bottom: 4px solid #ffbb84; 
                padding: 0.75em 0.2em 0.2em 0em;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 999;
                width: 100%;
                height: 1.8em;`
            }, [
                m("span[id=narrafirma-name]", {
                    "class": clientState.serverStatus,
                    "title": clientState.serverStatusText
                }, "NarraFirma™"),
                m("b", " Site Administration"),
                m("span", " | " + userIdentifier + " | "),
                m("a", {href: "/logout"}, "Log out"),
                m("span", " | "),
                m("a", {href: chooseProjectLink}, "Open project")
            ]),
            m("hr", {style: hrStyleText}),
            !!userToDisplay ? m("div", {style: "height: 200px; overflow: auto; float: right; min-width: 75%; margin-right: 1em; background: white; border: solid 3px #b0d4d4;"}, [
                m("h3[style='margin-left:0.25em;']", "Roles for user: " + userToDisplay), 
                m("pre", JSON.stringify(allProjectsModel.users[userToDisplay].rolesForJournals, null, 4))
            ]) : m("div", {style: "height: 200px; overflow: auto; float: right; min-width: 75%"}),
            m("h3", "Users"),
            m(pWithStyle, "Click a user name to see their project permissions."),
            // don't show users who have no roles for any existing projects 
            // because there is no real way to remove a user, and it's annoying to have to look at them forever
            Object.keys(allProjectsModel.users).sort().map(function(userIdentifier) {
                const user = allProjectsModel.users[userIdentifier];
                let userHasRoles = false;
                Object.keys(user.rolesForJournals).map(function(journalIdentifier) {
                    if (user.rolesForJournals[journalIdentifier].length > 0) {
                        userHasRoles = true;
                        return;
                    }
                });
                if (userHasRoles) {
                    return m("div[style='white-space:pre']", ["   ", m("a", {href: "javascript:projectAdmin_selectUser('" +  user.userIdentifier + "')"}, user.userIdentifier)]);
                } else {
                    return m("");
                }
            }),

            m("br"),
            m("hr", {style: hrStyleText}),
            m("div", [
                m("h3", "Add New User"),
                m("label[style='" + labelStyleText + "']", {"for": "un2"}, "User name"),
                m("input", {id: "un2", value: userName(), onchange: m.withAttr("value", userName)}),
                m("br"),
                m("label[style='" + labelStyleText + "']", {"for": "p2"}, "Password"),
                m("input", {id: "p2", value: userPassword(), onchange: m.withAttr("value", userPassword), disabled: userName().trim() === "anonymous"}),
                m("button[style='" + buttonStyleText + "']", {onclick: addUserClicked}, "Add User"),
                m("p", "To remove a user, revoke all of their project permissions."),
            ]),

            m("hr", {style: hrStyleText}),
            m("div", [
                m("h3", "Projects"),
                m(pWithStyle, "Click a project name to change its permissions below."),
                allProjectsModel.projects.sort(compareProjects).map(function(project) {
                return m("div[style='white-space:pre']", ["   ", m("a", {href: "javascript:projectAdmin_selectJournal('" +  project.name + "')"}, project.name)]);
                }),
                m("br"),
            ]),

            m("hr", {style: hrStyleText}),
            m("div", [
                m("h3", "Edit Project Permissions"),
                m("label[style='" + labelStyleText + "']", {"for": "jn3"}, "Project: " + narrafirmaProjectPrefix),
                m("input", {id: "jn3", value: journalName(), onchange: m.withAttr("value", journalName)}),
                m("br"),
                m("label[style='" + labelStyleText + "']", {"for": "un3"}, "User name"),
                m("input", {id: "un3", value: userName(), onchange: m.withAttr("value", userName)}),
                m("br"),
                m("label[style='" + labelStyleText + "']", {"for": "r3"}, "Role"),
                m("input", {id: "r3", value: roleName(), onchange: m.withAttr("value", roleName)}),
                m("span", {style: 'float: left; display: inline-block; margin-left:0.5em;'}, "Role should be one of: ", r("reader"), ", ", r("writer"), ", or ", r("administrator")),
                //m("label[style='" + labelStyleText + "']", {"for": "t3"}, "Topic"),
                //m("input", {id: "t3", value: topicName(), onchange: m.withAttr("value", topicName)}),
                //m("br"),
                m("button[style='" + buttonStyleText + "']", {onclick: accessClicked.bind(null, "grant")}, "Grant"),
                m("button[style='" + buttonStyleText + "']", {onclick: accessClicked.bind(null, "revoke")}, "Revoke"),
                m("br"),
                m(pWithStyle, `Readers can view (but not edit) project fields and stories. 
                    Writers can edit project fields and add (and edit and import) stories. 
                    Administrators can also import and reset projects. 
                    Only give write and admin privileges to people you trust.
                    All of these permissions are per project. 
                    Only the site administrator (superuser) account can create new projects and new users.`),
            ]),

            m("hr", {style: hrStyleText}),
            m("div", [
                m("h3", "Create New Project"),
                m(pWithStyle, "A project name can have alphanumeric characters, underscores, dashes, and dots (one dot at a time). " +
                "It cannot include spaces, forward slashes, two or more dots in a row, or non-alphanumeric characters."),
                m("br"),
                m("label[style='" + labelStyleText + "']", {"for": "jn1"}, "Project name: " + narrafirmaProjectPrefix),
                m("input", {id: "jn1", value: journalName(), onchange: m.withAttr("value", journalName)}),
                m("button[style='" + buttonStyleText + "']", {onclick: addJournalClicked}, "Create Project"),
                m("button[style='" + buttonStyleText + "']", {onclick: grantAnonymousAccessToJournalForSurveysClicked}, "Grant Anonymous Survey Access"),
                m("br"),
            ]),

            m("hr", {style: hrStyleText}),
            m("div", [
                m("h3", "Archive Project"),
                m(pWithStyle, `Archiving a project renames its directory to a "hidden" state -- that is, with a full stop (period) in front of it. ` +
                "NarraFirma ignores project directories that start that way. " +
                "The project will disappear from the choose-a-project list (and this page) as soon as the server is restarted. " + 
                "To bring back an archived project, find its directory  (in server_data), remove the full stop (period), and restart the server. " +
                'To permanently delete a project, find its directory and delete it or move it out of the server_data directory.'),
                m("br"),
                m("label[style='" + labelStyleText + "']", {"for": "jn1"}, "Project name: " + narrafirmaProjectPrefix),
                m("input", {id: "jn1", value: journalName(), onchange: m.withAttr("value", journalName)}),
                m("button[style='" + buttonStyleText + "']", {onclick: hideJournalClicked}, "Archive Project"),
                m("br"),
            ]),


        ]);
    }
};

function compareProjects(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

function r(role) {
    return m("a", {href: "javascript:projectAdmin_selectRole('" +  role + "')"}, role);
}

// TODO: Sanitize entered journal names!!!

function addJournalClicked() {
    console.log("addJournalClicked", journalName());
    if (!journalName().trim()) {
        toaster.toast("No journal name was specified");
        return;
    }

    addJournal(narrafirmaProjectPrefix + journalName().trim());
}

function hideJournalClicked() {
    console.log("hideJournalClicked", journalName());
    if (!journalName().trim()) {
        toaster.toast("No journal name was specified");
        return;
    }

    hideJournal(narrafirmaProjectPrefix + journalName().trim());
}

function addUserClicked() {
    console.log("addJournalClicked", userName(), userPassword());
    if (!userName().trim()) {
        toaster.toast("No user name was specified");
        return;
    }
    addUser(userName().trim(), userPassword());
    userPassword("");
}

function accessClicked(grantOrRevoke: string) {
    console.log("accessClicked", grantOrRevoke, userName(), roleName(), journalName(), topicName());
    
    if (!userName().trim()) {
        toaster.toast("No user name was specified");
        return;
    }
    
    if (!roleName().trim()) {
        toaster.toast("No role was specified");
        return;
    }
    
    if (!journalName().trim()) {
        toaster.toast("No journal was specified");
        return;
    }
    
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
    
    const userCredentials = {userIdentifier: userIdentifier};
    
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
            const permissions = response.permissions;
            const pleaseLogoutMessage = `<p style="margin-left: 1em">The NarraFirma site administration tool can only be accessed 
                with the site administrator account.</p>
                <p style="margin-left: 1em">Please <a href="/logout">log out</a>, then log back in with that account.`;
            if (!permissions.read) {
                document.body.innerHTML = pleaseLogoutMessage;
                return;
            }
            if (!permissions.write) {
                document.body.innerHTML = pleaseLogoutMessage;
                return;
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
    // The serverStatusPane may be created only after we start talking to the server
    // if (!serverStatusPane) return;
    
    const nameDiv = document.getElementById("narrafirma-name");
    if (!nameDiv) return;
    
    // TODO: Translate
    
    let statusText = "Server status: (" + status + ") " + text;

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
    
    pointrelClient.createJournal(journalIdentifier, function(error, response) {
        if (error || !response.success) {
            console.log("Error creating project", journalIdentifier, error, response);
            let message = "error";
            if (response) message = response.description;
            if (error) message = error.description
            if (error && typeof error.error === "string") message += "\n" + error.error.split("\n")[0];
            toaster.toast("Error creating project: " + journalIdentifier + " :: " + message);
        } else {
            console.log("Created project", journalIdentifier, response);
            allProjectsModel.projects.push({name: journalIdentifier.substring(narrafirmaProjectPrefix.length)});
            // Need to call redraw as event changing data was triggered by network
            alert("Created project: " + journalIdentifier);
            //location.reload();
            m.redraw();
        }
    });

}

function hideJournal(journalIdentifier) {
    console.log("hide-journal", journalIdentifier);
    
    pointrelClient.hideJournal(journalIdentifier, function(error, response) {
        if (error || !response.success) {
            console.log("Error hiding project", journalIdentifier, error, response);
            let message = "error";
            if (response) message = response.description;
            if (error) message = error.description
            if (error && typeof error.error === "string") message += "\n" + error.error.split("\n")[0];
            toaster.toast("Error hiding project: " + journalIdentifier + " :: " + message);
        } else {
            console.log("Successfully hid project", journalIdentifier, response);
            // Need to call redraw as event changing data was triggered by network
            alert('The directory for "' + journalIdentifier + '" has been renamed to ".' + journalIdentifier + '". Stop and restart the server (then reload this page) to refresh the project list.');
        }
    });

}

function addUser(userIdentifier, password) {
    console.log("add-user", userIdentifier, password);
    
    if (userIdentifier === "anonymous") {
        console.log("anonymous user is special and the password will not be used");
    }
    
    // Check if user exists first, as otherwise will remove all roles and override other settings
    const userInformation = allProjectsModel.users[userIdentifier];
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
    let index = -1;
    const roleStringified = JSON.stringify(role);
    for (let i = 0; i < roles.length; i++) {
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
    const userInformation = allProjectsModel.users[userIdentifier];
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        toaster.toast("Error: could not find user: " + userIdentifier);
        return;
    }
    
    // TODO: Should confirm the journal exists...
    
    let roleToAdd;
    if (topic) {
        // Fields need to be in alphabetical order for JSON comparison with messages stored in canonical form
        roleToAdd = {role: role, topic: topic};
    } else {
        roleToAdd = role;
    }
    let roles = userInformation.rolesForJournals[journalIdentifier];
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
    
    const userIdentifier = "anonymous";
    
    // Make sure the user already exists
    const userInformation = allProjectsModel.users[userIdentifier];
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        toaster.toast("Error: could not find user: " + userIdentifier);
        return;
    }
    
    const example = {"NarraFirmaProject-test1": [
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
    
    let roles = userInformation.rolesForJournals[journalIdentifier];
    if (!roles) {
        roles = [];
        userInformation.rolesForJournals[journalIdentifier] = roles;
    }

    // Fields need to be in alphabetical order for JSON comparison with messages stored in canonical form
    const readerRoleToAdd = {role: "reader", topic: "questionnaires"};

    let changed = false;
    if (findIndexForRole(roles, readerRoleToAdd) === -1) {
        roles.push(readerRoleToAdd);
        changed = true;
    }
 
    const writerRoleToAdd = {role: "writer", topic: "surveyResults"};
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
    const userInformation = allProjectsModel.users[userIdentifier];
    if (!userInformation) {
        console.log("Error: could not find user", userIdentifier);
        toaster.toast("Error: could not find user: " + userIdentifier);
        return;
    }
    
    // TODO: Should confirm the journal exists...
    
    let roleToRemove;
    if (topic) {
        // Fields need to be in alphabetical order for JSON comparison with messages stored in canonical form
        roleToRemove = {role: role, topic: topic};
    } else {
        roleToRemove = role;
    }
    let roles = userInformation.rolesForJournals[journalIdentifier];
    if (!roles) {
        roles = [];
        userInformation.rolesForJournals[journalIdentifier] = roles;
    }
    
    const indexToRemove = findIndexForRole(roles, roleToRemove);
    
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
    const createUserMessage = {
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
    const salt = PointrelClient.calculateSHA256("toolsOfAbundance" + Math.random() + new Date().toISOString());
    // TODO: client-side hashing of password: const hashOfPassword = PointrelClient.calculateSHA256(salt + PointrelClient.calculateSHA256("irony" + newUserIdentifier + password));
    const hashOfPassword = PointrelClient.calculateSHA256(salt + password);
    const userCredentials = {
        userIdentifier: newUserIdentifier,
        salt: salt,
        hashOfPassword: hashOfPassword
    };
    
    const credentialsMessage = {
        "_topicIdentifier": {type: "authenticationInformation", userIdentifier: newUserIdentifier},
        "_topicTimestamp": new Date().toISOString(),
        change: userCredentials
    };

    // Throwaway single-use pointrel client instance to access credentials journal
    const singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "credentials", {userIdentifier: userIdentifier});
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
    const singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
    singleUsePointrelClient.getCurrentUserInformation(function(error, response) {
        if (error) {
            console.log("error", error, response);
            alert("Something went wrong determining the current user identifier");
            return;
        }
        
        // Identical code in applications to get project list
        const projects = [];
        for (let key in response.journalPermissions) {
            if (!_.startsWith(key, narrafirmaProjectPrefix)) continue;
            const permissions = response.journalPermissions[key];
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

