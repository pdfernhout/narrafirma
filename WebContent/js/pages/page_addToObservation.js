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

    return {
        "id": "page_addToObservation",
        "name": "Add to observation",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});