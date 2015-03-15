define([
    "dojox/mvc/at",
    "dojo/_base/lang",
    "../translate"
], function(
    at,
    lang,
    translate
){
    "use strict";
    
    function add_header(panelBuilder, contentPane, model, fieldSpecification) {
        var label = panelBuilder.newContentPane({
            content: panelBuilder.htmlForInformationIcon(panelBuilder.helpPageURLForField(fieldSpecification)) + "&nbsp;&nbsp;" + "<b>" + translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt) + "</b>"
        });
        label.placeAt(contentPane);
        return label;
    }

    return add_header;
});