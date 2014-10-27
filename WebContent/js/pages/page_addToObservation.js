// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "addToObservation_introduction");
        widgets.add_observationsList(contentPane, model, "observationsListChoose");
        widgets.add_button(contentPane, model, "addToObservation_addResultToExistingObservationButton");
        widgets.add_button(contentPane, model, "addToObservation_createNewObservationWithResultButton", ["page_createNewObservation"]);
    }

    var questions = [
        {"id":"addToObservation_introduction", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"observationsListChoose", "type":"observationsList", "isInReport":true, "isGridColumn":false},
        {"id":"addToObservation_addResultToExistingObservationButton", "type":"button", "isInReport":false, "isGridColumn":false},
        {"id":"addToObservation_createNewObservationWithResultButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["page_createNewObservation"]}
    ];

    return {
        "id": "page_addToObservation",
        "name": "Add to observation",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});