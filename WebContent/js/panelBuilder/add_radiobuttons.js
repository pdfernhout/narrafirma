define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "./RadioButtonsWidget",
    "js/translate"
], function(
    at,
    ContentPane,
    lang,
    RadioButtonsWidget,
    translate
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