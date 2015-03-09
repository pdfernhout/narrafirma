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
    
    function add_label(panelBuilder, contentPane, model, fieldSpecification) {
        var label = new ContentPane({
            content: panelBuilder.htmlForInformationIcon(panelBuilder.randomHelpPageURL(fieldSpecification.id)) + "&nbsp;&nbsp;" + translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt)
        });
        label.placeAt(contentPane);
        return label;
    }

    return add_label;
});