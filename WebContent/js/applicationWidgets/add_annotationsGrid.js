define([
    "dojox/mvc/at",
    "dojo/_base/lang",
    "js/panelBuilder/translate"
], function(
    at,
    lang,
    translate
){
    "use strict";
    
    function add_annotationsGrid(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = panelBuilder.newContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_annotationsGrid: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }

    return add_annotationsGrid;
});