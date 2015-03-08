define([], function() {
    "use strict";
    return [
        {
            id: "panel_annotateInterpretationForPerspective",
            displayName: "Annotate interpretation for perspective",
            displayType: "panel",
            section: "catalysis",
            modelClass: "AnnotateInterpretationForPerspectiveModel"
        },
        {
            id: "perspective_interpretationLinkageNotes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any notes you want to remember about this interpretation as it is linked to this perspective."
        }
    ];
});
