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
        
        var readOnly = fieldSpecification.displayReadOnly || false;
        var textBox = new TextBox({
            value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
        });
        textBox.set("style", "width: 100%"); // CFK was 40em
        if (readOnly) {
            textBox.attr("readOnly", true);
            // textBox.attr("disabled", true);
        }
        textBox.placeAt(questionContentPane);
        return textBox;
    }

    return add_text;
});