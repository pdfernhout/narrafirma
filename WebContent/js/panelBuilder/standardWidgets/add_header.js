define([
    "../translate"
], function(
    translate
){
    "use strict";
    
    function add_header(panelBuilder, contentPane, model, fieldSpecification) {
        var content = "<b>" + translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt) + "</b>";
        if (panelBuilder.addHelpIcons) {
            content = panelBuilder.htmlForInformationIcon(panelBuilder.helpPageURLForField(fieldSpecification)) + "&nbsp;&nbsp;" + content;
        }
        var label = panelBuilder.newContentPane({
            content: content
        });
        label.placeAt(contentPane);
        return label;
    }

    return add_header;
});