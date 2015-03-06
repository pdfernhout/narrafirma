define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "js/translate"
], function(
    at,
    ContentPane,
    lang,
    translate
){
    "use strict";
    
 // TODO: Remove this -- just for testing/demo purposes
    function randomHelpPageURL(id) {
        var index = (Math.floor(Math.random() * 8) + 1);
        var url = 'http://www.kurtz-fernhout.com/help100/0000000' + index + '.htm' + "#" + id;
        return url;
    }
    
    function add_header(panelBuilder, contentPane, model, fieldSpecification) {
        var label = new ContentPane({
            content: panelBuilder.htmlForInformationIcon(panelBuilder.randomHelpPageURL(fieldSpecification.id)) + "&nbsp;&nbsp;" + "<b>" + translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt) + "</b>"
        });
        label.placeAt(contentPane);
        return label;
    }

    return add_header;
});