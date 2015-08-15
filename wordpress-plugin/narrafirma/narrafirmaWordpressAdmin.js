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
                Object.keys(controller.journalDefinitions).map(function(journalIdentifier) {
                    return displayJournal(controller, journalIdentifier);
                }),
                m("button", {onclick: newProject.bind(null, controller)}, "New project"),
                m("br"),
                m("button", {onclick: cancelChanges.bind(null, controller), disabled: isJSONUnchanged}, "Cancel changes"),
                m("button", {onclick: saveChanges.bind(null, controller), disabled: isJSONUnchanged}, "Save changes"),
                m("hr"),
                m("span", {"for": "narrafirma-displayJSON"}, "Edit project permissions directly as JSON"),
                m("input[type=checkbox]", {id: "narrafirma-displayJSON", onclick: m.withAttr("checked", showJSONChecked.bind(null, controller)), checked: controller.showJSON})
            ]);
        }
    };
    
    function displayJournal(controller, journalIdentifier) {
        var journalDefinition = controller.journalDefinitions[journalIdentifier];
        return m("div", [
            journalIdentifier.substring(narrafirmaProjectPrefix.length),
            m("button", {onclick: deleteJournal.bind(null, controller, journalIdentifier)}, "delete"),
            m("br"),
            m("div", "  write: " + journalDefinition.write),
            m("div", "  read: " + journalDefinition.read),
            m("div", "  survey: " + journalDefinition.survey),
            m("div", "  anonymous survey: " + (journalDefinition.survey.indexOf(true) !== -1)),
        ]);
    }
    
    function deleteJournal(controller, key) {
        if (!confirm("Are you sure you want to delete: " + key + "?")) return;
        delete controller.journalDefinitions[key];
        writeJournalDefinitionsToTextarea(controller.journalDefinitions);
    }
    
    function newProject(controller) {
        var newName = prompt("New project name?");
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