define([
    "dojox/mvc/at",
    "./RadioButtonsWidget"
], function(
    at,
    RadioButtonsWidget
){
    "use strict";
    
    function add_boolean(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var radioButtonsWidget = new RadioButtonsWidget({
            choices: null,
            // TODO: translate options
            optionsString: "yes\nno",
            value: at(model, fieldSpecification.id)
        });
        
        radioButtonsWidget.placeAt(questionContentPane);
        return radioButtonsWidget;
    }

    return add_boolean;
});