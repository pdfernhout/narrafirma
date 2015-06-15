import RadioButtonsWidget = require("./RadioButtonsWidget");
import valuePathResolver = require("../valuePathResolver");

"use strict";

function add_radiobuttons(panelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    
    var radioButtonsWidget = new RadioButtonsWidget({
        questionID: fieldSpecification.id,
        choices: fieldSpecification.valueOptions,
        // optionsString: optionsString,
        value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
    });
     
    radioButtonsWidget.placeAt(questionContentPane);
    return radioButtonsWidget;
}

export = add_radiobuttons;
