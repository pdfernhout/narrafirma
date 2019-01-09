(function() {
    "use strict";
    
    // Surprising issue: If you reload this page after making changes, the changes will reappear in Firefox because the textarea's content is carried forward.
   
    console.log("narrafirmaWordpressAdmin called");
    
    var narrafirmaProjectPrefix = "NarraFirmaProject-";
    
    // The div containing the form to edit JSON directly
    var jsonForm;
    
    // The textarea in the form
    var journalsTextarea;
    
    /* global m */
    
    var NarraFirmaAdminComponent = {
        controller: function(data) {
            return {
                showJSON: false,
                // Read JSON twice to ensure changing the second copy won't affect the first
                originalJournalDefinitions: readJournalDefinitionsFromTextarea(),
                journalDefinitions: readJournalDefinitionsFromTextarea()
            };
        },
        view: function(controller) {
            var isJSONUnchanged = true;
            try {
                isJSONUnchanged = JSON.stringify(controller.originalJournalDefinitions) === JSON.stringify(controller.journalDefinitions);
            } catch (e) {
                console.log("Problem comparing JSON for old and new journal definitions", e);
            }
                
            const buttonStyle = "font-size: 1.2em; background: #ffbb84; padding: 0.3em; margin-bottom: 0.5em";
            return m("div", [
                m("h3", "NarraFirma projects"), 
                m("p", `
                    To specify project permissions, enter one or more space-separated WordPress user IDs (e.g. samsmith) or 
                    WordPress roles (e.g. administrator, editor, author, contributor, subscriber). 
                    Only give write access to people you trust. 
                    `),
                Object.keys(controller.journalDefinitions).length ? 
                Object.keys(controller.journalDefinitions).map(function(journalIdentifier) {
                    return displayJournal(controller, journalIdentifier);
                }) : m("p[style='font-weight: bold; font-style: italic;']", "No projects yet! Create a new one.")
                ,
                m("button", {"style": buttonStyle, onclick: cancelChanges.bind(null, controller), disabled: isJSONUnchanged}, "Cancel changes"),
                " ",
                m("button", {"style": buttonStyle, onclick: saveChanges.bind(null, controller), disabled: isJSONUnchanged}, "Save changes"),
                " ",
                m("button", {"style": buttonStyle, onclick: newProject.bind(null, controller)}, "Create New Project"),
                m("p", `New projects are not saved until you click the \"Save changes\" button. 
                    Deleting a project will make it unavailable, but the data will still be stored and can be re-accessed 
                    by creating a project with the same name.
                    `),
                m("br"),
                m("div[style='margin-top: 1em;']", [
                    m("input[type=checkbox][style='margin-left:0.5em']", 
                        {id: "narrafirma-displayJSON", onclick: m.withAttr("checked", showJSONChecked.bind(null, controller)), checked: controller.showJSON}),
                        m("span", {"for": "narrafirma-displayJSON"}, "Edit project permissions directly as JSON"),
                    ])
            ]);
        }
    };

    // NF WP entry project
    // NLEDU5
    
    function anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, field) {
        var checked = journalDefinition[field].indexOf(true) !== -1;
        var updateAnonymousAccess = function(newCheckedValue) {
            if (newCheckedValue) {
                if (journalDefinition[field].indexOf(true) === -1) {
                    journalDefinition[field].push(true);
                }
            } else {
                journalDefinition[field] = journalDefinition[field].filter(function (each) {
                    return each !== true;
                });
            }
            writeJournalDefinitionsToTextarea(controller.journalDefinitions);
        };
        const id = "narrafirma-anonymous-access-" + field;
        return m("div", {"style": "margin-left: 2em"}, [
            m("input[type=checkbox]", {id: id, onclick: m.withAttr("checked", updateAnonymousAccess), checked: checked}),
            m("label", {"for": id}, "Anonymous (not logged in) site visitors have " + field + " access "),
        ]);
    }
    
    function permissionsEditor(controller, journalIdentifier, journalDefinition, field, message) {
        var permissionsToDisplay = journalDefinition[field].filter(function (each) {
            return each !== true;
        });
        var checked = journalDefinition[field].indexOf(true) !== -1;
        return m("label", {style: "margin-left: 2em"}, [
            message + ": ",
            m("input[type=text]", {style: "width: 90%; margin-left: 2em;", value: permissionsToDisplay.join(" "), onchange: function (event) {
                var items = event.currentTarget.value.trim().split(/\s+/g);
                if (checked) items.push(true);
                journalDefinition[field] = items;
                console.log("on change", items);
                writeJournalDefinitionsToTextarea(controller.journalDefinitions);
            }}),
            m("br")
        ]);
    }
    
    function displayJournal(controller, journalIdentifier) {
        var journalDefinition = controller.journalDefinitions[journalIdentifier];
        return m("div.narrafirma-project[style='background-color:#d5dae6;']", [
            m("br"),
            m("span", {style: "font-size: 1.3em; font-weight: 600; margin-left: 0.5em;"}, [
                 'Project: ',
                 journalIdentifier.substring(narrafirmaProjectPrefix.length)
            ]),
            m("button.delete-button", {style: "margin-left: 0.5em", onclick: deleteJournal.bind(null, controller, journalIdentifier)}, "Delete"),
            m("br"),
            m("br"),

            permissionsEditor(controller, journalIdentifier, journalDefinition, "survey", "These WordPress user IDs or roles have SURVEY access (can take the survey but cannot see or change information on project screens)"),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "survey"),
            m("br"),
            m("br"),

            permissionsEditor(controller, journalIdentifier, journalDefinition, "read", "These WordPress user IDs or roles have READ access (can see but not change information on project screens)"),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "read"),
            m("br"),
            m("br"),

            permissionsEditor(controller, journalIdentifier, journalDefinition, "write", "These WordPress user IDs or roles have WRITE access (can see and change information on project screens; can also take the survey)"),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "write"),
            m("br"),

            m("hr")
        ]);
    }
    
    function deleteJournal(controller, key) {
        if (!confirm("Are you sure you want to delete: " + key + "?")) return;
        delete controller.journalDefinitions[key];
        writeJournalDefinitionsToTextarea(controller.journalDefinitions);
    }
    
    function newProject(controller) {
        var newName = prompt("Please enter a short name for the new project. It must be 20 characters or shorter.");
        if (!newName) return;
        if (newName.length > 20) {
            alert("That project name is " + newName.length + " characters long. Please try again with name that is 20 characters or shorter.");
            return;
        }
        var key = narrafirmaProjectPrefix + newName;
        if (controller.journalDefinitions[key]) {
            alert("A project with that name already exists.");
            return;
        }
        controller.journalDefinitions[key] = {
            write: [],
            read: [],
            survey: []
        };
        writeJournalDefinitionsToTextarea(controller.journalDefinitions);
    }
    
    function cancelChanges(controller) {
        if (!confirm("Are you sure you want to discard recent changes?")) return;
        writeJournalDefinitionsToTextarea(controller.originalJournalDefinitions);
        controller.journalDefinitions = readJournalDefinitionsFromTextarea();
    }
    
    function saveChanges(controller) {
        document.getElementById("submit").click();
    }
    
    function showJSONChecked(controller, checked) {
        controller.showJSON = checked;
        var display = "none";
        if (controller.showJSON) {
            display = "block";
        }
        jsonForm.style.display = display;
    }
    
    function writeJournalDefinitionsToTextarea(journalDefinitions) {
        journalsTextarea.value = JSON.stringify(journalDefinitions, null, 4);
    }
    
    function readJournalDefinitionsFromTextarea() {
        var text = journalsTextarea.value;
        console.log("readJournalDefinitionsFromTextarea", text);
        try {
            return JSON.parse(text);
        } catch (e) {
            console.log("Problem parsin JSON", e);
            return {};
        }
    }
    
    function startup() {
        jsonForm = document.getElementById("narrafirma-json-form");
        jsonForm.style.display = 'none';
        journalsTextarea = document.getElementsByName("narrafirma_admin_settings[journals]")[0];
        m.mount(document.getElementById("narrafirma-project-list-editor"), NarraFirmaAdminComponent);
    }
    
    // From: http://stackoverflow.com/questions/807878/javascript-that-executes-after-page-load
    if (window.attachEvent) {
        window.attachEvent('onload', startup);
    } else {
        if (window.onload) {
            var curronload = window.onload;
            var newonload = function() {
                curronload();
                startup();
            };
            window.onload = newonload;
        } else {
            window.onload = startup;
        }
    }
  
})();