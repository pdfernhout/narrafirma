define([], function() {
    "use strict";
    return [
        {
            id: "panel_addPerspective",
            displayName: "Add or change perspective",
            displayType: "panel",
            section: "catalysis",
            modelClass: "PerspectiveModel"
        },
        {
            id: "perspective_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this perspective a name."
        },
        {
            id: "perspective_description",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Perspective",
            displayPrompt: "Describe this perspective."
        },
        {
            id: "perspective_linkedResultsList",
            dataType: "none",
            displayType: "annotationsGrid",
            displayConfiguration: "panel_annotateResultForPerspective",
            displayPrompt: "Results linked to this perspective"
        },
        {
            id: "perspective_linkedExcerptsList",
            dataType: "none",
            displayType: "annotationsGrid",
            displayConfiguration: "panel_annotateExcerptForPerspective",
            displayPrompt: "Excerpts linked to this perspective"
        },
        {
            id: "perspective_linkedInterpretationsList",
            dataType: "none",
            displayType: "annotationsGrid",
            displayConfiguration: "panel_annotateInterpretationForPerspective",
            displayPrompt: "Interpretations linked to this perspective"
        }
    ];
});
