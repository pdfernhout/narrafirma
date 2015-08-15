(function() {
    "use strict";

    console.log("narrafirmaWordpressAdmin called");
    
    /* global m */
    
    var NarraFirmaAdminComponent = {
        controller: function(data) {
            return {greeting: "Hello from NarraFirmaAdminComponent", showJSON: false};
        },
        view: function(controller) {
            return m("div", [
                m("h1", controller.greeting),
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
        document.getElementById("narrafirma-json-form").style.display = display;
    }
    
    function startup() {
        document.getElementById("narrafirma-json-form").style.display = 'none';
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