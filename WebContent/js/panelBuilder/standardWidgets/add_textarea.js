define([
    "dojox/mvc/at",
    "dijit/form/SimpleTextarea"
], function(
    at,
    SimpleTextarea
){
    "use strict";
    
    function add_textarea(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification); 
        var textarea = new SimpleTextarea({
            rows: "4",
            cols: "80",
            style: "width:auto;",
            value: at(model, fieldSpecification.id)
        });
        textarea.placeAt(questionContentPane);
        return textarea;
    }

    return add_textarea;
});