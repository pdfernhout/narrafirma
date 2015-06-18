import ToggleButton = require("dijit/form/ToggleButton");
import valuePathResolver = require("../valuePathResolver");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_toggleButton(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    
    // Toggle button maintains a "checked" flag, so we need to set value ourselves
    var toggleButton = new ToggleButton({
        label: "" + model.get(fieldSpecification.id),
        value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification),
        onChange: function(value) {
            this.set("label", value);
            this.set("value", value);
            panelBuilder.buttonClicked(contentPane, model, fieldSpecification, value);
        }
    });
    
    toggleButton.placeAt(questionContentPane);
    
    return toggleButton;
}

export = add_toggleButton;
