// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"observation_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"observation_text", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"observation__observationResultsList", "type":"accumulatedItemsGrid", "isReportable":true, "isHeader":true},
        {"id":"observation_firstInterpretation_text", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"observation_firstInterpretation_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"observation_firstInterpretation_idea", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"observation_firstInterpretation_excerptsList", "type":"grid", "isReportable":true, "isHeader":true},
        {"id":"observation_competingInterpretation_text", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"observation_competingInterpretation_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"observation_competingInterpretation_idea", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"observation_competingInterpretation_excerptsList", "type":"grid", "isReportable":true, "isHeader":true},
        {"id":"observation_thirdInterpretation_text", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"observation_thirdInterpretation_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"observation_thirdInterpretation_idea", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"observation_thirdInterpretation_excerptsList", "type":"grid", "isReportable":true, "isHeader":true}
    ];

    return {
        "id": "page_createOrEditObservation",
        "name": "Create new observation",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});