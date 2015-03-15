define([
    "dojox/mvc/at",
    "dijit/form/CheckBox",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "../translate"
], function(
    at,
    CheckBox,
    ContentPane,
    lang,
    translate
){
    "use strict";
    
    function add_checkbox(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var checkbox = new CheckBox({
            value: at(model, fieldSpecification.id)
        });
        
        checkbox.placeAt(questionContentPane);
        return checkbox;
    }

    return add_checkbox;
});