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
                
            return m("div", [
                m("h3", "NarraFirma projects and permissions"), 
                "To specify permissions, enter one or more space-separated user IDs (e.g. cfkurtz) or roles (e.g. administrator, editor, author, contributor, subscriber). Write access also grants read access and survey access.",
                Object.keys(controller.journalDefinitions).map(function(journalIdentifier) {
                    return displayJournal(controller, journalIdentifier);
                }),
                m("button", {onclick: newProject.bind(null, controller)}, "New project"),
                m("br"),
                m("br"),
                m("button", {onclick: cancelChanges.bind(null, controller), disabled: isJSONUnchanged}, "Cancel changes"),
                " ",
                m("button", {onclick: saveChanges.bind(null, controller), disabled: isJSONUnchanged}, "Save changes"),
                m("br"),
                "New projects are not saved until you click the \"Save changes\" button. Deleting a project will make it unavailable, but the data will still be stored and can be re-accessed by creating a project with the same name.",
                m("hr"),
                m("span", {"for": "narrafirma-displayJSON"}, "Edit project permissions directly as JSON"),
                m("input[type=checkbox]", {id: "narrafirma-displayJSON", onclick: m.withAttr("checked", showJSONChecked.bind(null, controller)), checked: controller.showJSON})
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
        return m("label", {style: "margin-left: 2em"}, [
            "anonymous " + field,
            m("input[type=checkbox]", {onclick: m.withAttr("checked", updateAnonymousAccess), checked: checked})
        ]);
    }
    
    function permissionsEditor(controller, journalIdentifier, journalDefinition, field) {
        var permissionsToDisplay = journalDefinition[field].filter(function (each) {
            return each !== true;
        });
        var checked = journalDefinition[field].indexOf(true) !== -1;
        return m("label", {style: "margin-left: 2em"}, [
            field + ": ",
            m("input[type=text]", {style: "width: 90%", value: permissionsToDisplay.join(" "), onchange: function (event) {
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
        return m(".narrafirma-project", [
            m("br"),
            m("span", {style: "font-size: 1.3em; font-weight: 600"}, [
                 'Project: ',
                 journalIdentifier.substring(narrafirmaProjectPrefix.length)
            ]),
            m("button.delete-button", {style: "margin-left: 0.5em", onclick: deleteJournal.bind(null, controller, journalIdentifier)}, "Delete"),
            m("br"),
            m("br"),
            permissionsEditor(controller, journalIdentifier, journalDefinition, "write"),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "write"),
            m("br"),
            m("br"),
            permissionsEditor(controller, journalIdentifier, journalDefinition, "read"),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "read"),
            m("br"),
            m("br"),
            permissionsEditor(controller, journalIdentifier, journalDefinition, "survey"),
            anonymousAccessCheckbox(controller, journalIdentifier, journalDefinition, "survey"),
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
        var newName = prompt("Please enter a short name for the new project.");
        if (!newName) return;
        var key = narrafirmaProjectPrefix + newName;
        if (controller.journalDefinitions[key]) {
            alert("A project with that name already exists");
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