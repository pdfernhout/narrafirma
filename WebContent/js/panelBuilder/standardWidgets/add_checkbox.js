define([
    "dojox/mvc/at",
    "dijit/form/CheckBox"
], function(
    at,
    CheckBox
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