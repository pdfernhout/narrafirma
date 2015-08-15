(function() {
    "use strict";

    console.log("narrafirmaWordpressAdmin called");
    
    // The div containing the form to edit JSON directly
    var jsonForm;
    
    // The textarea in the form
    var journalsTextarea;
    
    /* global m */
    
    var NarraFirmaAdminComponent = {
        controller: function(data) {
            return {
                greeting: "Hello from NarraFirmaAdminComponent",
                showJSON: false,
                journalDefinitions: readJournalDefinitions()
            };
        },
        view: function(controller) {
            return m("div", [
                m("h1", controller.greeting),
                Object.keys(controller.journalDefinitions).map(function(key) {
                    return m("div", key);
                }),
                m("span", {"for": "narrafirma-displayJSON"}, "Edit JSON directly"),
                m("input[type=checkbox]", {id: "narrafirma-displayJSON", onclick: m.withAttr("checked", showJSONChecked.bind(null, controller)), checked: controller.showJSON})
            ]);
        }
    };
    
    function showJSONChecked(controller, checked) {
        controller.showJSON = checked;
        var display = "none";
        if (controller.showJSON) {
            display = "block";
        }
        jsonForm.style.display = display;
    }
    
    function readJournalDefinitions() {
        var text = journalsTextarea.value;
        console.log("readJournalDefinitions", text);
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
        readJournalDefinitions();
        
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