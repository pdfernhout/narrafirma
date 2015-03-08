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
    
    function add_storiesList(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_storiesList: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }

    return add_storiesList;
});