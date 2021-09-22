(function() {
    "use strict";
    
    // Surprising issue: If you reload this page after making changes, the changes will reappear in Firefox because the textarea's content is carried forward.
   
    console.log("narrafirmaWordpressAdmin called");
    
    const narrafirmaProjectPrefix = "NarraFirmaProject-";
    
    // The div containing the form to edit JSON directly
    let jsonForm;
    
    // The textarea in the form
    let journalsTextarea;
    
    /* global m */

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    
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
            let isJSONUnchanged = true;
            try {
                isJSONUnchanged = JSON.stringify(controller.originalJournalDefinitions) === JSON.stringify(controller.journalDefinitions);
            } catch (e) {
                console.log("Problem comparing JSON for old and new journal definitions", e);
            }
                
            const buttonStyle = "font-size: 1.2em; background: #ffbb84; padding: 0.3em; margin-bottom: 0.5em";
            return m("div", [
                m("h1", "Projects"), 
                m("p", `To specify project permissions, enter one or more space-separated WordPress user IDs (e.g. samsmith) or 
                    roles (e.g. administrator, editor, author, contributor, subscriber) in the boxes below.`),
                Object.keys(controller.journalDefinitions).length ? 
                Object.keys(controller.journalDefinitions).map(function(journalIdentifier) {
                    const definition = controller.journalDefinitions[journalIdentifier];
                    if (!definition.hasOwnProperty("archived") || !definition.archived) {
                        return displayJournal(controller, journalIdentifier);
                    }
                }) : m("p[style='font-weight: bold; font-style: italic;']", "No projects yet! Create a new one."),
                m("div"), {style: "margin: 0.5em 0"}, [
                    m("button", {"style": buttonStyle, onclick: cancelChanges.bind(null, controller), disabled: isJSONUnchanged}, "Cancel changes"),
                    " ",
                    m("button", {"style": buttonStyle, onclick: saveChanges.bind(null, controller), disabled: isJSONUnchanged}, "Save changes"),
                    " ",
                    m("button", {"style": buttonStyle, onclick: newProject.bind(null, controller)}, "Create New Project"),
                ],
                m("div", `New projects and changes to permissions are not saved until you click the \"Save changes\" button.`),
                m("div", {style: 'margin-top: 1em;'}, [
                    m("hr", {style: "border-top: 2px solid gray"}),
                    m("input[type=checkbox]", {
                            style: 'margin-left:0.5em', 
                            id: "narrafirma-displayJSON", 
                            onclick: m.withAttr("checked", showJSONChecked.bind(null, controller)), 
                            checked: controller.showJSON
                        }),
                        m("span", {for: "narrafirma-displayJSON"}, "Edit project permissions directly as JSON"),
                    ])
            ]);
        }
    };

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
        return m("div", {style: "margin: 0.5em 0"}, [
            m("input[type=checkbox]", {id: id, onclick: m.withAttr("checked", updateAnonymousAccess), checked: checked}),
            m("label", {"for": id}, "Allow " + field + " access to anonymous (not logged in) site visitors"),
        ]);
    }

    function permissionsEditor(controller, journalIdentifier, journalDefinition, field, message) {
        var permissionsToDisplay = journalDefinition[field].filter(function (each) { return each !== true; });
        var checked = journalDefinition[field].indexOf(true) !== -1;
        const id = "narrafirma-permission-" + journalIdentifier + "-" + field;
        return m("div", [
            m("span", {style: "font-weight: bold"}, field.charAt(0).toUpperCase() + field.slice(1) + " access"),
            m("label", {for: id, style: "display: block; padding: 0.5em 0"}, message),
            m("input[type=text]", {
                id: id, 
                style: "width: 80%; margin: 0.5em 0", 
                value: permissionsToDisplay.join(" "), 
                onchange: function (event) {
                    var items = event.currentTarget.value.trim().split(/\s+/g);
                    if (checked) items.push(true);
                    journalDefinition[field] = items;
                    console.log("on change", items);
                    writeJournalDefinitionsToTextarea(controller.journalDefinitions);
                }
            })
        ]);
    }

    function displayJournal(controller, journalIdentifier) {
        const journalDefinition = controller.journalDefinitions[journalIdentifier];
        const projectShortName = journalIdentifier.substring(narrafirmaProjectPrefix.length);

        const archiveProject = function(event) {
            const prompt = "Are you sure you want to archive (hide) this project?";
            if (confirm(prompt)) {
                journalDefinition["archived"] = true;
                console.log("Archived project ", journalIdentifier);
                writeJournalDefinitionsToTextarea(controller.journalDefinitions);
                const tableName = "wp_narrafirma_j_narrafirmaproject_" + replaceAll(projectShortName, " ", "_").toLowerCase();
                const message = 'You have archived the project "' + projectShortName + '."' +
                    '\n\nTo un-archive this project, create a new project with the same name. ' + 
                    'You can also check "Edit project permissions directly as JSON," then change the value of the project\'s "archived" field (from true to false). ' +
                    '\n\nTo delete the project permanently, (a) check "Edit project permissions directly as JSON," (b) remove the project\'s entire entry from the list, ' +
                    ' then (c) use a WordPress plugin to delete the project\'s database table, which is called:\n\n    ' + tableName;
                alert(message);
                document.getElementById("submit").click();
            }
        };
        
        const tableCells = [];
        tableCells.push(m("td", {style: "padding: 1em; text-align: left; border: 1px solid gray"}, [
            permissionsEditor(controller, journalIdentifier, journalDefinition, "survey", "These WordPress user IDs or roles can take the survey but cannot see or change information on project screens."),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "survey")
        ]));
        tableCells.push(m("td", {style: "padding: 1em; text-align: left; border: 1px solid gray"}, [
            permissionsEditor(controller, journalIdentifier, journalDefinition, "read", "These WordPress user IDs or roles can see but not change information on project screens."),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "read")
        ]));
        tableCells.push(m("td", {style: "padding: 1em; text-align: left; border: 1px solid gray"}, [
            permissionsEditor(controller, journalIdentifier, journalDefinition, "write", "These WordPress user IDs or roles can see and change information on project screens. (Only give write access to people you trust.)"),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "write")
        ])); 

        const tableRows = [];
        tableRows.push(m("tr", [
            m("td", {colspan: 2}, m("h2", {style: "margin: 0.5em 0;"}, projectShortName)),
            m("td", {style: "text-align: right"}, m("button", {style: "font-size: 1em; margin-right: 0.5em;", onclick: archiveProject}, "Archive"))
        ]));
        tableRows.push(m("tr", tableCells));

        const parts = [];
        parts.push(m("table", {style: "border-collapse: collapse"}, tableRows));

        return(m("div", {style: 'background-color: #d5dae6; padding: 0.5em; margin: 1em 0;'}, parts));
    }
    
    function newProject(controller) {
        var newName = prompt("Please enter a short name for the new project. It must be 20 characters or shorter.");
        if (!newName) return;
        if (newName.length > 20) {
            alert("That project name is " + newName.length + " characters long. Please try again with a name that is 20 characters or shorter.");
            return;
        }
        var key = narrafirmaProjectPrefix + newName;
        if (controller.journalDefinitions[key]) {
            if (!controller.journalDefinitions[key].hasOwnProperty("archived") || !controller.journalDefinitions[key]["archived"]) {
                alert("A project with that name already exists.");
                return;
            }
        }
        controller.journalDefinitions[key] = {
            write: [],
            read: [],
            survey: [],
            archived: false
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
        if (jsonForm) {
            jsonForm.style.display = display;
        }
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
        if (!jsonForm) {
            m.mount(document.body, m("div", "JSON form could not be found."));
        } else {
            jsonForm.style.display = 'none';
            journalsTextarea = document.getElementsByName("narrafirma_admin_settings[journals]")[0];
            m.mount(document.getElementById("narrafirma-project-list-editor"), NarraFirmaAdminComponent);
        }
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