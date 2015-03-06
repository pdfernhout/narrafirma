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
    
    function add_image(panelBuilder, contentPane, model, fieldSpecification) {
        var imageSource = fieldSpecification.displayConfiguration;
        var questionText = translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt || "");
        var image = new ContentPane({
            content: questionText + "<br>" + '<img src="' + imageSource + '" alt="Image for question: ' + questionText + '">'
        });
        image.placeAt(contentPane);
        return image;
    }

    return add_image;
});