define([
    "dijit/form/CheckBox",
    "../valuePathResolver"
], function(
    CheckBox,
    valuePathResolver
){
    "use strict";
    
    function add_checkbox(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var checkbox = new CheckBox({
            value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
        });
        
        checkbox.placeAt(questionContentPane);
        return checkbox;
    }

    return add_checkbox;
});