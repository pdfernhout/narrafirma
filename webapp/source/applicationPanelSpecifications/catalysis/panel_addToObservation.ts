import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addToObservation",
    panelFields: [
        {
            id: "addToObservation_introduction",
            valueType: "none",
            displayType: "label",
            displayPrompt: "Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered."
        },
        {
            id: "observationsListChoose",
            valueType: "none",
            displayType: "observationsList",
            displayPrompt: "Choose an observation from this list to which to add the selected result, or create a new observation."
        },
        {
            id: "addToObservation_addResultToExistingObservationButton",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Add result to selected observation"
        },
        {
            id: "addToObservation_createNewObservationWithResultButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "panel_createNewObservation",
            displayPrompt: "Create new observation with this result"
        }
    ]
};

export = panel;

