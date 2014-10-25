"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "observation_name");
        widgets.add_textarea(contentPane, model, "observation_text");
        widgets.add_accumulatedItemsGrid(contentPane, model, "observation__observationResultsList", ["collectedStoriesAfterCollection"]);
        widgets.add_textarea(contentPane, model, "observation_firstInterpretation_text");
        widgets.add_text(contentPane, model, "observation_firstInterpretation_name");
        widgets.add_textarea(contentPane, model, "observation_firstInterpretation_idea");
        widgets.add_grid(contentPane, model, "observation_firstInterpretation_excerptsList", ["page_selectExcerpt"]);
        widgets.add_textarea(contentPane, model, "observation_competingInterpretation_text");
        widgets.add_text(contentPane, model, "observation_competingInterpretation_name");
        widgets.add_textarea(contentPane, model, "observation_competingInterpretation_idea");
        widgets.add_grid(contentPane, model, "observation_competingInterpretation_excerptsList", ["page_selectExcerpt"]);
        widgets.add_textarea(contentPane, model, "observation_thirdInterpretation_text");
        widgets.add_text(contentPane, model, "observation_thirdInterpretation_name");
        widgets.add_textarea(contentPane, model, "observation_thirdInterpretation_idea");
        widgets.add_grid(contentPane, model, "observation_thirdInterpretation_excerptsList", ["page_selectExcerpt"]);
    }

    return {
        "id": "page_createOrEditObservation",
        "name": "Create new observation",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});