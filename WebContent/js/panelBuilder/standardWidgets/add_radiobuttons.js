define([
    "dojox/mvc/at",
    "./RadioButtonsWidget"
], function(
    at,
    RadioButtonsWidget
){
    "use strict";
    
    function add_radiobuttons(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var radioButtonsWidget = new RadioButtonsWidget({
            questionID: fieldSpecification.id,
            choices: fieldSpecification.dataOptions,
            // optionsString: optionsString,
            value: at(model, fieldSpecification.id)
        });
         
        radioButtonsWidget.placeAt(questionContentPane);
        return radioButtonsWidget;
    }

    return add_radiobuttons;
});