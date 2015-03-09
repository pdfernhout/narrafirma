define([
    "dojox/mvc/at",
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "./translate"
], function(
    at,
    Button,
    ContentPane,
    lang,
    translate
){
    "use strict";
    
    function add_button(panelBuilder, contentPane, model, fieldSpecification, callback) {
        if (!callback) callback = lang.hitch(panelBuilder, panelBuilder.buttonClicked, contentPane, model, fieldSpecification);
        
        var button = new Button({
            label: translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt),
            type: "button",
            onClick: callback
        });

        button.placeAt(contentPane);
        return button;
    }

    return add_button;
});