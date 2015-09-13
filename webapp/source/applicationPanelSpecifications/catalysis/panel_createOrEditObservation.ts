import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_createOrEditObservation",
    modelClass: "Observation",
    panelFields: [
        {
            id: "observation_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this observation a name."
        },
        {
            id: "observation_text",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Observation",
            displayPrompt: "Please describe this observation."
        },
        {
            id: "observation__observationResultsList",
            valueType: "none",
            displayType: "accumulatedItemsGrid",
            displayConfiguration: "collectedStoriesAfterCollection",
            displayName: "Results",
            displayPrompt: "These are the results you have selected to include in this observation."
        },
        {
            id: "observation_firstInterpretation_text",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "First interpretation",
            displayPrompt: "Enter an interpretation of this observation.\nWhat does it mean?"
        },
        {
            id: "observation_firstInterpretation_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "First interpretation name",
            displayPrompt: "Please give this interpretation a short name (so you can refer to it later)."
        },
        {
            id: "observation_firstInterpretation_idea",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "First interpretation idea",
            displayPrompt: "If you like, you can record an idea that follows from this interpretation."
        },
        {
            id: "observation_firstInterpretation_excerptsList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_selectExcerpt",
            displayName: "First interpretation excerpts",
            displayPrompt: "You can add excerpts to this interpretation."
        },
        {
            id: "observation_competingInterpretation_text",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Competing interpretation",
            displayPrompt: "Now enter an interpretation that competes with the first one.\nWhat <i>else</i> could this pattern mean?"
        },
        {
            id: "observation_competingInterpretation_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Competing interpretation name",
            displayPrompt: "Please give this competing interpretation a short name."
        },
        {
            id: "observation_competingInterpretation_idea",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Competing interpretation idea",
            displayPrompt: "If you like, enter an idea that follows from your competing interpretation."
        },
        {
            id: "observation_competingInterpretation_excerptsList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_selectExcerpt",
            displayName: "Competing interpretation excerpts",
            displayPrompt: "You can add excerpts to the competing interpretation."
        },
        {
            id: "observation_thirdInterpretation_text",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Third interpretation",
            displayPrompt: "If a third interpretation of the pattern comes to mind, enter it here.\nIs there a third thing this pattern could mean?"
        },
        {
            id: "observation_thirdInterpretation_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Third interpretation name",
            displayPrompt: "Please give this third interpretation a short name."
        },
        {
            id: "observation_thirdInterpretation_idea",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Third interpretation idea",
            displayPrompt: "If you like, enter an idea that follows from your third interpretation."
        },
        {
            id: "observation_thirdInterpretation_excerptsList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_selectExcerpt",
            displayName: "Third interpretation excerpts",
            displayPrompt: "You can add excerpts to the third interpretation."
        }
    ]
};

export = panel;

