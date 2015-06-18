import RadioButtonsWidget = require("./RadioButtonsWidget");
import valuePathResolver = require("../valuePathResolver");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_boolean(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
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

export = add_boolean;
