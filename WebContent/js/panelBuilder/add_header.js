define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "./translate"
], function(
    at,
    ContentPane,
    lang,
    translate
){
    "use strict";
    
    function add_header(panelBuilder, contentPane, model, fieldSpecification) {
        var label = new ContentPane({
            content: panelBuilder.htmlForInformationIcon(panelBuilder.randomHelpPageURL(fieldSpecification.id)) + "&nbsp;&nbsp;" + "<b>" + translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt) + "</b>"
        });
        label.placeAt(contentPane);
        return label;
    }

    return add_header;
});