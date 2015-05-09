define([
    "dojox/mvc/at",
    "dijit/form/TextBox"
], function(
    at,
    TextBox
){
    "use strict";
    
    function add_text(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var textBox = new TextBox({
            value: at(model, fieldSpecification.id)
        });
        textBox.set("style", "width: 40em");
        if (fieldSpecification.readOnly) {
            textBox.attr("readOnly", true);
            textBox.attr("disabled", true);
        }
        textBox.placeAt(questionContentPane);
        return textBox;
    }

    return add_text;
});