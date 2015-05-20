define([
    "dijit/form/TextBox",
    "../valuePathResolver"
], function(
    TextBox,
    valuePathResolver
){
    "use strict";
    
    function add_text(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var textBox = new TextBox({
            value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
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