define([
    "./RadioButtonsWidget",
    "../valuePathResolver"
], function(
    RadioButtonsWidget,
    valuePathResolver
){
    "use strict";
    
    function add_boolean(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var radioButtonsWidget = new RadioButtonsWidget({
            choices: null,
            // TODO: translate options
            optionsString: "yes\nno",
            value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
        });
        
        radioButtonsWidget.placeAt(questionContentPane);
        return radioButtonsWidget;
    }

    return add_boolean;
});