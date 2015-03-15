define([
    "dojox/mvc/at",
    "dijit/form/Button",
    "dojo/_base/lang",
    "../translate"
], function(
    at,
    Button,
    lang,
    translate
){
    "use strict";
    
    function add_label(panelBuilder, contentPane, model, fieldSpecification) {
        var label = panelBuilder.newContentPane({
            content: panelBuilder.htmlForInformationIcon(panelBuilder.helpPageURLForField(fieldSpecification)) + "&nbsp;&nbsp;" + translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt)
        });
        label.placeAt(contentPane);
        return label;
    }

    return add_label;
});