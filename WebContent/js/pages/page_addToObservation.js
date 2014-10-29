// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"addToObservation_introduction", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"observationsListChoose", "type":"observationsList", "isInReport":true, "isGridColumn":false},
        {"id":"addToObservation_addResultToExistingObservationButton", "type":"button", "isInReport":false, "isGridColumn":false},
        {"id":"addToObservation_createNewObservationWithResultButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["page_createNewObservation"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addToObservation",
        "name": "Add to observation",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});