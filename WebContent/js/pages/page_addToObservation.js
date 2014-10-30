// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"addToObservation_introduction", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"observationsListChoose", "type":"observationsList", "isInReport":true, "isGridColumn":false},
        {"id":"addToObservation_addResultToExistingObservationButton", "type":"button", "isInReport":false, "isGridColumn":false},
        {"id":"addToObservation_createNewObservationWithResultButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["page_createNewObservation"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addToObservation",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});