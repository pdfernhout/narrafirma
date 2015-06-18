import CheckboxesWidget = require("./CheckboxesWidget");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_checkboxes(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    // console.log("add_checkboxes", contentPane, model, fieldSpecification);
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);

    // Checkboxes modifies a dictionary which contains whether each checkbox is checked
    // It does not use an "at" since the checkboxes will modify the data directly
    // Ensure that there is a place to store data about each checkbox
    if (!model.get(fieldSpecification.id)) model.set(fieldSpecification.id, {});

    var checkboxesWidget = new CheckboxesWidget({
        questionID: fieldSpecification.id,
        choices: fieldSpecification.valueOptions,
        // optionsString: optionsString,
        value: model.get(fieldSpecification.id)
    });
    
    checkboxesWidget.placeAt(questionContentPane);
    return checkboxesWidget;
}

export = add_checkboxes;
